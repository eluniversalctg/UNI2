import * as _ from 'lodash';
import * as moment from 'moment';
import { RuleService } from 'src/rule/rule.service';
import { PagesService } from 'src/pages/pages.service';
import { CromaService } from 'src/croma/croma.service';
import { HttpException, Injectable } from '@nestjs/common';
import { RenderizationDto } from './dto/renderization.dto';
import { DomainsService } from 'src/domains/domains.service';
import { RelatedCromaDto } from 'src/croma/dto/related-croma.dto';
import { Personalization } from './entities/personalization.entity';
import { PersonalizationRepository } from './personalization.repository';
import { CreatePersonalizationDto } from './dto/create-personalization.dto';
import { UpdatePersonalizationDto } from './dto/update-personalization.dto';
import { PlaceholdersService } from 'src/placeholders/placeholders.service';
import { PlaceholderUnomiService } from 'src/placeholder-unomi/placeholder-unomi.service';
import { TemplatePersonalizationService } from 'src/template-personalization/template-personalization.service';

@Injectable()
export class PersonalizationService {
  constructor(
    private ruleService: RuleService,
    private pagesService: PagesService,
    private cromaService: CromaService,
    private readonly domainService: DomainsService,
    private placeholderSystemService: PlaceholdersService,
    private placeholderUnomiService: PlaceholderUnomiService,
    private templatePersonalizationService: TemplatePersonalizationService,
    private readonly personalizationRepository: PersonalizationRepository,
  ) {}

  /**
   *
   * @param createPersonalizationDto object the rules the personalization
   * @returns object personalization to database
   */
  async create(
    createPersonalizationDto: CreatePersonalizationDto,
  ): Promise<Personalization | undefined> {
    try {
      return await this.personalizationRepository.create(
        createPersonalizationDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get all  rules personalization to database
   */
  async findAll(): Promise<Personalization[]> {
    try {
      return await this.personalizationRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   * get one rule personalization to database
   */
  async findOne(id: string): Promise<Personalization | undefined> {
    try {
      return await this.personalizationRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @param updatePersonalizationDto rule the personalization to update
   * @returns personalization update
   */
  async update(
    updatePersonalizationDto: UpdatePersonalizationDto,
  ): Promise<Personalization | undefined> {
    try {
      return await this.personalizationRepository.findOneAndUpdate(
        { _id: updatePersonalizationDto._id },
        updatePersonalizationDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @param id id to personalization delete
   * @returns true or false as eliminated
   */
  async remove(id: string): Promise<boolean> {
    try {
      return await this.personalizationRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * renderization template
   */
  async renderization(renderizationDto: RenderizationDto) {
    try {
      let infoSesion = {};
      if (renderizationDto.sessionId != null) {
        infoSesion = await this.ruleService.getProfile(
          renderizationDto.sessionId,
        );
      }

      //get all templates and placeholders the personalization
      const placeholdersUnomi = await this.getPlaceholdersUnomi();
      const templatesPersonalization = await this.getTemplatesPerso();
      const pages = await this.getPages();
      const placeholdersSystem = await this.getPlaceholdersSystem();

      const data = renderizationDto.template.split(',');

      let domainURL;
      let link;
      if (data[6] !== '') {
        if (!data[6].includes('http')) {
          domainURL = `https://${data[6]}`;
        } else {
          domainURL = data[6];
        }
        const domain = new URL(domainURL);
        const domainName = domain.hostname;

        link = await this.domainService.findOne(domainName);
      }

      const idTemplateRender = data[0];
      const typeTemplate = data[1];
      const idPage = data[2];
      const idBlock = data[3];
      const level = data[4];
      const idRule = data[5];
      const siteID = link ? link[0].id : '';

      let template = templatesPersonalization.find(
        (x) => x._id === idTemplateRender,
      );

      template = JSON.parse(JSON.stringify(template));

      const page = await pages.find((x) => x._id === idPage);

      let newPlaceholder: any[] = [];
      let cromaPeriod;
      let matomoPeriod;
      let matomoMetaData;
      let typeMetaData;
      let matomoTags;
      let weighing;
      let typeTags;
      let cromaType;

      //level 0
      if (Number(level) === 0) {
        if (page.wizardModel) {
          page.wizardModel.forEach((wizard) => {
            //inspect each block
            if (wizard.block._id === idBlock) {
              wizard.stepsData.forEach((step) => {
                //inspect each rules
                if (step.rule._id === idRule) {
                  //get info about croma and matomo
                  newPlaceholder = step.newPlaceholder;
                  cromaPeriod = step.cromaPeriod;
                  matomoPeriod = step.matomoPeriod;
                  matomoMetaData = step.matomoMetaData;
                  typeMetaData = step.typeMetaData;
                  matomoTags = step.matomoTags;
                  weighing = step.weighing;
                  cromaType = step.cromaType;
                  typeTags = step.typeTags;
                }
              });
            }
          });
        }
      }

      //level 1
      if (Number(level) === 1) {
        //inspect each children of the page
        if (page.children) {
          //go through each child
          page.children.forEach((children1) => {
            if (children1.wizardModel) {
              children1.wizardModel.forEach((wizard) => {
                //inspect each block
                if (wizard.block._id === idBlock) {
                  wizard.stepsData.forEach((step) => {
                    //inspect each rules
                    if (step.rule._id === idRule) {
                      //get info about croma and matomo
                      newPlaceholder = step.newPlaceholder;
                      cromaPeriod = step.cromaPeriod;
                      matomoPeriod = step.matomoPeriod;
                      matomoMetaData = step.matomoMetaData;
                      typeMetaData = step.typeMetaData;
                      matomoTags = step.matomoTags;
                      weighing = step.weighing;
                      cromaType = step.cromaType;
                      typeTags = step.typeTags;
                    }
                  });
                }
              });
            }
          });
        }
      }

      //level 2
      if (Number(level) === 2) {
        //inspect each children of the page
        if (page.children) {
          //go through each child
          page.children.forEach((children1) => {
            if (children1.children) {
              //go through each child
              children1.children.forEach((children2) => {
                if (children2.wizardModel) {
                  children2.wizardModel.forEach((wizard) => {
                    //inspect each block
                    if (wizard.block._id === idBlock) {
                      wizard.stepsData.forEach((step) => {
                        //inspect each rules
                        if (step.rule._id === idRule) {
                          //get info about croma and matomo
                          newPlaceholder = step.newPlaceholder;
                          cromaPeriod = step.cromaPeriod;
                          matomoPeriod = step.matomoPeriod;
                          matomoMetaData = step.matomoMetaData;
                          typeMetaData = step.typeMetaData;
                          matomoTags = step.matomoTags;
                          weighing = step.weighing;
                          cromaType = step.cromaType;
                          typeTags = step.typeTags;
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }

      //level 3
      if (Number(level) === 3) {
        //inspect each children of the page
        if (page.children) {
          //go through each child
          page.children.forEach((children1) => {
            //inspect each child of the children1
            if (children1.children) {
              //go through each children1
              children1.children.forEach((children2) => {
                //inspect each child of the children2
                if (children2.children) {
                  //inspect each child of the children2
                  children2.children.forEach((children3) => {
                    if (children3.wizardModel) {
                      children3.wizardModel.forEach((wizard) => {
                        //inspect each block
                        if (wizard.block._id === idBlock) {
                          wizard.stepsData.forEach((step) => {
                            //inspect each rules
                            if (step.rule._id === idRule) {
                              //get info about croma and matomo
                              newPlaceholder = step.newPlaceholder;
                              cromaPeriod = step.cromaPeriod;
                              matomoPeriod = step.matomoPeriod;
                              matomoMetaData = step.matomoMetaData;
                              typeMetaData = step.typeMetaData;
                              matomoTags = step.matomoTags;
                              weighing = step.weighing;
                              cromaType = step.cromaType;
                              typeTags = step.typeTags;
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }

      try {
        //case template editorial
        if (typeTemplate === 'Editorial') {
          //the random is created to define the winning weight
          const random = Math.floor(Math.random() * (100 - 1) + 1);

          // search croma
          if (typeTags === 'Croma') {
            //croma with text
            if (cromaType === 'Texto') {
              //the weights established by the user are obtained
              const arrayWeighing: any[] = [];
              arrayWeighing.push(
                weighing.title,
                weighing.summary,
                weighing.body,
                weighing.altPhoto,
                weighing.topic,
                weighing.url,
              );

              /* Creating a min and max value for each object in the array. */
              for (let i = 0; i < arrayWeighing.length; i++) {
                //only for the first weighing
                if (i === 0) {
                  arrayWeighing[i]['min'] = 1;
                  arrayWeighing[i]['max'] = arrayWeighing[i].luck;
                }

                //in case there is more than one weighting
                if (i > 0) {
                  arrayWeighing[i]['min'] = arrayWeighing[i - 1].max + 1;
                  arrayWeighing[i]['max'] =
                    arrayWeighing[i].min + arrayWeighing[i].luck - 1;
                }
              }

              //the weight that is between the range of the random is obtained
              const weighingWins = arrayWeighing.find(
                (x) => x.min <= random && x.max >= random,
              );

              //find in the JsonLD OR OpenGraph
              const finMetadata = this.findMeta(
                weighingWins,
                renderizationDto.JSONLD,
                renderizationDto.OpenGraph,
              );

              const date = moment().format('YYYY-MM-DD');
              //get the articles with respect to the winning metadata
              const articles = await this.cromaService.analyzer_text(
                finMetadata,
                'Actions.getPageUrl&',
                'year',
                date,
                siteID,
                template.numNews,
              );
              const articlesSelect: any[] = [];

              //use the number of items needed for the template
              for (let i = 0; i < template.numNews; i++) {
                articlesSelect.push(articles[i]);
              }

              /**
               * render the template with the most similar articles
               */
              template.htmlContent = this.replaceFinally(
                template.htmlContent,
                placeholdersSystem,
                placeholdersUnomi,
                articlesSelect,
                newPlaceholder,
                infoSesion,
              );
            }

            // croma with ID
            if (cromaType === 'ID') {
              if (cromaPeriod) {
                //extract ID in the metadata
                let CromaId;

                //extract the jsonld
                if (renderizationDto.JSONLD['CromaId']) {
                  CromaId = renderizationDto.JSONLD['CromaId'];
                }

                //extract the metadata graph QL
                if (renderizationDto.OpenGraph['CromaId']) {
                  CromaId = renderizationDto.OpenGraph['CromaId'];
                }

                //create the object needed to fetch the croma items
                const relatedCromaDto: RelatedCromaDto = {
                  id: CromaId,
                  years: cromaPeriod.year,
                  months: cromaPeriod.month,
                  days: cromaPeriod.day,
                  radius: cromaPeriod.radius,
                };

                //get the articles with respect to id
                const articles = await this.cromaService.related(
                  template.numNews,
                  relatedCromaDto,
                  page.site._id,
                );
                const articlesSelect: any[] = [];

                //use the number of items needed for the template
                for (let i = 0; i < template.numNews; i++) {
                  articlesSelect.push(articles[0].related_articles[i]);
                }

                /**
                 * render the template with the most similar articles
                 */
                template.htmlContent = this.replaceFinally(
                  template.htmlContent,
                  placeholdersSystem,
                  placeholdersUnomi,
                  articlesSelect,
                  newPlaceholder,
                  infoSesion,
                );
              }
            }
          }

          // // search matomo
          if (typeTags === 'Matomo') {
            let params = '';

            // add custom parameters to matomo URL
            matomoTags.customParameters.forEach((param) => {
              if (param.value.toString().includes('$$')) {
                if (typeMetaData === 'Unomi') {
                  const result = _.get(infoSesion, matomoMetaData);
                  params += `${param.parameter}${result}&`;
                }

                if (typeMetaData === 'Open_Graph') {
                  const result = _.get(
                    renderizationDto.OpenGraph,
                    matomoMetaData,
                  );
                  params += `${param.parameter}${result}&`;
                }

                if (typeMetaData === 'JSON-LD') {
                  const result = _.get(renderizationDto.JSONLD, matomoMetaData);
                  params += `${param.parameter}${result}&`;
                }
              } else {
                params += `${param.parameter}=${param.value}&`;
              }
            });
            // get matomo data
            const matomoResponse = await this.cromaService.getInfoMatomo(
              `method=${matomoTags.module}.${matomoTags.tag}&period=${matomoPeriod.period}&date=${matomoPeriod.year}-${matomoPeriod.month}-${matomoPeriod.day}&${params}`,
              page.site.matomoUrl,
              page.site.idSite,
            );

            // validate if get information
            if (matomoResponse['length'] > 0) {
              const articles = [];

              for (let i = 0; i < matomoResponse['length']; i++) {
                // if startsWith m means is an news
                if (
                  matomoResponse[i].url &&
                  matomoResponse[i].label.split('/').length > 2
                ) {
                  const getHTML = await this.cromaService.getHTML(
                    matomoResponse[i].url,
                  );
                  articles.push({ metadata: { html: getHTML.html } });
                }

                // if we get all news, for ends
                if (articles.length === template.numNews) {
                  i = matomoResponse['length'];
                }
              }

              template.htmlContent = this.replaceFinally(
                template.htmlContent,
                placeholdersSystem,
                placeholdersUnomi,
                articles,
                newPlaceholder,
                infoSesion,
              );
            }
          }
        }

        //should only render
        if (typeTemplate === 'Personalización') {
          //verify template exists
          if (template) {
            /**
             * replace placeholders unomi
             */
            const systemPlaceholders = template.htmlContent.split('[$$');
            const newSystemPlaceholders: any[] = [];

            //extract placeholders of the template
            for (let i = 0; i < systemPlaceholders.length; i++) {
              const indice = systemPlaceholders[i].indexOf('$$]');

              newSystemPlaceholders.push(
                systemPlaceholders[i].substring(0, indice),
              );
            }

            //replace the placeholders standard and unomi in the html
            for (let i = 0; i < placeholdersUnomi.length; i++) {
              //found new placeholders the unomi
              const found = newPlaceholder.find(
                (x) => x._id === placeholdersUnomi[i]._id,
              );

              //change the new values set by the user
              if (found) {
                //REPLACE PLACEHOLDERS STANDARD WITH NEW PLACEHOLDERS
                template.htmlContent = template.htmlContent.replaceAll(
                  `$$${found.name}$$`,
                  found.valueDefault,
                );
              }

              //change value default
              if (!found) {
                //REPLACE PLACEHOLDERS STANDARD WITH VALUE DEFAULT
                template.htmlContent = template.htmlContent.replaceAll(
                  `$$${placeholdersUnomi[i].name}$$`,
                  placeholdersUnomi[i].valueDefault,
                );
              }

              //find placeholders the unomi
              const replace = this.searchPlaceholder(
                infoSesion,
                placeholdersUnomi[i].valueDefault,
              );

              for (let j = 1; j <= newSystemPlaceholders.length; j++) {
                //REPLACE PLACEHOLDER UNOMI
                template.htmlContent = template.htmlContent.replaceAll(
                  `[$$${placeholdersUnomi[i].name}${j}$$]`,
                  replace,
                );
              }

              for (let i = 0; i < placeholdersSystem.length; i++) {
                for (let j = 1; j <= newSystemPlaceholders.length; j++) {
                  //REPLACE OPEN FRAFT
                  template.htmlContent = template.htmlContent.replaceAll(
                    `[$$og:${placeholdersSystem[i].name}${j}$$]`,
                    placeholdersSystem[i].valueDefault,
                  );

                  //REPLACE JSON-LD
                  template.htmlContent = template.htmlContent.replaceAll(
                    `[$$ld:${placeholdersSystem[i].name}${j}$$]`,
                    placeholdersSystem[i].valueDefault,
                  );
                }
              }
            }
          }
        }

        const object = {
          template: template.htmlContent,
          height: template.high,
          width: template.width,
        };
        //retunr template rendered
        return object;
      } catch (error) {
        return undefined;
      }
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  /**
   * find the metadadata to look for news
   */
  findMeta(weighingWins, JSONLD, graphQl) {
    let response = '';

    if (graphQl != null) {
      if (graphQl[weighingWins.grapgQL]) {
        response = graphQl[weighingWins.grapgQL];
      }
    }

    if (JSONLD != null) {
      if (JSONLD && JSONLD[weighingWins.jsonLD]) {
        response = JSONLD[weighingWins.jsonLD];
      }
    }
    return response;
  }

  /**
   * replace placeholder type unomi according to rute
   */
  searchPlaceholder(infoSession, placeholders) {
    //create rute placeholders
    const placeholder = placeholders.split('.');
    let ruta = '';

    for (let i = 0; i < placeholder.length; i++) {
      const element = placeholder[i];

      if (element.includes('[')) {
        ruta = ruta
          .concat(`['${element.split('[')[0]}`)
          .concat(`'][${element.split('[')[1]}.`);
      } else {
        ruta = ruta.concat(`['${element}'].`);
      }
    }

    if (ruta.slice(-1) === '.') {
      ruta = ruta.slice(0, -1);
    }

    //get info the session according to rute
    let result = _.get(infoSession, ruta);

    if (!result) {
      result = '';
    }

    return result;
  }

  /**
   * get all placeholders the unomid
   */
  async getPlaceholdersUnomi() {
    const response = await new Promise<any[]>(async (resolve) => {
      resolve(await this.placeholderUnomiService.findAllReplace());
    });

    return response;
  }

  /**
   * get all placeholders the system
   */
  async getPlaceholdersSystem() {
    const response = await new Promise<any[]>(async (resolve) => {
      resolve(await this.placeholderSystemService.findSystem());
    });

    return _.filter(response, { type: 'Sistema' });
  }

  /**
   * get all pages
   */
  async getPages() {
    const response = await new Promise<any[]>(async (resolve) => {
      resolve(await this.pagesService.findAllReplace());
    });

    return response;
  }

  /**
   * get all templates the personalization
   */
  async getTemplatesPerso() {
    const response = await new Promise<any[]>(async (resolve) => {
      resolve(await this.templatePersonalizationService.findAllReplace());
    });

    return response;
  }

  /**
   *
   * @param htmlContentPlaceholder plantilla
   * @param placeholders placeholders de sistema
   * @param articles noticias
   * @param newPlaceholder valores que se reemplazaron.
   * @returns plantilla renderizada
   */
  replaceFinally(
    htmlContentPlaceholder,
    placeholdersSystem,
    placeholdersUnomi,
    articles,
    newPlaceholder,
    infoSesion,
  ) {
    const systemPlaceholders = htmlContentPlaceholder.split('[$$');
    const newSystemPlaceholders: any[] = [];

    for (let i = 0; i < systemPlaceholders.length; i++) {
      const indice = systemPlaceholders[i].indexOf('$$]');
      newSystemPlaceholders.push(systemPlaceholders[i].substring(0, indice));
    }

    //placeholders unomi
    for (let i = 0; i < placeholdersUnomi.length; i++) {
      const found = newPlaceholder.find(
        (x) => x._id === placeholdersUnomi[i]._id,
      );

      if (found) {
        //REPLACE PLACEHOLDERS STANDARD WITH NEW PLACEHOLDERS
        htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
          `$$${found.name}$$`,
          found.valueDefault,
        );
      }

      if (!found) {
        //REPLACE PLACEHOLDERS STANDARD WITH VALUE DEFAULT
        htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
          `$$${placeholdersUnomi[i].name}$$`,
          placeholdersUnomi[i].valueDefault,
        );
      }

      //find placeholders the unomi
      const replace = this.searchPlaceholder(
        infoSesion,
        placeholdersUnomi[i].valueDefault,
      );

      for (let j = 1; j <= newSystemPlaceholders.length; j++) {
        //REPLACE PLACEHOLDER UNOMI

        htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
          `[$$${placeholdersUnomi[i].name}${j}$$]`,
          replace,
        );
      }
    }

    for (let i = 0; i < placeholdersSystem.length; i++) {
      // placeholder system

      if (placeholdersSystem[i].typesMetaData === 'Open Graph') {
        //Open Graft
        if (placeholdersSystem[i].required) {
          for (let j = 0; j < articles.length; j++) {
            const systemPlaceholdersOG = articles[j].metadata.html.split(
              `="og:${placeholdersSystem[i].name}" content="`,
            );
            const newsystemPlaceholdersOG: any[] = [];

            for (let p = 1; p < systemPlaceholdersOG.length; p++) {
              const indiceOP = systemPlaceholdersOG[p].includes('" />')
                ? systemPlaceholdersOG[p].indexOf('" />')
                : systemPlaceholdersOG[p].indexOf('">');

              newsystemPlaceholdersOG.push(
                systemPlaceholdersOG[p].substring(0, indiceOP),
              );

              const index = j + 1;
              htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
                `[$$og:${placeholdersSystem[i].name}${index}$$]`,
                newsystemPlaceholdersOG[0],
              );
            }
          }
        }
      } else {
        //JSON-LD
        if (placeholdersSystem[i].required) {
          let systemPlaceholdersOG;
          const scripJsonLd = '<script type="application/ld+json"';

          for (let j = 0; j < articles.length; j++) {
            if (articles[j].metadata.html.includes(scripJsonLd)) {
              systemPlaceholdersOG =
                articles[j].metadata.html.split(scripJsonLd);
            } else {
              systemPlaceholdersOG = articles[j].metadata.html.split(
                'scriptJsonLd.innerHTML = `',
              );
            }
            const newsystemPlaceholdersOG: any[] = [];

            for (let p = 1; p < systemPlaceholdersOG.length; p++) {
              const indiceOP = articles[j].metadata.html.includes(scripJsonLd)
                ? systemPlaceholdersOG[p].indexOf('</script>')
                : systemPlaceholdersOG[p].indexOf('`;');

              newsystemPlaceholdersOG.push(
                systemPlaceholdersOG[p].substring(0, indiceOP),
              );

              let script;
              const classExist = newsystemPlaceholdersOG[0].indexOf('class=');
              if (classExist > 0) {
                const calssString = newsystemPlaceholdersOG[0].split('class="');
                const newcalssString: any[] = [];

                for (let i = 1; i < calssString.length; i++) {
                  const indice = calssString[i].indexOf('">');
                  newcalssString.push(calssString[i].substring(0, indice));
                }
                script = newsystemPlaceholdersOG[0].replace(
                  `class="${newcalssString[0]}">`,
                  '',
                );
              } else {
                script = newsystemPlaceholdersOG[0];
              }

              const jsonLD = this.isJsonString(script)
                ? JSON.parse(script)
                : JSON.parse(script.slice(0, 1259) + script.slice(1261));
              const replace = this.searchPlaceholderJsonLd(
                jsonLD,
                placeholdersSystem[i].name,
              );
              const index = j + 1;
              htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
                `[$$ld:${placeholdersSystem[i].name}${index}$$]`,
                replace,
              );
            }
          }
        }
      }
    }
    return htmlContentPlaceholder;
  }

  isJsonString(str) {
    try {
      str = str.toString();
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * It takes a JSON-LD object and a string of dot-separated placeholders, and returns the value of the
   * property that the placeholders point to
   * @param jsonLD - The JSON-LD object that you want to search.
   * @param placeholders - The placeholders you want to replace.
   * @returns The value of the property in the jsonLD object that matches the placeholder.
   */
  searchPlaceholderJsonLd(jsonLD, placeholders) {
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
    let result = _.get(jsonLD, ruta);

    if (!result) {
      result = '';
    }

    return result;
  }
}
