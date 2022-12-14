import * as _ from 'lodash';
import {
  Pages,
  ParentCondition,
  Personalization,
  TemplatePersonalization,
} from 'src/app/shared/models';
import { forkJoin } from 'rxjs';
import {
  RuleService,
  PagesService,
  BlockService,
  VariableService,
  TemplateService,
  ConditionsService,
  PersonalizationService,
  TemplatePersonalizationService,
} from 'src/app/shared/services';
import { Component, ViewChild } from '@angular/core';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personalization',
  templateUrl: './personalization.component.html',
  styleUrls: ['./personalization.component.scss'],
})
export class PersonalizationComponent {
  templates: TemplatePersonalization[] = [];
  personalizations: Personalization[] = [];
  personalizationsDataSource: Personalization[] = [];
  personalizationUpdate: Personalization;
  isEditing: boolean = false;
  addNew: boolean = false;
  personalizationForm: FormGroup;
  options: any[];
  optionsSelected: boolean = true;
  submited: boolean = false;

  conditionSchema: ParentCondition[] = [];
  unomiConditions: any[] = [];
  conditionVariables: any[] = [];
  variables: any[] = [];
  operators: any[] = [];
  response: object = {};

  pages: Pages[];

  @ViewChild('dt') dt;

  constructor(
    private msg: MessageService,
    private ruleSrv: RuleService,
    private pagesService: PagesService,
    private blockService: BlockService,
    private conditionSrv: ConditionsService,
    private variableService: VariableService,
    private confirmationService: ConfirmationService,
    private personalizationService: PersonalizationService,
    private templatesRecomendationService: TemplateService,
    private templatesPersonalizationService: TemplatePersonalizationService
  ) {
    this.getAllTemplates();
    this.getAllScriptPersonalization();
    this.getAllPages();

    this.personalizationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      template: new FormControl('', [Validators.required]),
    });

    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];

    const operatorReq = this.ruleSrv.getOperators();
    const conditiosReq = this.conditionSrv.getList();
    const variablesReq = this.variableService.getList();

    forkJoin([variablesReq, conditiosReq]).subscribe({
      next: (response) => (
        (this.operators = operatorReq),
        (this.unomiConditions = response[1]),
        (this.conditionVariables = response[0].sort((a, b) =>
          a.id.toUpperCase() > b.id.toUpperCase() ? 1 : -1
        )),
        (this.variables = [...this.conditionVariables])
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.NODATAERROR,
        }),
    });
  }

  getAllPages() {
    this.pagesService.getList().subscribe(
      (response) => {
        this.pages = response;
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  getAllTemplates() {
    let templatesPersonaReq = this.templatesPersonalizationService.getList();
    let templatesRecomeReq = this.templatesRecomendationService.getList();

    forkJoin([templatesPersonaReq, templatesRecomeReq]).subscribe({
      next: (response) => (
        response[0].forEach((data) => {
          if (data.state) {
            this.templates.push(data);
          }
        }),
        response[1].forEach((data) => {
          if (data.state) {
            this.templates.push(data);
          }
        })
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.NODATAERROR,
        }),
    });
  }

  getAllScriptPersonalization() {
    this.personalizationService.getList().subscribe({
      next: (response) => {
        this.personalizations = response;
        this.filterDataSource();
      },
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }
  filterDataSource() {
    this.dt.reset();
    this.personalizationsDataSource = this.personalizations.filter(
      (x) => x.isActive === this.optionsSelected
    );
  }

  verifyCondition() {
    this.conditionSrv.reloadCondition();
    if (this.conditionSchema.length > 0) {
      this.conditionSrv.verifyCondition();
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.EERORCONDITION,
      });
    }
  }

  register() {
    // send event to sharedContions to reload the list
    this.conditionSrv.reloadCondition();
    let valid = true;

    let control = this.personalizationForm.controls;

    //find template for id
    control.template.setValue(
      this.templates.find((x) => x._id === control.template.value)
    );

    this.conditionSchema.forEach((condition) => {
      if (!condition.operatorCondition && !condition.selectedValue) {
        valid = false;
      }
    });
    if (valid) {
      //create object personalization
      let personalization: Personalization = {
        name: control.name.value,
        template: control.template.value,
        condition: JSON.stringify(this.conditionSchema),
      };

      let temp: any[] = [];

      // condition
      let newCondion = this.conditionSrv.createBooleanConditionObj(
        this.conditionSchema
      );
      temp.push(newCondion);

      if (!this.isEditing) {
        this.save(personalization);
      } else {
        this.update(personalization);
      }
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORDATA,
      });
    }
  }

  save(personalization: Personalization) {
    let found;
    if (this.personalizations) {
      found = this.personalizations.find(
        (x) => x.name === personalization.name
      );
    }
    if (!found) {
      this.personalizationService.add(personalization).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.INSERTSUCCESS,
            });
            this.updateTemplates(personalization);
            personalization = new Personalization();
            this.reset();
            this.getAllScriptPersonalization();
            this.addNew = false;
          } else {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.INSERTERROR,
            });
          }
        },
        () => {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          });
        }
      );
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.RULEEXIST,
      });
    }
  }

  /**
   * description: update personalization selected
   * @param personalization - the personalization selected
   */
  update(personalization: Personalization) {
    personalization._id = this.personalizationUpdate._id;
    let found = this.personalizations.find(
      (x) => x.name === personalization.name
    );
    if (!found || found.name === this.personalizationUpdate.name) {
      this.personalizationService.update(personalization).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            });
            this.updateTemplates(personalization);
            this.updatePage(personalization);
            personalization = new Personalization();
            this.reset();
            this.addNew = false;
            this.getAllScriptPersonalization();
            this.addNew = false;
          } else {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.INSERTERROR,
            });
          }
        },
        () => {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          });
        }
      );
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.EXIST,
      });
    }
  }

  updateTemplates(personalization) {
    personalization.template['inUse'] = true;
    if (personalization.template.typeTemplate === MessagesTst.PERSONALIZATION) {
      this.templatesPersonalizationService
        .update(personalization.template)
        .subscribe({
          next: () =>
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            }),
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.UPDATEERROR,
            }),
        });
    } else {
      this.templatesRecomendationService
        .update(personalization.template)
        .subscribe({
          next: () =>
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            }),
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.UPDATEERROR,
            }),
        });
    }
  }

  changeState(personalization: Personalization) {
    let message = `¿Está seguro que desea ${
      personalization.isActive ? 'inactivar' : 'activar'
    } la regla de personalización <b>
      ${personalization.name}
      </b>? <br/>El personalization seleccionado quedará ${
        personalization.isActive ? 'sin' : 'con'
      } función en la plataforma.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        let update = new Personalization();

        update._id = personalization._id;
        update.isActive = !personalization.isActive;

        this.personalizationService.update(update).subscribe(
          () => {
            if (personalization.isActive) {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PERSONALIZATIONINACTIVATED,
              });
            } else {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PERSONALIZATIONACTIVATED,
              });
            }
            this.getAllScriptPersonalization();
          },
          () => {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.CHANGESTATE,
            });
          }
        );
      },
    });
  }

  reset() {
    this.personalizationForm.reset();
    this.conditionSchema = [];
    this.response = {};
  }

  createPersonalization() {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.personalizationUpdate = new Personalization();
  }

  openUpdatePersonalization(
    personalization: Personalization,
    isEditing: boolean
  ) {
    this.reset();
    this.addNew = true;
    this.isEditing = isEditing;
    this.personalizationUpdate = personalization;

    this.personalizationForm.patchValue({
      name: personalization.name,
      template: personalization.template._id,
    });
    this.conditionSchema = JSON.parse(personalization.condition);
  }

  /**
   *  gets the values of the selected conditions
   * @param val conditions as string
   */
  emmit(val) {
    this.conditionSchema = JSON.parse(val);
  }

  updatePage(ruleEdit) {
    let pageEdit: any[] = [];
    this.pages.forEach((page) => {
      if (page.wizardModel) {
        page.wizardModel.forEach((wizard) => {
          if (wizard.stepsData) {
            wizard.stepsData.forEach((step) => {
              if (step.rule) {
                if (step.rule['_id'] === ruleEdit._id) {
                  step.rule = ruleEdit;
                  pageEdit.push(page);
                }
              }
            });
          }
        });
      }
    });
    if (pageEdit.length > 0) {
      this.blockService.updateMany(pageEdit, 'updateMany').subscribe(
        () => {
          this.getAllPages();
        },
        () => {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.UPDATEERROR,
          });
        }
      );
    }
  }
}
