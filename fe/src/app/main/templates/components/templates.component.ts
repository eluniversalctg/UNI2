import { MessageService } from 'primeng/api';
import { Component, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { Placeholders, Template } from 'src/app/shared/models';
import { PlaceholdersService, TemplateService } from 'src/app/shared/services';
import { ReplacePlaceholderService } from 'src/app/shared/services/replacePlaceholder.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent {
  image;
  newPlaceholder;
  default: boolean;
  newDefault: string;
  template: Template;
  valid: boolean = false;
  templates: Template[] = [];
  selectedTemplates: Template;
  addTempate: boolean = false;
  placeholders: Placeholders[];
  addPlaceholder: boolean = false;
  viewRadioButton: boolean = false;
  htmlContentPlaceholder: string = '';
  placeholdersSystem: Placeholders[] = [];
  @ViewChild('htmlContent') txtHtmlContent;
  addPlaceholderStandard: boolean = false;
  selectedPlaceholdersSystem: Placeholders;
  placeholdersStandard: Placeholders[] = [];
  selectedPlaceholdersStandard: Placeholders;

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

  constructor(
    private msg: MessageService,
    private templatesService: TemplateService,
    private placeholdersService: PlaceholdersService,
    private replacePlaceholderService: ReplacePlaceholderService
  ) {
    this.getAllTemplates();
    this.getAlPlaceholders();
    this.template = {
      htmlContent: '',
      title: '',
      state: true,
      numNews: 1,
      imagePreview: '',
    };
  }

  onChange() {
    this.htmlContentPlaceholder = this.template.htmlContent;

    let replace = this.replacePlaceholderService.replace(
      this.htmlContentPlaceholder,
      this.placeholders,
      this.newPlaceholder
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

  reset() {
    this.template._id = undefined;
    this.template.htmlContent = '';
    this.template.title = '';
    this.template.state = true;
    this.template.numNews = 1;
    this.template.inUse = false;
    this.template.typeTemplate = MessagesTst.RECOMENDATION;
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

        if (validJS === '.js' || validCss === '.css' || validScss === '.scss') {
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

        if (validJS === '.js' || validCss === '.css' || validScss === '.scss') {
          valid = false;
        }
      }
    }
    return valid;
  }

  save() {
    this.template.typeTemplate = MessagesTst.RECOMENDATION;
    if (this.template.numNews >= 1 && this.template.numNews <= 10) {
      if (
        this.template.htmlContent != '' &&
        this.template.title != '' &&
        this.image != undefined
      ) {
        let found = this.template.htmlContent.indexOf('class');
        let valid = this.validString(this.template.htmlContent);
        this.template.imagePreview = this.image;
        if (found < 0 && valid) {
          //save
          if (!this.template._id) {
            //check that you don't duplicate the id
            const findDuplicated = this.templates.find(
              (x) => x.title === this.template.title
            );
            if (findDuplicated) {
              return this.msg.add({
                severity: MessagesTst.WARNING,
                summary: MessagesTst.EXISTTEMPLATE,
              });
            } else {
              //save in the db
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
            }
          } else {
            //check that you don't duplicate the id
            const findDuplicated = this.templates.find(
              (x) =>
                x.title === this.template.title && x._id != this.template._id
            );
            if (findDuplicated) {
              return this.msg.add({
                severity: MessagesTst.WARNING,
                summary: MessagesTst.EXISTTEMPLATE,
              });
            } else {
              //update in the data base
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
          }
        } else {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORCLASS,
          });
        }
      } else {
        let messagestError = 'Debe llenar los campos: ';
        let message = false;
        if (this.template.htmlContent === '') {
          messagestError += ' html';
          message = true;
        }
        if (this.template.title === '') {
          messagestError += message ? ', título ' : ' título ';
          message = true;
        }
        if (this.image === undefined) {
          messagestError += message
            ? ', imagen de preview'
            : ' imagen de preview';
        }

        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: messagestError,
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

  loadTemplates(edit) {
    this.reset();

    if (edit) {
      if (this.selectedTemplates) {
        this.template = { ...this.selectedTemplates };
        this.addTempate = false;
        this.image = this.selectedTemplates.imagePreview;
        this.onChange();
      } else {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORDATA,
        });
      }
    } else {
      if (this.selectedTemplates) {
        this.template = { ...this.selectedTemplates };
        this.template.title = '';
        this.template._id = undefined;
        this.addTempate = false;
        this.onChange();
      } else {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORDATA,
        });
      }
    }
  }
  clean() {
    this.selectedTemplates = new Template();
    this.htmlContentPlaceholder = '';
    this.htmlContentPlaceholder = '';
    this.reset();
    this.newPlaceholder = undefined;
  }

  obtenerSelecionado(placeholder: Placeholders, newDefault) {
    var editor = this.txtHtmlContent;
    var u = editor.nativeElement.value.toString();
    var start = editor.nativeElement.selectionStart;
    var end = editor.nativeElement.selectionEnd;

    const select = [
      u.substring(0, start),
      u.substring(end),
      u.substring(start, end),
    ];

    if (placeholder.type === MessagesTst.SYSTEM) {
      if (placeholder.required) {
        if (placeholder.typesMetaData === MessagesTst.OpenGraph) {
          let systemPlaceholders = u.split('[$$og:');
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
          let systemPlaceholders = u.split('[$$ld:');
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
      } else {
        this.template.htmlContent = `${select[0]}${placeholder.valueDefault}${select[1]}`;
      }
    } else {
      if (this.default) {
        this.template.htmlContent = `${select[0]}${newDefault}${select[1]}`;
      } else {
        this.template.htmlContent = `${select[0]}$$${placeholder.name}$$${select[1]}`;
      }
    }
    if (this.default) {
      this.newPlaceholder = {
        name: placeholder.name,
        valueDefault: newDefault,
      };
    } else {
      this.newPlaceholder = undefined;
    }

    this.addPlaceholder = false;
    this.addPlaceholderStandard = false;
    this.onChange();
  }

  getAlPlaceholders() {
    this.placeholdersService.getList().subscribe(
      (response) => {
        this.placeholders = response;
        this.placeholders.forEach((placeholder) => {
          if (placeholder.isActive) {
            if (placeholder.type === MessagesTst.SYSTEM) {
              this.placeholdersSystem.push(placeholder);
            } else {
              this.placeholdersStandard.push(placeholder);
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

  dialogPlaceholder() {
    this.addPlaceholder = true;
  }
  dialogPlaceholderStandard() {
    this.addPlaceholderStandard = true;
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
