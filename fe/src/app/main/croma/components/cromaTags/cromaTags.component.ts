import moment from 'moment';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Component, ViewChild } from '@angular/core';
import { Croma, MatomoTags } from 'src/app/shared/models';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { Template } from 'src/app/shared/models/template.model';
import { TemplateService } from 'src/app/shared/services/templates.service';
import {
  CromaService,
  MatomoService,
  UtilitiesService,
} from 'src/app/shared/services';
import { CreatePlaceholderArtService } from 'src/app/shared/services/createPlaceholderArt.service';

@Component({
  selector: 'app-croma-tags',
  styleUrls: ['./cromaTags.component.scss'],
  templateUrl: './cromaTags.component.html',
})
export class CromaTagsComponent {
  selectedSearch: string = 'text';
  wordOrText: string;
  cromaData: Croma[] = [];
  periodSelected: string = 'year';
  dateSelected: Date = new Date();
  dateSelectedFormted: string = '';
  tags: MatomoTags[] = [];
  selectedTags: MatomoTags[] = [];
  openArticle: boolean = false;
  openshowArticle: boolean = false;
  analitics: boolean = false;
  showMessage: boolean = false;
  analiticsData: any;
  seeArticle = new Croma();

  cols: any[] = [];
  keys: any[] = [];
  artComplete: any[] = [];
  matomoResponse: any[] = [];

  _selectedColumns: any[];

  items = [{ label: 'Seleccionados' }, { label: 'Plantillas' }];
  stepPage: number = 0;
  templatesTemp: Template[] = [];
  templates: Template[] = [];
  selectedTemplates;
  previewTemplate;
  index: number;
  uploadedFiles: any[] = [];
  selectedRows;
  selected: boolean = true;

  @ViewChild('tableArt') tableArt;

  constructor(
    private router: Router,
    private msg: MessageService,
    private matomoSrv: MatomoService,
    private cromaService: CromaService,
    private utilities: UtilitiesService,
    private templatesService: TemplateService,
    private createPlaceholderArtService: CreatePlaceholderArtService
  ) {
    //format date.now if user doesn't select date
    this.formatDate();
    this.matomoSrv.getList().subscribe({
      next: (data) => (this.tags = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORTAGSMA,
        }),
    });
    this.getAllTemplates();

    if (!this.validateSite()) {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.NOSITE,
      });
    }
  }

  /**
   * search on cromaAI
   * @param type word or text or URL
   * @param text single word or string
   */
  getByText(type: string, text: string) {
    const site = this.validateSite();

    if (!site) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: MessagesTst.NOSITE,
      });
    }

    this.cromaData = [];
    if (type === 'url') {
      text = encodeURIComponent(text);
    }

    let query = 'Actions.getPageUrl&';
    this.selectedTags.forEach((tag) => {
      let customParams = '';
      if (tag.customParameters) {
        tag.customParameters.forEach((x) => {
          customParams += `${x.parameter}=${x.value}`;
        });
      }
      query = query.concat(`${tag.module}.${tag.tag}_${customParams}&`);
    });
    query = query.substring(0, query.length - 1);
    this.cromaService
      .getByUrl(
        `${type}`,
        `${text}/${query}/${this.periodSelected}/${this.dateSelectedFormted}/${site._id}`
      )
      .subscribe({
        next: (data) => {
          data.forEach((art) => {
            if (art['metadata'].valid) {
              if (art.matomo && !art.matomo[0]['Actions.getPageUrl'][0]) {
                art.matomo[0]['Actions.getPageUrl'].push({
                  nb_hits: '',
                  avg_time_on_page: '',
                  entry_bounce_count: '',
                  bounce_rate: '',
                });
              }
              this.cromaData.push(art);
            }
          });
          if (this.cromaData.length === 0) {
            this.showMessage = true;
          } else {
            this.showMessage = false;
          }
        },
        error: () =>
          this.msg.add({
            severity: MessagesTst.WARNING,
            summary: MessagesTst.EERORCROMA,
          }),
      });
  }

  /**
   * format date because matomo use YYYY-MM-DD
   */
  formatDate() {
    if (this.periodSelected === 'range') {
      let startDate = moment(this.dateSelected.toString().split(',')[0]).format(
        'YYYY-MM-DD'
      );
      let endDate = moment(this.dateSelected.toString().split(',')[1]).format(
        'YYYY-MM-DD'
      );
      this.dateSelectedFormted = `${startDate},${endDate}`;
    } else {
      this.dateSelectedFormted = moment(this.dateSelected).format('YYYY-MM-DD');
    }
  }

  /**
   * set article information
   */
  setArticle(article) {
    this.seeArticle.text = article.text;
    this.seeArticle.title = article.title;
    this.seeArticle.summary = article.summary;
    this.openArticle = true;
  }

  /**
   * show article popup
   */
  showAnalitics(analitics?) {
    this.cols = [];
    this.keys = [];

    for (let i = 0; i < analitics.matomo.length; i++) {
      //get the answer from matomo
      const element = analitics.matomo[i];

      // value is value we need to operate on
      let value = Array.isArray(element)
        ? Object.keys(element[0])
        : Object.keys(element);

      //found is the name that will be displayed
      const found = this.tags.find((x) => `${x.module}.${x.tag}` === value[0]);
      if (found) {
        analitics.matomo[i][value[0]] = Array.isArray(
          analitics.matomo[i][value[0]]
        )
          ? analitics.matomo[i][value[0]]
          : [analitics.matomo[i][value[0]]];

        //Are the names of the columns
        let colums = analitics.matomo[i][value[0]]
          ? analitics.matomo[i][value[0]]
          : undefined;

        let columnsShows: any[] = [];
        //get the name of columns
        let keyColums = Object.keys(colums[0]);
        keyColums.forEach((element) => {
          columnsShows.push({
            header: element,
            field: element,
          });
        });

        //is the object we created
        let key = {
          header: found?.name,
          value: value[0],
          cols: columnsShows,
          selectedColumns: found?.columns,
        };
        this.keys.push(key);
      }
    }

    this.analiticsData = analitics.matomo;
    this.analitics = true;
  }

  selectRow() {
    if (this.selectedRows.length > 0) {
      this.selected = false;
    } else {
      this.selected = true;
    }
  }

  //open dialog steps
  showSelect() {
    this.openshowArticle = true;
  }
  //end open dialog steps

  nextStep() {
    this.stepPage += 1;
    this.templates = [];
    for (let i = 0; i < this.templatesTemp.length; i++) {
      if (this.templatesTemp[i].state === true) {
        if (this.templatesTemp[i].numNews === this.selectedRows.length) {
          this.templates.push(this.templatesTemp[i]);
        }
      }
    }
  }

  //templates
  getAllTemplates() {
    this.templatesService.getList().subscribe(
      (response) => {
        this.templatesTemp = response;
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }
  //end templates

  // number of images to upload
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
  //end number of images to upload

  //load images
  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
  //end load images

  //redirect the renderizar template and load variables
  render() {
    if (this.selectedRows.length > 0 && this.selectedTemplates) {
      this.createPlaceholderArtService.loadArticle(this.selectedRows);
      this.createPlaceholderArtService.loadTemplate(this.selectedTemplates);
      if (this.index === this.uploadedFiles.length) {
        this.createPlaceholderArtService.loadImages(this.uploadedFiles);
        this.router.navigateByUrl('/main/createTemplateArt');
      } else {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORIMAGE,
        });
      }
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORCOMPLETEDATA,
      });
    }
  }
  //end redirect the renderizar template and load variables

  //close dialog steps
  close() {
    this.openshowArticle = false;
    if (this.stepPage > 0) {
      this.stepPage -= 1;
    }
    this.selectedTemplates = undefined;
  }
  //end close dialog steps

  //remove item from table in sttep 1
  deleteArt(art) {
    let found = this.selectedRows.find((x) => x.article_id === art.article_id);

    if (found) {
      let indexTable = this.selectedRows.findIndex(
        (x) => x.article_id === art.article_id
      );
      this.selectedRows.splice(indexTable, 1);
      this.tableArt.reset();
    }

    this.selectedRows = [...this.selectedRows];
  }
  //end remove item from table in sttep 1

  changeSelect() {
    this.cromaData = [];
    this.wordOrText = '';
  }

  validateSite() {
    const site = this.utilities.decryptSite();
    if (site && site._id) {
      return site;
    } else {
      return undefined;
    }
  }
}
