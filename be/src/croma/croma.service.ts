import { JSDOM } from 'jsdom';
import * as _ from 'lodash';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, forkJoin, lastValueFrom, map } from 'rxjs';
import { CreateCromaDto } from './dto/create-croma.dto';
import { MatomoService } from 'src/matomo/matomo.service';
import { RelatedCromaDto } from './dto/related-croma.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { DomainsService } from 'src/domains/domains.service';
import { PlaceholdersService } from 'src/placeholders/placeholders.service';

@Injectable()
export class CromaService {
  placeholders: any[] = [];
  constructor(
    private placeholdersService: PlaceholdersService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly matomoSrv: MatomoService,
    private readonly domainService: DomainsService,
  ) {}

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
  async related(
    relatedCromaDto?: RelatedCromaDto,
    site?: string,
    tags?: string,
    period?: string,
    date?: string,
  ) {
    let searchParams = '';
    const domain = await this.domainService.find(site);
    if (relatedCromaDto && relatedCromaDto.years) {
      searchParams = `&years=${relatedCromaDto.years}&months=${relatedCromaDto.months}&days=${relatedCromaDto.days}&radius=${relatedCromaDto.radius}`;
    }
    let result;
    await lastValueFrom(
      this.httpService
        .get(
          `${domain[0].cromaUrl}/related?cmsid=${relatedCromaDto.id}${searchParams}`,
        )
        .pipe(
          map((response) => (result = response)),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );

    const found = result.data.related_articles.find(
      (x) => x.cms_id === relatedCromaDto.id,
    );

    if (!found) {
      result.data.related_articles = [
        { cms_id: relatedCromaDto.id, similarity: 1 },
        ...result.data.related_articles,
      ];
    }

    return this.searchArticles(result.data, tags, period, date, site);
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
    site?: string,
  ) {
    const domain = await this.domainService.find(site);
    const response = await lastValueFrom(
      this.httpService
        .post(`${domain[0].cromaUrl}/analyzer/text`, text, {
          headers: { 'Content-Type': 'application/json' },
        })
        .pipe(
          map((response) =>
            this.searchArticles(response.data, tags, period, date, site),
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
  async similar_words(word: string, site?: string) {
    const domain = await this.domainService.find(site);
    const response = this.httpService
      .post(
        `${domain[0].cromaUrl}/w2v/similar`,
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

  async getNews(id, url): Promise<any> {
    const response = await lastValueFrom(
      this.httpService
        .get(`${url}/article?cmsid=${id}`, {
          headers: { 'Content-Type': 'application/json' },
        })
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
        ),
    );
    return response;
  }

  async getNewsById(id, url): Promise<any> {
    const response = await lastValueFrom(
      this.httpService
        .get(`${url}/article?id=${id}`, {
          headers: { 'Content-Type': 'application/json' },
        })
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
        ),
    );
    return response;
  }

  /**
   * @param data all data from croma related articles
   * @returns articles populated
   */
  async searchArticles(
    data,
    tags?: string,
    period?: string,
    date?: string,
    site?: string,
  ) {
    // get placeholders to database
    this.getPlaceholders();
    const domain = await this.domainService.find(site);
    const request = [];
    // search for article on CromaAI DB.
    for (let i = 0; i < data.related_articles.length; i++) {
      const element = data.related_articles[i];
      request.push(
        element.cms_id
          ? this.getNews(element.cms_id, domain[0].cromaUrl)
          : this.getNewsById(element.article_id, domain[0].cromaUrl),
      );
    }
    const reponseToDevolver = await new Promise((resolve, reject) => {
      forkJoin(...request).subscribe({
        next: (req) => {
          for (let i = 0; i < data.related_articles.length; i++) {
            const element = data.related_articles[i];
            const article = req.find(
              (x) =>
                x['_id'] === element.article_id ||
                x['pub_art_id'] === element.cms_id,
            );
            data.related_articles[i] = {
              ...element,
              ...JSON.parse(JSON.stringify(article)),
            };
          }

          const getHtml = [];
          for (let i = 0; i < data.related_articles.length; i++) {
            const article = data.related_articles[i];
            article.similarity = `${Number(
              Number(article.similarity) * 100,
            ).toFixed(2)}%`;
            getHtml.push(this.getHTML(article.url));
          }
          forkJoin(...getHtml).subscribe({
            next: (resp) => {
              for (let i = 0; i < resp.length; i++) {
                const art = resp[i];
                const doc = new JSDOM(art['html']);
                const cmsid = doc.window.document
                  .querySelector('meta[name="cmsid"]')
                  .getAttribute('content');
                const find = data.related_articles.find(
                  (x) => x.pub_art_id === cmsid,
                );
                if (find) {
                  find.metadata = art;
                }
              }

              const matomoReq = [];
              for (let i = 0; i < data.related_articles.length; i++) {
                const article = data.related_articles[i];
                if (tags && period && date) {
                  matomoReq.push(
                    this.getMatomoTags(
                      tags,
                      period,
                      date,
                      article,
                      domain[0].matomoUrl,
                      domain[0].idSite,
                    ),
                  );
                } else {
                  data.related_articles[i].matomo = [];
                }
              }

              forkJoin(...matomoReq).subscribe({
                next: (analitic) => {
                  const results = [];
                  for (let i = 0; i < analitic.length; i++) {
                    analitic[i][1].matomo = analitic[i][0];
                    results.push(analitic[i][1]);
                  }
                  resolve(results);
                },
                error: (err) => {
                  reject(err);
                },
              });
            },
            error: (err) => {
              reject(err);
            },
          });
        },
        error: (err) => {
          reject(err);
        },
      });
    });

    return reponseToDevolver;
  }

  async getMatomoTags(tags, period, date, article, matomoUrl, idSite) {
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
        param = `method=${element2}&period=${period}&date=${date}&pageUrl=${encodeURIComponent(
          article.url,
        )}&${findCustomParam}`;
      } else {
        param = `method=${element2}&period=${period}&date=${date}&pageUrl=${encodeURIComponent(
          article.url,
        )}&`;
      }

      const matomoResp = {};
      matomoResp[`${element2}`] = await this.getInfoMatomo(
        param,
        matomoUrl,
        idSite,
      );

      matomo.push(matomoResp);
    }
    return [matomo, article];
  }

  /**
   * get matomo information by article URL and date
   * @param tags
   * @param period
   * @param date
   * @param segment
   * @returns data from matomo
   */
  async getInfoMatomo(param: string, matomoUrl, idSite) {
    const response = await new Promise((resolve, reject) => {
      this.matomoSrv.getMatomoInfo(param, matomoUrl, idSite).subscribe({
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

  async analyzer_url(
    url: string,
    tags: string,
    period: string,
    date: string,
    site: string,
  ) {
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

      const getHTML = await this.getHTML(url);
      const doc = new JSDOM(getHTML.html);
      const cmsid = {
        id: doc.window.document
          .querySelector('meta[name="cmsid"]')
          .getAttribute('content'),
      };

      // cmsid
      const article = await this.related(cmsid, site, tags, period, date);
      return article;
    } else {
      return 'Dominio no valido.';
    }
  }
}
