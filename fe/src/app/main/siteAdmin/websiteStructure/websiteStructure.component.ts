import {
  Output,
  Input,
  Component,
  OnChanges,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import {
  Pages,
  Blocks,
  Period,
  Weighing,
  WizardData,
  WizardModel,
  Placeholders,
  Personalization,
  PlaceholderUnomi,
  MatomoTags,
} from 'src/app/shared/models';
import {
  BlockService,
  WeighingService,
  PersonalizationService,
  PlaceholderUnomiService,
  TemplatePersonalizationService,
  MatomoService,
} from 'src/app/shared/services';
import { MessagesTst } from 'src/app/shared/enums';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-website-structure',
  templateUrl: './websiteStructure.component.html',
  styleUrls: ['./websiteStructure.component.scss'],
})
export class WebsiteStructureComponent implements OnChanges {
  items: MenuItem[];
  stepPage: number = 0;
  templates: any[] = [];
  templatesTemp: any[] = [];
  blocks: Blocks[] = [];
  blocksTemp: Blocks[] = [];
  wizard: WizardModel = new WizardModel();
  wizardData: WizardData = new WizardData();
  rules: Personalization[] = [];
  cols: any[];
  typeTemplate: boolean = false;

  placehoPersona: PlaceholderUnomi[] = [];

  newPlaceholPers: Placeholders[] = [];
  weighing: Weighing;
  weighingTemp: Weighing;
  typeIfrmame: string;

  validateNewRule: boolean = false;

  @Input() pageAddBlock: Pages;
  @Input() editBlock: WizardModel;

  @Output() childEvent = new EventEmitter();

  //nota esto se debe cambiar mas adelante
  tags: MatomoTags[] = [];

  @ViewChild('tableRules') tableRules;

  constructor(
    private msg: MessageService,
    private blockService: BlockService,
    private tagsService: MatomoService,
    private weighingService: WeighingService,
    private personalizationService: PersonalizationService,
    private placeholderPersServise: PlaceholderUnomiService,
    private templatesService: TemplatePersonalizationService
  ) {
    const getBlocks = this.blockService.getList();
    const weighingServ = this.weighingService.getList();
    const rules = this.personalizationService.getList();
    const getPersTemplate = this.templatesService.getList();
    const placeholderPers = this.placeholderPersServise.getList();
    const tagsReq = this.tagsService.getList();
    forkJoin([
      getBlocks,
      getPersTemplate,
      rules,
      placeholderPers,
      weighingServ,
      tagsReq,
    ]).subscribe({
      next: (response) => {
        this.blocksTemp = _.filter(response[0], 'isActive');
        this.templatesTemp = [...response[1]];
        this.templatesTemp = _.filter(this.templatesTemp, 'state');
        this.rules = response[2];
        this.placehoPersona = response[3];
        this.weighing = response[4][0];
        this.weighingTemp = response[4][0];
        this.tags = response[5];
      },
    });
    this.cols = [
      { field: 'rule.name', header: 'Regla' },
      { field: 'template.title', header: 'Plantilla' },
    ];
    this.items = [
      {
        label: '',
        title: 'Seleccione el bloque que desea integrar en la página',
      },
      { label: '', title: 'Seleccione una regla' },
      {
        label: '',
        title:
          'Si son plantillas editorial habilitan la parte de croma  y matomo.',
      },
      { label: '', title: 'En caso de editorial' },
      { label: '', title: 'Desea agregar mas reglas' },
      { label: '', title: 'Resumen' },
      { label: '', title: 'HTML generado' },
    ];
    this.wizardData.cromaPeriod = new Period();
    this.wizardData.matomoPeriod = new Period();
  }

  /**
   * When the AdBlock page changes, update the blocks array to be a copy of the blocksTemp array, and
   * then remove any blocks already on the selected page.
   **/
  ngOnChanges() {
    this.blocks = JSON.parse(JSON.stringify(this.blocksTemp));
    if (this.pageAddBlock) {
      this.pageAddBlock.wizardModel?.forEach((data) => {
        if (data.block) {
          this.blocks = _.differenceBy(
            this.blocks,
            [{ _id: data.block._id }],
            '_id'
          );
        }
      });
    }
    if (this.editBlock) {
      this.stepPage = 4;
      if (this.pageAddBlock.wizardModel) {
        this.pageAddBlock.wizardModel.forEach((data) => {
          if (data.block._id === this.editBlock['_id']) {
            this.wizard = data;
            this.filterTemplate(this.wizard.block);
          }
        });
      }
    }
  }

  addMoreRules(confirm) {
    if (!this.wizard.stepsData) {
      this.wizard.stepsData = [];
    }
    if (this.wizardData.rule && this.wizardData.template) {
      this.wizard.stepsData.push(this.wizardData);
    }
    this.wizardData = new WizardData();
    this.wizardData.cromaPeriod = new Period();
    this.wizardData.matomoPeriod = new Period();
    this.weighing = JSON.parse(JSON.stringify(this.weighingTemp));
    this.newPlaceholPers = [];

    if (confirm) {
      this.stepPage = 1;
      this.validateNewRule = true;
    } else {
      this.stepPage++;
    }
  }

  selectTemplate() {
    //separate placeholders from html
    let placeholders = this.wizardData.template['htmlContent'].split('$$');
    this.newPlaceholPers = [];
    for (let i = 0; i < placeholders.length; i++) {
      //adds to an array of the standard placeholders
      this.placehoPersona.forEach((personalization) => {
        if (placeholders[i] === personalization.name) {
          this.newPlaceholPers.push(
            JSON.parse(JSON.stringify(personalization))
          );
        }
      });
    }
  }

  addNewPlaceholder() {
    let newPlaceholderTemp = JSON.parse(JSON.stringify(this.newPlaceholPers));
    //delete to an array of unmodified standard placeholders personalization
    this.newPlaceholPers.forEach((placeholder) => {
      let found = this.placehoPersona.find((x) => x.name === placeholder.name);
      if (found) {
        if (placeholder.valueDefault === found.valueDefault) {
          let index = newPlaceholderTemp.findIndex(
            (x) => x.name === found.name
          );
          newPlaceholderTemp.splice(index, 1);
        }
      }
    });
    this.wizardData.newPlaceholder = newPlaceholderTemp;
  }

  validateSteps(next: boolean) {
    switch (this.stepPage) {
      case 0: {
        if (this.wizard.block) {
          this.filterTemplate(this.wizard.block);
          this.stepsMove(next);
        } else if (next) {
          this.customError('Debe seleccionar un bloque');
        }
        break;
      }
      case 1: {
        if (this.wizardData.rule) {
          if (this.validRule(next)) {
            this.stepsMove(next);
          }
        } else if (next) {
          this.customError('Debe seleccionar una regla');
        } else {
          if (this.validRule(next)) {
            this.stepsMove(next);
          }
        }
        break;
      }
      case 2: {
        if (this.wizardData.template) {
          this.stepsMove(next);

          //activate the chroma and matomo part for the recommendation templates
          this.typeTemplate = false;
          this.validTypeTemplate(next);
        } else if (next) {
          this.customError('Debe seleccionar una plantilla');
        } else {
          this.stepsMove(next);

          //activate the chroma and matomo part for the recommendation templates
          this.typeTemplate = false;
          this.validTypeTemplate(next);
        }
        break;
      }
      case 3: {
        // me falta validar lo que es de matomo y croma
        this.stepsMove(next);
        //add placeholder to the model
        this.addNewPlaceholder();

        break;
      }
      case 5: {
        this.stepsMove(next);
        //generate the iframe to copy it
        this.generateIframe();
        break;
      }
      case 6: {
        this.stepsMove(next);
        break;
      }
    }
  }

  filterTemplate(block) {
    this.templates = [];
    this.templatesTemp.forEach((template) => {
      let found = block.sizes.find(
        (x) => x === `${template.high}x${template.width}`
      );
      if (found) {
        this.templates.push(JSON.parse(JSON.stringify(template)));
      }
    });
    if (this.pageAddBlock.typeSection === MessagesTst.PAGESECTION) {
      this.templates = _.filter(this.templates, [
        'typeTemplate',
        MessagesTst.PERSONALIZATION,
      ]);
    }
  }

  validRule(next) {
    let valid = true;

    if (next && this.wizard.stepsData) {
      if (this.wizard.stepsData.length > 0) {
        this.wizard.stepsData.forEach((data) => {
          if (data.rule['_id'] === this.wizardData.rule['_id']) {
            valid = false;
          }
        });
      }
    }

    if (!valid) {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORRULESTEP,
      });
    }

    return valid;
  }

  validateDate() {
    let valid = true;

    if (this.wizardData.template.typeTemplate === MessagesTst.EDITORIAL) {
      if (!this.wizardData.typeTags) {
        valid = false;
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORDATA,
        });
      } else {
        if (this.wizardData.typeTags === MessagesTst.TYPECROMA) {
          if (!this.wizardData.cromaType) {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.ERRORDATA,
            });
            valid = false;
          } else {
            //valid luck the weighing
            if (this.wizardData.cromaType === 'Texto') {
              let total =
                Number(this.weighing.altPhoto.luck) +
                Number(this.weighing.body.luck) +
                Number(this.weighing.summary.luck) +
                Number(this.weighing.title.luck) +
                Number(this.weighing.topic.luck) +
                Number(this.weighing.url.luck);

              if (total != 100) {
                valid = false;
                this.msg.add({
                  severity: MessagesTst.ERROR,
                  summary: MessagesTst.ERROWEIGHING,
                });
              } else {
                this.wizardData.weighing = this.weighing;
              }
            } else if (this.wizardData.cromaType === 'ID') {
              //valid period croma
              if (
                !this.wizardData.cromaPeriod.day ||
                !this.wizardData.cromaPeriod.year ||
                !this.wizardData.cromaPeriod.month ||
                !this.wizardData.cromaPeriod.radius
              ) {
                valid = false;
                this.msg.add({
                  severity: MessagesTst.ERROR,
                  summary: MessagesTst.ERRORPERIOD,
                });
              }
            }
          }
        } else if (this.wizardData.typeTags === MessagesTst.TYPEMATOMO) {
          //valid period matomo
          if (
            !this.wizardData.matomoPeriod.day ||
            !this.wizardData.matomoPeriod.year ||
            !this.wizardData.matomoPeriod.month
          ) {
            valid = false;
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.ERRORPERIOD,
            });
          } else if (
            !this.wizardData.matomoTags ||
            !this.wizardData.matomoMetaData
          ) {
            valid = false;
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.ERRORDATA,
            });
          }
        }
      }
    }
    return valid;
  }

  stepsMove(next) {
    if (next) {
      if (this.stepPage === 3) {
        if (this.validateDate()) {
          this.stepPage++;
        }
      } else {
        if (this.stepPage === 5) {
          if (this.validateCountrule()) {
            this.stepPage++;
          }
        } else {
          this.stepPage++;
        }
      }
    } else {
      if (this.stepPage === 1 && this.validateNewRule) {
      } else {
        this.stepPage--;
      }
    }
  }

  validateCountrule() {
    let valid = false;
    if (this.wizard.stepsData.length > 0) {
      valid = true;
    } else {
      this.customError('Debe tener al menos una regla');
    }

    return valid;
  }

  customError(missing: string) {
    this.msg.add({
      severity: MessagesTst.ERROR,
      summary: missing,
    });
  }

  moveElement(recursiveList, i, to) {
    const element = recursiveList.splice(i, 1)[0];

    if (to === 'up') {
      recursiveList.splice(i - 1, 0, element);
    } else {
      recursiveList.splice(i + 1, 0, element);
    }
  }

  /**
   * If the user selects the editorial template, the typeTemplate variable is set to true. If the user
   * selects the personalization template, the stepPage variable is incremented by one and the
   * addNewPlaceholder() function is called
   * @param next - This is the next step in the wizard.
   */
  validTypeTemplate(next) {
    if (next) {
      if (this.wizardData.template.typeTemplate === MessagesTst.EDITORIAL) {
        this.typeTemplate = true;
      } else if (
        this.wizardData.template.typeTemplate === MessagesTst.PERSONALIZATION
      ) {
        this.stepPage = this.stepPage + 1;
        this.addNewPlaceholder();
      }
    }
  }

  /**
   * It returns a random character from the alphabet
   * @returns A random character between A-Z
   */
  getRChar() {
    return ((Math.random() * 26 + 10) | 0).toString(36).toUpperCase();
  }

  /**
   * It generates an iframe with a random id and assigns it to the wizard.divId property
   */
  generateIframe() {
    if (!this.wizard.divId) {
      this.wizard.divId =
        this.getRChar() +
        this.getRChar() +
        Math.floor(Math.random() * 9999 * 7);

      if (this.wizard.divId) {
        this.typeIfrmame = `
        <div style="overflow: auto">
          <iframe
            id="${this.wizard.divId}"
            uni2id="${this.wizard.divId}"
            ></iframe>
        </div>`;
      } else {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORIFRAME,
        });
      }
    } else {
      this.typeIfrmame = this.wizard.iframe;
    }
  }

  async copyClipboard() {
    await navigator.clipboard.writeText(this.typeIfrmame);

    this.msg.add({
      severity: MessagesTst.SUCCESS,
      summary: MessagesTst.SUCCESSCOPY,
    });

    if (!this.wizard.divId) {
      this.wizard.iframe = this.typeIfrmame;
    }
  }

  /**
   * The function saveWizard() is used to save the wizard in the pages
   */
  saveWizard() {
    if (!this.wizard.divId) {
      this.wizard.iframe = this.typeIfrmame;
    }

    //save the wizard in the pages
    this.childEvent.emit(this.wizard);

    //reset data
    this.wizard = new WizardModel();
    this.wizardData = new WizardData();
    this.wizardData.cromaPeriod = new Period();
    this.wizardData.matomoPeriod = new Period();
    this.weighing = JSON.parse(JSON.stringify(this.weighingTemp));
    this.newPlaceholPers = [];
    this.validateNewRule = false;
    this.stepPage = 0;
    this.pageAddBlock = new Pages();
  }

  /**
   * It deletes a rule from the table
   * @param ruleDelete - The rule to be deleted.
   */
  deleteRule(ruleDelete) {
    this.wizard.stepsData.forEach((rule) => {
      if (rule.rule['_id'] === ruleDelete.rule['_id']) {
        let found = this.wizard.stepsData.find(
          (x) => x.rule['_id'] === ruleDelete.rule['_id']
        );

        if (found) {
          let indexTable = this.wizard.stepsData.findIndex(
            (x) => x.rule['_id'] === found.rule['_id']
          );
          this.wizard.stepsData.splice(indexTable, 1);
          this.tableRules.reset();
        }
      }
    });
  }

  closeDialog() {
    this.childEvent.emit('');
    this.wizard = new WizardModel();
    this.wizardData = new WizardData();
    this.wizardData.cromaPeriod = new Period();
    this.wizardData.matomoPeriod = new Period();
    this.weighing = JSON.parse(JSON.stringify(this.weighingTemp));
    this.newPlaceholPers = [];
    this.validateNewRule = false;
    this.stepPage = 0;
    this.pageAddBlock = new Pages();
  }
}
