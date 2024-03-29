import * as fs from 'fs';
import * as _ from 'lodash';
import {
  genWord,
  parameterValues,
  ParentCondition,
  parentCondition,
} from './dto/parentCondition';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlocksRepository } from './blocks.repository';
import { PagesService } from 'src/pages/pages.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { WeighingService } from 'src/weighing/weighing.service';

@Injectable()
export class BlocksService {
  finalScript = '';

  constructor(
    private blockRepository: BlocksRepository,
    private readonly config: ConfigService,
    private pagesService: PagesService,
    private weighingService: WeighingService,
  ) {
    this.createRules();
  }

  async create(createBlockDto: CreateBlockDto) {
    try {
      const create = await this.blockRepository.create(createBlockDto);
      return create;
    } catch (error) {
      return undefined;
    }
  }

  async updateManyPages(updatePage) {
    try {
      const create = await this.pagesService.updateMany(updatePage);
      this.createRules();
      return create;
    } catch (error) {
      return undefined;
    }
  }

  async findAll() {
    try {
      return await this.blockRepository.find({});
    } catch (error) {
      return [];
    }
  }

  async findOne(id: string) {
    try {
      return await this.blockRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  async update(updateBlockDto: UpdateBlockDto) {
    try {
      const update = await this.blockRepository.findOneAndUpdate(
        { _id: updateBlockDto._id },
        updateBlockDto,
      );
      this.createRules();
      return update;
    } catch (error) {
      return undefined;
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.blockRepository.deleteMany({ _id: id });
      this.createRules();
      return deleted;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * check if a file or directory exists
   * @param path path to check
   * @returns boolean if file or directory exists
   */
  checkIfFileOrDirectoryExists(path: string) {
    return fs.existsSync(path);
  }

  /**
   * create file
   * @returns Promise<string>
   */
  async createFile(data: string, domainName: string) {
    try {
      if (!this.checkIfFileOrDirectoryExists(`${__dirname}/file`)) {
        fs.mkdirSync(`${__dirname}/file`);
      }

      const writeFile = promisify(fs.writeFile);

      const writeFileFinaly = await writeFile(
        `${__dirname}/file/${domainName}.min.js`,
        data,
        'utf8',
      );
      this.finalScript = '';
      return writeFileFinaly;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * It gets all the pages from the database, then for each page, it calls the readAllPages function,
   * which will read all the rules of the page and create the script
   */
  async createRules() {
    let pages = await this.pagesService.findAll();
    pages = JSON.parse(JSON.stringify(pages));
    const uniqPages = _.uniqBy(pages, 'site._id');
    for (let i = 0; i < uniqPages.length; i++) {
      const element = pages.filter((x) => x.site._id === uniqPages[i].site._id);
      for (let i = 0; i < element.length; i++) {
        await this.readAllPages([element[i]], element[i]._id);
      }
      const scriptGraphQl = await this.crearMetadataGraphql();
      const lazyLoading = await this.writeLazyLoading();
      const scriptJsonld = this.crearMetadataJson();
      const loadScript = `
      document.addEventListener("DOMContentLoaded", async () => {
        var currentIframes = [];
        var lazyloadThrottleTimeout;
        var iframes = document.getElementsByTagName("iframe");
        for (let i = 0; i < iframes.length; i++) {
          const element = iframes[i];
          const findUni2Id = element.attributes["uni2id"];
      
          if (findUni2Id) {
            currentIframes.push(element);
          }
        }
      
        function lazyload() {
          if (lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
          }
      
          lazyloadThrottleTimeout = setTimeout(function () {
            var scrollTop = window.pageYOffset;
            currentIframes.forEach(function (ifm) {
              if (ifm.offsetTop - 150 < window.innerHeight + scrollTop) {
                const name = ifm.attributes["uni2id"].value + "()";
                const validate = "req" + ifm.attributes["uni2id"].value;
                if (eval(validate)) {
                  eval(name);
                }
              }
            });
            if (currentIframes.length == 0) {
              document.removeEventListener("scroll", lazyload);
              window.removeEventListener("resize", lazyload);
              window.removeEventListener("orientationChange", lazyload);
            }
          }, 30);
        }
      
        function contextcargado(callback) {
          let procesar = false;
          if (typeof cxs === "undefined") {
            if (typeof unomiWebTracker === "object") {
              if (typeof unomiWebTracker.cxs === "object") {
                procesar = true;
              }
            }
          } else {
            procesar = true;
          }
      
          if (procesar) {
            callback();
          } else {
            setTimeout(function () {
              contextcargado(callback);
            }, 100);
          }
        }
      
        contextcargado(async function () {
          if (typeof cxs === "undefined") {
            cxs = unomiWebTracker.cxs;
          }
          await lazyload();
          document.addEventListener("scroll", lazyload);
          window.addEventListener("resize", lazyload);
          window.addEventListener("orientationChange", lazyload);
        });      
        ${this.finalScript}
        ${scriptGraphQl}
        ${scriptJsonld}
        ${lazyLoading}
      });
`;
      await this.createFile(loadScript, element[0].site.name);
    }
  }

  /**
   * It takes the metadata from the page and returns an object with the metadata that has a luck value
   * greater than 0
   * @returns an object with the metadata of the page.
   */
  async crearMetadataGraphql() {
    return `
    function getMetadataGraph() {
      var metaTags = document.getElementsByTagName('meta');
      var obj = {};
      for (let i = 0; i < metaTags.length; i++) {
        const prop = metaTags[i].getAttribute('property');
        if (prop && prop.includes('og:')) {
          obj[prop.split(":")[1]] = metaTags[i].content;
        }
      }
      return obj;
    }
    `;
  }

  /**
   * It returns the first script tag with a type attribute of application/ld+json
   * @returns The function getMetadataJSON() is being returned.
   */
  crearMetadataJson() {
    const data = `
    function getMetadataJSON() { 
      var jsonLd = document.querySelector('script[type="application/ld+json"]');
      return jsonLd ? JSON.parse(jsonLd.innerHTML) : {};
    }
    `;
    return data;
  }

  /**
   * It loops through all the pages in the form, and if the page has a wizardModel, it calls the
   * createScriptOfRule function
   * @param pages - The pages of the form.
   */
  async readAllPages(pages, mainPage) {
    for (let i = 0; i < pages.length; i++) {
      const element = pages[i];
      if (element.wizardModel) {
        await this.createScriptOfRule(element, mainPage);
      }
      if (element.children) {
        this.readAllPages(element.children, mainPage);
      }
    }
  }

  /**
   * It creates a script for each block of the page
   * @param page - the page object
   * @param mainPage - the page id
   */
  createScriptOfRule(page, mainPage) {
    for (let j = 0; j < page.wizardModel.length; j++) {
      const elementModel = page.wizardModel[j];
      const contents = [];
      for (let k = 0; k < elementModel.stepsData.length; k++) {
        const elementStep = elementModel.stepsData[k];
        const conditions = {
          id: `${elementStep.template._id},${elementStep.template.typeTemplate},${mainPage},${elementModel.block._id},${page.level},${elementStep.rule._id}`,
          filters: [
            {
              condition: this.createCondition(
                JSON.parse(elementStep.rule.condition),
              ),
            },
          ],
        };
        contents.push(conditions);
      }
      this.writeScript(elementModel.divId, contents);
    }
  }

  /**
   * It creates a script that will be injected into the page
   * @param id - the name of the function that will be called in the script
   * @param rule - The rule that will be used to personalize the content.
   */
  writeScript(id, rule) {
    const script = `
    var req${id} = true;
    function ${id}() {
    var iframe = document.getElementById('${id}');
    var doc;

    if (iframe.contentDocument) {
        doc = iframe.contentDocument;
    } else {
        doc = iframe.contentWindow.document;
    }
    if (doc.body.innerHTML === '') {
        req${id} = false;
        sendContextLazyLoading(
            {
                id: "testTemplate",
                strategy: "matching-first",
                strategyOptions: {
                    fallback: "noMatchFound",
                },
                contents: ${JSON.stringify(rule)},
            },

            async function (res) {

                const id = Object.keys(res.personalizations)[0];
                let winningRule = res.personalizations[id];

                if (winningRule && winningRule[0] !== "noMatchFound") {
                    const bodyReq = {
                        template: winningRule[0],
                        sessionId: cxs.profileId,
                        OpenGraph: getMetadataGraph(),
                        JSONLD: getMetadataJSON(),
                    };

                    const response = await fetch("${this.config.get<string>(
                      'SERVER_IP',
                    )}/personalization/renderization", {
                        method: "POST",

                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },

                        body: JSON.stringify(bodyReq),
                    });

                    response.json().then((data) => {
                        if(!data.template) {
                          req${id} = true;
                          lazyload();
                          return 
                        }
                        var iframe = document.getElementById('${id}');
                        var doc;

                        if (iframe.contentDocument) {
                            doc = iframe.contentDocument;
                        } else {
                            doc = iframe.contentWindow.document;
                        }

                        doc.body.innerHTML = data.template;
                        iframe.style.height = data.height.toString() + "px";
                        iframe.style.width = data.width.toString() + "px";
                    }).catch((err)=> {
                      req${id} = true;
                    });

                }
            },
            async function(res) {
              req${id} = true;
            }
        );
    }
}`;
    this.finalScript = `${this.finalScript}${script}`;
  }

  // this function create the context request. Is implement to use the lazy loading
  writeLazyLoading() {
    return `
    async function sendContextLazyLoading(personalization, successCallback, errorCallback) {
      try {
        for (let i = 0; i < personalization.contents.length; i++) {

          const element = personalization.contents[i];
    
          element.id = element.id + "," + window.location.host;
    
        }
    var sessionId = cxs?.sessionId || generateUUID();
    var contextPayload = {
      source: {
        itemType: 'page',
        scope: 'realEstateManager',
        itemId: location.pathname + location.hash,
        properties: {
          url: window.location.href,
          path: location.pathname + location.hash,
          pageInfo: {
            pageName: document.title,
            pageID: location.pathname + location.hash,
            pagePath: location.pathname + location.hash,
            destinationURL: location.href
          }
        },
      },
      sessionId: sessionId,
      personalizations: [personalization]
    };

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "${this.config.get<string>(
      'UNOMI_URL',
    )}/context.json", true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) {
        return;
      }
      if (xhr.status === 200) {
        var response = xhr.responseText ? JSON.parse(xhr.responseText) : undefined;
        if (response) {
          cxs.sessionId = response.sessionId;
          successCallback(response);
        }
      } else {
        console.log("contextserver: " + xhr.status + " ERROR: " + xhr.statusText);
        if (errorCallback) {
          errorCallback(xhr);
        }
      }
    };

    xhr.send(JSON.stringify(contextPayload));
    } catch (error) {
      errorCallback(error);
    }
  }

  function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
`;
  }

  /**
   * create boolean condition Object
   * @param value ParentCondition
   * @returns booleanConditionOBJ
   */
  createCondition(value: ParentCondition[]) {
    try {
      // create new parentCondition
      const condition = new parentCondition();

      if (value) {
        // will always be a boolean condition
        condition.type = genWord.BOOLEANCONDITION;
        condition[genWord.PARAMETERVALUES] = new parameterValues();

        condition[genWord.PARAMETERVALUES].operator = value[0].operator || '';
        condition[genWord.PARAMETERVALUES][genWord.SUBCONDITIONS] = [];

        for (let i = 0; i < value.length; i++) {
          const element = value[i];

          //if children, create boolean condition
          if (element.children) {
            condition[genWord.PARAMETERVALUES][genWord.SUBCONDITIONS].push(
              this.createCondition(element.children),
            );
          } else {
            // create object of condition
            const obj = {};
            obj['type'] = element.conditionId;
            obj['parameterValues'] = {};
            if (element['variable'] !== 'Seleccionar Condición') {
              obj['parameterValues'][element['variable']] = element['value']
                ? element['value']
                : element['selectedValue'];
            }

            // validate if replace values
            if (
              element['saveValueInto'] &&
              element['variable'] !== element['saveValueInto']
            ) {
              obj['parameterValues'][element['saveValueInto']] =
                element['selectedValue'];
            } else if (element['variable'] !== 'Seleccionar Condición') {
              obj['parameterValues'][element['variable']] =
                element['selectedValue'];
            }

            // validate if has operator so save into variable that includes 'operator'
            if (element['hasOperator']) {
              obj['parameterValues'][element['saveOperatorInto']] =
                element['operatorCondition'];
            }

            condition[genWord.PARAMETERVALUES][genWord.SUBCONDITIONS].push(obj);
          }
        }
      }

      return condition;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  }
}
