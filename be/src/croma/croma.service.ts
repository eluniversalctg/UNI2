import * as _ from 'lodash';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CreateCromaDto } from './dto/create-croma.dto';
import { MatomoService } from 'src/matomo/matomo.service';
import { RelatedCromaDto } from './dto/related-croma.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { DomainsService } from 'src/domains/domains.service';
import { Article, ArticleDocument } from './entities/croma.entity';
import { PlaceholdersService } from 'src/placeholders/placeholders.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CromaService {
  placeholders: any[] = [];
  constructor(
    private placeholdersService: PlaceholdersService,
    @InjectModel(Article.name, 'CromaAIdb')
    private readonly articleModel: Model<ArticleDocument>,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly matomoSrv: MatomoService,
    private readonly domainService: DomainsService,
  ) { }

  /**
   * save articles on CROMA DB
   * @param createCromaDto
   * @returns saved article
   */
  async create(createCromaDto: CreateCromaDto) {
    try {
      // validate if link is valid
      if (!createCromaDto.link.includes('http')) {
        createCromaDto.link = `https://${createCromaDto.link}`;
      }

      const domain = new URL(createCromaDto.link);
      const domainName = domain.hostname;

      const link = await this.domainService.findOne(domainName);

      //if domain exist then save article
      if (link.length > 0) {
        const response = await lastValueFrom(
          this.httpService
            .post(`${this.config.get<string>('CROMA_URL')}/add`, createCromaDto)
            .pipe(
              map((response) => {
                return response.data;
              }),
              catchError((e) => {
                throw new HttpException(e.response.data, e.response.status);
              }),
            ),
        );
        return response;
      }
      return 'Dominio no valido.';
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @returns all articles from CROMA DB
   */
  async findAll() {
    const response = await lastValueFrom(
      this.httpService
        .get(`${this.config.get<string>('CROMA_URL')}/articles`)
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return response;
  }

  /**
   * get articles related from CROMA DB
   * @param relatedCromaDto
   * @returns related articles
   */
  async related(relatedCromaDto: RelatedCromaDto) {
    const response = await lastValueFrom(
      this.httpService
        .get(
          `${this.config.get<string>('CROMA_URL')}/related?id=${relatedCromaDto.id
          }&years=${relatedCromaDto.years}&months=${relatedCromaDto.months
          }&days=${relatedCromaDto.days}&radius=${relatedCromaDto.radius}`,
        )
        .pipe(
          map((response) => this.searchArticles(response.data)),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return response;
  }

  /**
   * @param text any string to search
   * @returns related articles
   */
  async analyzer_text(
    text: string,
    tags?: string,
    period?: string,
    date?: string,
  ) {
    const response = await lastValueFrom(
      this.httpService
        .post(`${this.config.get<string>('CROMA_URL')}/analyzer/text`, text, {
          headers: { 'Content-Type': 'application/json' },
        })
        .pipe(
          map((response) =>
            this.searchArticles(response.data, tags, period, date),
          ),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
    return response;
  }

  /**
   * @param word any word to analize
   * @returns
   */
  similar_words(word: string) {
    const response = this.httpService
      .post(
        `${this.config.get<string>('CROMA_URL')}/w2v/similar`,
        { word },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .pipe(
        map((response) => {
          return [response.data];
        }),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
    return response;
  }

  async getNews(id): Promise<any> {
    const response = await lastValueFrom(this.httpService
      .get(
        `${this.config.get<string>('CROMA_URL')}/article?id=${id}`,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .pipe(
        map((response) => {
          const article = response.data.article;
          article['_id'] = article._id.$oid;
          article['publication'] = article.publication.$oid;
          article['publish_date'] = new Date(article.publish_date.$date);
          return response.data.article;
        }),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      )
    );
    return response;
  }

  /**
   * @param data all data from croma related articles
   * @returns articles populated
   */
  async searchArticles(data, tags?: string, period?: string, date?: string) {
    // get placeholders to database
    this.getPlaceholders();

    // search for article on CromaAI DB.
    for (let i = 0; i < data.related_articles.length; i++) {
      const element = data.related_articles[i];
      const article = await this.getNews(
        element.article_id
      );

      //verify html valid
      const htmlValid = await this.getHTML(article.url);

      //set similarity as 100 %
      element.similarity = `${Number(Number(element.similarity) * 100).toFixed(
        2,
      )}%`;

      // *************** get matomo tags******************

      if (tags && period && date) {
        data.related_articles[i].matomo = await this.getMatomoTags(
          tags,
          period,
          date,
          element,
        );
      } else {
        data.related_articles[i].matomo = [];
      }

      data.related_articles[i].metadata = htmlValid;

      data.related_articles[i] = {
        ...element,
        ...JSON.parse(JSON.stringify(article)),
      };
    }
    return [data];
  }

  async getMatomoTags(tags, period, date, article) {
    // *************** get matomo tags******************

    // split tags params
    const tagsToUse: string[] = tags.split('&');

    const matomo: any[] = [];
    for (let j = 0; j < tagsToUse.length; j++) {
      let param = '';
      let element2 = tagsToUse[j];
      let findCustomParam = element2.search('_').toString();
      if (findCustomParam !== '-1') {
        findCustomParam = element2.split('_')[1];
        element2 = element2.split('_')[0];
        param = `method=${element2}&period=${period}&date=${date}&segment=entryPageUrl==${encodeURIComponent(
          article.url,
        )}&idSite=1&${findCustomParam}`;
      } else {
        param = `method=${element2}&period=${period}&date=${date}&segment=entryPageUrl==${encodeURIComponent(
          article.url,
        )}&idSite=1&`;
      }

      const matomoResp = {};
      matomoResp[`${element2}`] = await this.getInfoMatomo(param);

      matomo.push(matomoResp);
    }
    return matomo;
  }

  /**
   * get matomo information by article URL and date
   * @param tags
   * @param period
   * @param date
   * @param segment
   * @returns data from matomo
   */
  async getInfoMatomo(param: string) {
    const response = await new Promise((resolve, reject) => {
      this.matomoSrv.getMatomoInfo(param).subscribe({
        next: (resp) => resolve(resp),
        error: (err) => reject(err),
      });
    });
    return response;
  }

  /**
   * get code html to inspect
   */
  async getHTML(urlNoticia: string) {
    const response = await new Promise(async (resolve) => {
      resolve(this.getDataHtml(urlNoticia));
    });
    return this.inspectHTML(response);
  }

  /**
   *
   * @param urlNoticia
   * @returns code html
   */
  getDataHtml(urlNoticia) {
    return this.httpService
      .get(urlNoticia)
      .pipe(map((response) => response.data));
  }

  /**
   * inspect html according to required placeholders
   */
  async inspectHTML(html) {
    let valid = true;
    const scripLD = '<script type="application/ld+json"';

    // convert response to html code
    const response: string = await new Promise((resolve) => {
      html.subscribe((data) => {
        resolve(data);
      });
    });

    this.placeholders.forEach((placeholder) => {
      //inspect placeholder type Og
      if (placeholder.typesMetaData === 'Open Graph') {
        const systemPlaceholders = response.split('="og:');
        const newSystemPlaceholders: any[] = [];

        for (let i = 1; i < systemPlaceholders.length; i++) {
          const indice = systemPlaceholders[i].indexOf('"');
          newSystemPlaceholders.push(
            systemPlaceholders[i].substring(0, indice),
          );
        }
        //find matches
        const found = newSystemPlaceholders.find((x) => x === placeholder.name);
        if (!found) {
          valid = false;
        }
      } else {
        // inspect placeholder type jason-LD
        let systemPlaceholders: string[];
        if (response.includes(scripLD)) {
          systemPlaceholders = response.split(scripLD);
        } else {
          systemPlaceholders = response.split('scriptJsonLd.innerHTML = `');
        }
        const newSystemPlaceholders: any[] = [];

        for (let i = 1; i < systemPlaceholders.length; i++) {
          const indice = response.includes(scripLD)
            ? systemPlaceholders[i].indexOf('</script>')
            : systemPlaceholders[i].indexOf('`;');
          newSystemPlaceholders.push(
            systemPlaceholders[i].substring(0, indice),
          );
        }

        //compare json with placeholders
        let script;
        const classExist = newSystemPlaceholders[0].indexOf('class=');
        if (classExist > 0) {
          const calssString = response.split('class="');
          const newcalssString: any[] = [];

          for (let i = 1; i < calssString.length; i++) {
            const indice = calssString[i].indexOf('">');
            newcalssString.push(calssString[i].substring(0, indice));
          }
          script = newSystemPlaceholders[0].replace(
            `class="${newcalssString[0]}">`,
            '',
          );
        } else {
          script = newSystemPlaceholders[0];
        }

        //convert script to object
        const jsonLD = JSON.parse(script);
        const replace = this.searchPlaceholder(jsonLD, placeholder.name);

        //find matches
        if (!replace) {
          valid = false;
        }
      }
    });

    // create object html valid
    const htmlValid = {
      html: response,
      valid: valid,
    };
    return htmlValid;
  }

  /**
   * get all placeholders the recomendacion
   */
  getPlaceholders() {
    this.placeholders = [];
    let placeholdersTemp;

    this.placeholdersService.findSystem().then((value) => {
      placeholdersTemp = value;

      placeholdersTemp.forEach((data) => {
        if (data.type === 'Sistema' && data.required && data.isActive) {
          this.placeholders.push(data);
        }
      });
    });
  }

  /**
   *
   * @param jsonLD script to compare
   * @param placeholders  placeholders type jsonLD
   * @returns
   */
  searchPlaceholder(jsonLD, placeholders) {
    //create route the placeholders
    const placeholder = placeholders.split('.');
    let ruta = '';
    for (let i = 0; i < placeholder.length; i++) {
      const element = placeholder[i];
      if (element.charAt(0) === '@') {
        if (element.includes('[')) {
          ruta = ruta
            .concat(`['${element.split('[')[0]}`)
            .concat(`'][${element.split('[')[1]}.`);
        } else {
          ruta = ruta.concat(`['${element}'].`);
        }
      } else {
        ruta = ruta.concat(element);
      }
    }
    if (ruta.slice(-1) === '.') {
      ruta = ruta.slice(0, -1);
    }

    //search for a suitable route according to placeholders
    const result = _.get(jsonLD, ruta);
    return result;
  }

  async analyzer_url(url: string, tags: string, period: string, date: string) {
    // validate if link is valid
    if (!url.includes('http')) {
      url = `https://${url}`;
    }

    const domain = new URL(url);
    const domainName = domain.hostname;

    const link = await this.domainService.findOne(domainName);

    //if domain exist then save article
    if (link.length > 0) {
      this.getPlaceholders();

      let article = await this.articleModel.find({
        url: { $regex: url, $options: 'i' },
      });

      article = JSON.parse(JSON.stringify(article));
      const data = [];


      for (let i = 0; i < article.length; i++) {
        const element = article[i];
        //verify html valid
        const htmlValid = await this.getHTML(element.url);

        element['similarity'] = '100%';
        const tagsToUse: string[] = tags.split('&');
        const matomo = [];

        for (let j = 0; j < tagsToUse.length; j++) {
          const element2 = tagsToUse[j];
          const param = `method=${element2}&period=${period}&date=${date}&segment=entryPageUrl==${encodeURIComponent(
            'http://www.rdscr.com/',
          )}&idSite=1&`;
          // ****************** descomentar esto para cuando tengamos informacion real en matomo y croma***************
          //  const param = `method=${element2}&period=${period}&date=${date}&segment=entryPageUrl==${encodeURIComponent(
          //    article.url,
          //  )}&idSite=1&`;
          // const matomoResp = await this.getInfoMatomo(param);
          const matomoResp = {};
          matomoResp[`${element2}`] = await this.getInfoMatomo(param);
          // matomo[`${element2.split('.')[0]}`];
          matomo.push(matomoResp);
        }

        element['matomo'] = matomo;
        element['metadata'] = htmlValid;
      }
      data[0] = {
        related_articles: article,
      };
      return data;
    } else {
      return 'Dominio no valido.';
    }
  }
}
