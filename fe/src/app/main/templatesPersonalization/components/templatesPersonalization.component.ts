import {
  Placeholders,
  PlaceholderUnomi,
  TemplatePersonalization,
} from 'src/app/shared/models';
import {
  PlaceholdersService,
  PlaceholderUnomiService,
  ReplacePlaceholderService,
  TemplatePersonalizationService,
} from 'src/app/shared/services';
import { MessageService } from 'primeng/api';
import { Component, ViewChild } from '@angular/core';
import { MessagesTst, html } from 'src/app/shared/enums';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-templatesPersonalization',
  templateUrl: './templatesPersonalization.component.html',
  styleUrls: ['./templatesPersonalization.component.scss'],
})
export class TemplatesPersonalizationComponent {
  image;
  newPlaceholder;
  default: boolean;
  newDefault: string;
  template: TemplatePersonalization;
  valid: boolean = false;
  templates: TemplatePersonalization[] = [];
  selectedTemplates: TemplatePersonalization;
  addTempate: boolean = false;
  placeholders: PlaceholderUnomi[];
  addPlaceholder: boolean = false;
  viewRadioButton: boolean = false;
  htmlContentPlaceholder: string = '';
  placeholdersUnomi: PlaceholderUnomi[] = [];
  @ViewChild('htmlContent') txtHtmlContent;
  addPlaceholderStandard: boolean = false;
  addPlaceholderSystem: boolean = false;
  selectedPlaceholdersUnomi: PlaceholderUnomi;
  placeholdersStandard: PlaceholderUnomi[] = [];
  selectedPlaceholdersStandard: PlaceholderUnomi;
  placeholderUpdate: PlaceholderUnomi[] = [];

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    outline: true,
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };

  placeholdersSystem: Placeholders[] = [];
  placeholdersSys: Placeholders[] = [];
  selectedPlaceholdersSystem: Placeholders;

  constructor(
    private msg: MessageService,
    private placeholdersService: PlaceholderUnomiService,
    private placeholdersSystemService: PlaceholdersService,
    private templatesService: TemplatePersonalizationService,
    private replacePlaceholderService: ReplacePlaceholderService
  ) {
    this.getAllTemplates();
    this.getAlPlaceholders();
    this.getAlPlaceholdersSystem();
    this.template = {
      htmlContent: '',
      title: '',
      state: true,
      imagePreview: '',
      numNews: 1,
    };
  }

  onChange() {
    this.htmlContentPlaceholder = this.template.htmlContent;

    let replace = this.replacePlaceholderService.replacePersonalization(
      this.htmlContentPlaceholder,
      this.placeholders,
      this.placeholdersSys
    );
    this.htmlContentPlaceholder = `<div>${replace}</div>`;
  }

  getAllTemplates() {
    this.templatesService.getList().subscribe(
      (response) => {
        this.templates = response;
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  getAlPlaceholdersSystem() {
    this.placeholdersSystemService.getList().subscribe(
      (response) => {
        this.placeholdersSys = response;
        this.placeholdersSys.forEach((placeholder) => {
          if (placeholder.isActive) {
            if (placeholder.type === MessagesTst.SYSTEM) {
              placeholder['typeUpdate']=false;
              this.placeholdersSystem.push(placeholder);
            }
          }
        });
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  reset() {
    this.template._id = undefined;
    this.template.htmlContent = '';
    this.template.numNews = 1;
    this.template.title = '';
    this.template.state = false;
    this.template.width = undefined;
    this.template.high = undefined;
    this.template.inUse = false;
  }

  validString(data) {
    let valid = true;

    let foundLink = this.template.htmlContent.indexOf('href=');
    if (foundLink >= 0) {
      let key = 'href="';
      let index = data.search(key) + key.length;
      let sentences = data.substring(index, data.length - 1);
      let newString = sentences.split('"')[0];

      let validHttps = newString.search('https://');
      if (validHttps < 0) {
        let validJS = newString.substr(-3);
        let validCss = newString.substr(-4);
        let validScss = newString.substr(-5);

        if (
          validJS === html.JS ||
          validCss === html.CSS ||
          validScss === html.SCSS
        ) {
          valid = false;
        }
      }
    }

    let foundScript = this.template.htmlContent.indexOf('src=');
    if (foundScript >= 0) {
      let key = 'src="';
      let index = data.search(key) + key.length;
      let sentences = data.substring(index, data.length - 1);
      let newString = sentences.split('"')[0];
      let validHttps = newString.search('https://');
      if (validHttps < 0) {
        let validJS = newString.substr(-3);
        let validCss = newString.substr(-4);
        let validScss = newString.substr(-5);

        if (
          validJS === html.JS ||
          validCss === html.CSS ||
          validScss === html.SCSS
        ) {
          valid = false;
        }
      }
    }
    return valid;
  }
  updatePlaceholders() {
    this.placeholdersService
      .updateMany(this.placeholderUpdate, 'updateMany')
      .subscribe(
        (response) => {},
        () => {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORLIST,
          });
        }
      );
  }

  save() {
    if (this.template.numNews >= 1 && this.template.numNews <= 10) {
      let valdExistTemplate = this.templates.find(
        (x) => x.title === this.template.title
      );
      if (
        this.template.htmlContent != '' &&
        this.template.title != '' &&
        this.template.high &&
        this.template.width &&
        this.template.typeTemplate != undefined
      ) {
        let found = this.template.htmlContent.indexOf('class');
        let valid = this.validString(this.template.htmlContent);

        //Validate that the html does not contain the insertion of third party code through class, js, css, scss
        if (found < 0 && valid) {
          //update placeholders use
          this.updatePlaceholders();
          //save or update
          if (!this.template._id) {
            if (!valdExistTemplate) {
              this.template.inUse = false;
              this.templatesService.add(this.template).subscribe(
                (data) => {
                  if (data) {
                    this.msg.add({
                      severity: MessagesTst.SUCCESS,
                      summary: MessagesTst.INSERTSUCCESS,
                    });
                    this.htmlContentPlaceholder = '';
                    this.reset();
                    this.getAllTemplates();
                  }
                },
                (error) => {
                  this.msg.add({
                    severity: MessagesTst.ERROR,
                    summary: MessagesTst.INSERTERROR,
                  });
                }
              );
            } else {
              this.msg.add({
                severity: MessagesTst.ERROR,
                summary: MessagesTst.EXISTTEMPLATE,
              });
            }
          } else {
            this.templatesService.update(this.template).subscribe(
              (data) => {
                if (data) {
                  this.msg.add({
                    severity: MessagesTst.SUCCESS,
                    summary: MessagesTst.UPDATESUCCESS,
                  });
                  this.htmlContentPlaceholder = '';
                  this.reset();
                  this.getAllTemplates();
                }
              },
              (error) => {
                this.msg.add({
                  severity: MessagesTst.ERROR,
                  summary: MessagesTst.INSERTERROR,
                });
              }
            );
          }
        } else {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORCLASS,
          });
        }
      } else {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORDATA,
        });
      }
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORNUMNEWS,
      });
    }
  }

  updateTemplates() {
    this.addTempate = true;
  }

  loadTemplates() {
    this.reset();
    if (this.selectedTemplates) {
      this.template = { ...this.selectedTemplates };
      this.addTempate = false;
      this.onChange();
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORDATA,
      });
    }
  }
  clean() {
    this.selectedTemplates = new TemplatePersonalization();
    this.htmlContentPlaceholder = '';
    this.htmlContentPlaceholder = '';
    this.reset();
    this.newPlaceholder = undefined;
  }

  obtenerSelecionado(placeholder, newDefault) {
    var editor = this.txtHtmlContent;
    var htmlText = editor.nativeElement.value.toString();
    var start = editor.nativeElement.selectionStart;
    var end = editor.nativeElement.selectionEnd;

    const select = [
      htmlText.substring(0, start),
      htmlText.substring(end),
      htmlText.substring(start, end),
    ];

    if (placeholder.type === MessagesTst.SYSTEM) {
      if (placeholder.typesMetaData === MessagesTst.OpenGraph) {
        let systemPlaceholders = htmlText.split('[$$og:');
        let newsystemPlaceholders: any[] = [];
        for (let i = 0; i < systemPlaceholders.length; i++) {
          let indice = systemPlaceholders[i].indexOf('$$]');
          newsystemPlaceholders.push(
            systemPlaceholders[i].substring(0, indice)
          );
        }
        let numPlaceholder = newsystemPlaceholders.filter(
          (x) => x.indexOf(placeholder.name) === 0
        );
        let index = numPlaceholder.length + 1;
        this.template.htmlContent = `${select[0]}[$$og:${placeholder.name}${index}$$]${select[1]}`;
      } else {
        let systemPlaceholders = htmlText.split('[$$');
        let newsystemPlaceholders: any[] = [];
        for (let i = 0; i < systemPlaceholders.length; i++) {
          let indice = systemPlaceholders[i].indexOf('$$]');
          newsystemPlaceholders.push(
            systemPlaceholders[i].substring(0, indice)
          );
        }
        let numPlaceholder = newsystemPlaceholders.filter(
          (x) => x.indexOf(placeholder.name) === 0
        );
        let index = numPlaceholder.length + 1;
        this.template.htmlContent = `${select[0]}[$$${placeholder.name}${index}$$]${select[1]}`;
      }
    } else if (placeholder.type === html.UNOMI) {
      let systemPlaceholders = htmlText.split('[$$');
      let newsystemPlaceholders: any[] = [];
      for (let i = 0; i < systemPlaceholders.length; i++) {
        let indice = systemPlaceholders[i].indexOf('$$]');
        newsystemPlaceholders.push(systemPlaceholders[i].substring(0, indice));
      }
      let numPlaceholder = newsystemPlaceholders.filter(
        (x) => x.indexOf(placeholder.name) === 0
      );
      let index = numPlaceholder.length + 1;
      this.template.htmlContent = `${select[0]}[$$${placeholder.name}${index}$$]${select[1]}`;
    } else {
      if (this.default) {
        this.template.htmlContent = `${select[0]}${newDefault}${select[1]}`;
      } else {
        this.template.htmlContent = `${select[0]}$$${placeholder.name}$$${select[1]}`;
      }
    }

    let found = this.placeholderUpdate.find((x) => x._id === placeholder._id);
    if (!found) {
      placeholder.isInUse = true;
      if(placeholder.typeUpdate){

        this.placeholderUpdate.push(placeholder);
      }
    }
    this.addPlaceholder = false;
    this.addPlaceholderStandard = false;
    this.addPlaceholderSystem = false;
    this.onChange();
    this.newDefault = '';
  }

  getAlPlaceholders() {
    this.placeholdersService.getList().subscribe(
      (response) => {
        this.placeholders = response;
        this.placeholders.forEach((placeholder) => {
          placeholder['typeUpdate']=true;
          if (placeholder.type === html.UNOMI) {
            this.placeholdersUnomi.push(placeholder);
          } else {
            this.placeholdersStandard.push(placeholder);
          }
        });
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  dialogPlaceholder() {
    this.addPlaceholder = true;
  }
  dialogPlaceholderStandard() {
    this.addPlaceholderStandard = true;
  }
  dialogPlaceholderSystem() {
    this.addPlaceholderSystem = true;
  }

  changePlaceholders(select) {
    if (select) {
      if (select.type === MessagesTst.STANDARD) {
        this.viewRadioButton = true;
      } else {
        this.viewRadioButton = false;
      }
    } else {
      this.viewRadioButton = false;
    }
  }

  onUpload(event, fileUpload) {
    var mimeType = event.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORIMAGE,
      });
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.files[0]);

    reader.onload = (_event) => {
      this.image = reader.result;
      if (this.image) {
        this.msg.add({
          severity: MessagesTst.SUCCESS,
          summary: MessagesTst.SUCCESSIMAGE,
        });
        fileUpload.clear();
      }
    };
  }
}
