import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { Template } from 'src/app/shared/models/template.model';
import { Placeholders } from 'src/app/shared/models/placeholders.model';
import { TemplateService } from 'src/app/shared/services/templates.service';
import { PlaceholdersService } from 'src/app/shared/services/placeholders.service';
import { ReplacePlaceholderService } from 'src/app/shared/services/replacePlaceholder.service';
import { CreatePlaceholderArtService } from 'src/app/shared/services/createPlaceholderArt.service';
@Component({
  selector: 'app-createTemplateArt',
  templateUrl: './createTemplate.component.html',
})
export class CreateTemplateComponent implements OnInit {
  articles;
  index: number;
  previewTemplate;
  template: Template;
  imagesLoad: any[] = [];
  uploadedFiles: any[] = [];
  templates: Template[] = [];
  addTempate: boolean = false;
  selectedTemplates: Template;
  placeholders: Placeholders[];
  templatesTemp: Template[] = [];
  htmlContentPlaceholder: string = '';
  @ViewChild('fileUpload') fileUpload;
  @ViewChild('htmlContent') htmlContent;

  constructor(
    private msg: MessageService,
    private templatesService: TemplateService,
    private placeholdersService: PlaceholdersService,
    private replacePlaceholderService: ReplacePlaceholderService,
    private createPlaceholderArtService: CreatePlaceholderArtService
  ) {
    this.getAllTemplates();
    this.getAlPlaceholders();
    this.template = {
      htmlContent: '',
      state: false,
      title: '',
      numNews: 0,
      imagePreview: '',
    };
  }
  ngOnInit() {
    this.articles = this.createPlaceholderArtService.saveArticle();
    this.uploadedFiles = this.createPlaceholderArtService.saveImages();
    this.selectedTemplates = this.createPlaceholderArtService.saveTemplate();
    this.loadTemplates();
  }

  updateTemplates() {
    this.addTempate = true;
  }

  getAllTemplates() {
    this.templatesService.getList().subscribe(
      (response) => {
        this.templatesTemp = response;
        for (let i = 0; i < this.templatesTemp.length; i++) {
          if (this.templatesTemp[i].state === true) {
            if (this.templatesTemp[i].numNews === this.articles.length) {
              this.templates.push(this.templatesTemp[i]);
            }
          }
        }
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  loadTemplates() {
    if (this.selectedTemplates) {
      this.template = { ...this.selectedTemplates };
      this.addTempate = false;
      const formData = new FormData();
      for (let i = 0; i < this.uploadedFiles.length; i++) {
        formData.append('File', this.uploadedFiles[i]);
      }
      this.replacePlaceholderService.add(formData).subscribe((data) => {
        if (data) {
          this.imagesLoad = data;
          this.onChange();
        }
      });
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORDATA,
      });
    }
  }

  getAlPlaceholders() {
    this.placeholdersService.getList().subscribe(
      (response) => {
        this.placeholders = response;
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  numImages(selectedTemplates) {
    this.previewTemplate = '';
    let htmlContentPlaceholder = selectedTemplates.htmlContent;
    let systemPlaceholders = htmlContentPlaceholder.split('[$$');
    let newsystemPlaceholders: any[] = [];
    for (let i = 0; i < systemPlaceholders.length; i++) {
      let indice = systemPlaceholders[i].indexOf('$$]');
      newsystemPlaceholders.push(systemPlaceholders[i].substring(0, indice));
    }
    let images = newsystemPlaceholders.filter(
      (x) => x.indexOf(MessagesTst.Image) === 0
    );
    this.index = images.length;

    this.previewTemplate = selectedTemplates.imagePreview;
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.loadTemplates();
  }

  onChange() {
    this.htmlContentPlaceholder = this.template.htmlContent;
    let replace = this.replacePlaceholderService.replaceFinally(
      this.htmlContentPlaceholder,
      this.placeholders,
      this.articles,
      this.imagesLoad
    );
    this.addTempate = false;
    this.htmlContentPlaceholder = `<div>${replace}</div>`;
  }

  copyText() {
    if (this.htmlContentPlaceholder != '') {
      navigator.clipboard.writeText(this.htmlContentPlaceholder);
      this.msg.add({
        severity: MessagesTst.SUCCESS,
        summary: MessagesTst.SUCCESSCOPY,
      });
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORCOPY,
      });
    }
  }
}
