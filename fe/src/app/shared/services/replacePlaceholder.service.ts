import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';
import { MessagesTst, html } from 'src/app/shared/enums';
@Injectable()
export class ReplacePlaceholderService extends ResourceService<any> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'images';
  }

  replace(htmlContentPlaceholder, placeholders, newPlaceholder) {
    let systemPlaceholders = htmlContentPlaceholder.split('[$$');
    let newSystemPlaceholders: any[] = [];
    for (let i = 0; i < systemPlaceholders.length; i++) {
      let indice = systemPlaceholders[i].indexOf('$$]');

      newSystemPlaceholders.push(systemPlaceholders[i].substring(0, indice));
    }

    for (let i = 0; i < placeholders.length; i++) {
      if (newPlaceholder) {
        if (placeholders[i].name === newPlaceholder.name) {
          htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
            `$$${placeholders[i].name}$$`,
            newPlaceholder.valueDefault
          );
        } else {
          htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
            `$$${placeholders[i].name}$$`,
            placeholders[i].valueDefault
          );
        }
      } else {
        htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
          `$$${placeholders[i].name}$$`,
          placeholders[i].valueDefault
        );
      }
      for (let j = 1; j <= newSystemPlaceholders.length; j++) {
        htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
          `[$$og:${placeholders[i].name}${j}$$]`,
          placeholders[i].valueDefault
        );
      }
    }
    return htmlContentPlaceholder;
  }

  replaceFinally(htmlContentPlaceholder, placeholders, articles, imagesLoad) {
    let systemPlaceholders = htmlContentPlaceholder.split('[$$');
    let newSystemPlaceholders: any[] = [];

    for (let i = 0; i < systemPlaceholders.length; i++) {
      let indice = systemPlaceholders[i].indexOf('$$]');
      newSystemPlaceholders.push(systemPlaceholders[i].substring(0, indice));
    }

    for (let i = 0; i < placeholders.length; i++) {
      htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
        `$$${placeholders[i].name}$$`,
        placeholders[i].valueDefault
      );

      // placeholder system
      if (placeholders[i].type === MessagesTst.SYSTEM) {
        if (placeholders[i].typesMetaData === MessagesTst.OpenGraph) {
          //Open Graft
          if (placeholders[i].required) {
            for (let j = 0; j < articles.length; j++) {
              let systemPlaceholdersOG = articles[j].metadata.html.split(
                `="og:${placeholders[i].name}" content="`
              );
              let newsystemPlaceholdersOG: any[] = [];

              for (let p = 1; p < systemPlaceholdersOG.length; p++) {
                let indiceOP = systemPlaceholdersOG[p].includes('" />')
                  ? systemPlaceholdersOG[p].indexOf('" />')
                  : systemPlaceholdersOG[p].indexOf('">');

                newsystemPlaceholdersOG.push(
                  systemPlaceholdersOG[p].substring(0, indiceOP)
                );
                let index = j + 1;
                htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
                  `[$$og:${placeholders[i].name}${index}$$]`,
                  newsystemPlaceholdersOG[0]
                );
              }
            }
          }
        } else {
          //JSON-LD
          if (placeholders[i].required) {
            let systemPlaceholdersOG;
            for (let j = 0; j < articles.length; j++) {
              if (articles[j].metadata.html.includes(html.scripJsonLd)) {
                systemPlaceholdersOG = articles[j].metadata.html.split(
                  html.scripJsonLd
                );
              } else {
                systemPlaceholdersOG = articles[j].metadata.html.split(
                  'scriptJsonLd.innerHTML = `'
                );
              }
              let newsystemPlaceholdersOG: any[] = [];

              for (let p = 1; p < systemPlaceholdersOG.length; p++) {
                let indiceOP = articles[j].metadata.html.includes(
                  html.scripJsonLd
                )
                  ? systemPlaceholdersOG[p].indexOf('</script>')
                  : systemPlaceholdersOG[p].indexOf('`;');

                newsystemPlaceholdersOG.push(
                  systemPlaceholdersOG[p].substring(0, indiceOP)
                );

                let script;
                let classExist = newsystemPlaceholdersOG[0].indexOf('class=');
                if (classExist > 0) {
                  let calssString = newsystemPlaceholdersOG[0].split('class="');
                  let newcalssString: any[] = [];

                  for (let i = 1; i < calssString.length; i++) {
                    let indice = calssString[i].indexOf('">');
                    newcalssString.push(calssString[i].substring(0, indice));
                  }
                  script = newsystemPlaceholdersOG[0].replace(
                    `class="${newcalssString[0]}">`,
                    ''
                  );
                } else {
                  script = newsystemPlaceholdersOG[0];
                }
                let jsonLD = JSON.parse(script);
                let replace = this.searchPlaceholder(
                  jsonLD,
                  placeholders[i].name
                );
                let index = j + 1;
                htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
                  `[$$ld:${placeholders[i].name}${index}$$]`,
                  replace
                );
              }
            }
          }
        }
      }
    }
    return htmlContentPlaceholder;
  }

  searchPlaceholder(jsonLD, placeholders) {
    let placeholder = placeholders.split('.');
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
    return result;
  }

  replacePersonalization(
    htmlContentPlaceholder,
    placeholders,
    placeholderSystem
  ) {
    //placeholders unomi
    let unomiPlaceholders = htmlContentPlaceholder.split('[$$');
    let newUnomiPlaceholders: any[] = [];
    for (let i = 0; i < unomiPlaceholders.length; i++) {
      let indice = unomiPlaceholders[i].indexOf('$$]');

      newUnomiPlaceholders.push(unomiPlaceholders[i].substring(0, indice));
    }
    //REPLACE ESTANDARD
    for (let i = 0; i < placeholders.length; i++) {
      htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
        `$$${placeholders[i].name}$$`,
        placeholders[i].valueDefault
      );

      //REPLACE UNOMI
      for (let j = 1; j <= newUnomiPlaceholders.length; j++) {
        htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
          `[$$${placeholders[i].name}${j}$$]`,
          placeholders[i].valueDefault
        );
      }
    }

    //placeholder system
    let systemPlaceholders = htmlContentPlaceholder.split('[$$');
    let newSystemPlaceholders: any[] = [];
    for (let i = 0; i < systemPlaceholders.length; i++) {
      let indice = systemPlaceholders[i].indexOf('$$]');

      newSystemPlaceholders.push(systemPlaceholders[i].substring(0, indice));
    }

    for (let i = 0; i < placeholderSystem.length; i++) {
      for (let j = 1; j <= newSystemPlaceholders.length; j++) {
        //REPLACE OPEN FRAFT
        htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
          `[$$og:${placeholderSystem[i].name}${j}$$]`,
          placeholderSystem[i].valueDefault
        );

        //REPLACE JSON-LD
        htmlContentPlaceholder = htmlContentPlaceholder.replaceAll(
          `[$$ld:${placeholderSystem[i].name}${j}$$]`,
          placeholderSystem[i].valueDefault
        );
      }
    }

    return htmlContentPlaceholder;
  }
}
