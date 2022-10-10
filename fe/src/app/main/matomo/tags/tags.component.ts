import moment from 'moment';
import { Component } from '@angular/core';
import { MatomoTags } from 'src/app/shared/models';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatomoService, UtilitiesService } from 'src/app/shared/services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
})
export class TagsComponent {
  tagsForm: FormGroup;
  response: object = {};
  tags: MatomoTags[] = [];
  addNew: boolean = false;
  typeClasification: any[];
  typeParams: any[];
  matomoResponse: any[] = [];
  columnSelected: string[] = [];

  optionValuesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private msg: MessageService,
    private matomoSrv: MatomoService,
    private utilities: UtilitiesService,
    private confirmationService: ConfirmationService
  ) {
    this.optionValuesForm = this.fb.group({
      optionValues: this.fb.array([]),
    });

    this.tagsForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      description: ['', Validators.required],
      module: ['', Validators.required],
      tag: ['', Validators.required],
      customParameters: [''],
    });
    this.getTags();
    this.getAllTypesParams();
  }

  /**
   * get saved matomo tags
   */
  getTags() {
    this.matomoSrv.getList().subscribe({
      next: (data) => (this.tags = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }

  /**
   * It adds a new value to the values array
   * @param [loadValue] - The value to load into the new value.
   */
  addValue(loadValue?) {
    this.values().push(this.newValue(loadValue));
  }

  /**
   * It removes the value at the given index from the array
   * @param {number} i - The index of the value to remove.
   */
  removeValue(i: number) {
    this.values().removeAt(i);
  }

  /**
   * It returns the FormArray of option values
   * @returns The FormArray of option values.
   */
  values(): FormArray {
    return this.optionValuesForm.get('optionValues') as FormArray;
  }

  /**
   * It resets the form and removes all the values from the form
   */
  resetParams() {
    this.optionValuesForm.reset();
    if (this.optionValuesForm.value.optionValues.length > 0) {
      for (
        let i = this.optionValuesForm.value.optionValues.length - 1;
        i >= 0;
        i--
      ) {
        this.values().removeAt(i);
      }
    }
  }

  /**
   * If the loadValue parameter is passed in, then the parameter and value properties of the FormGroup
   * will be set to the parameter and value properties of the loadValue object. If the loadValue
   * parameter is not passed in, then the parameter and value properties of the FormGroup will be set
   * to an empty string
   * @param [loadValue] - This is the value that is passed in from the parent component.
   * @returns A FormGroup
   */
  newValue(loadValue?): FormGroup {
    return this.fb.group({
      parameter: loadValue ? loadValue.parameter : '',
      value: loadValue ? loadValue.value : '$$valor$$',
    });
  }

  /**
   * open dialog create tag
   */
  createTag() {
    this.response = [];
    this.tagsForm.reset();
    this.matomoResponse = [];
    this.columnSelected = [];
    this.addNew = true;
    this.resetParams();
  }

  /**
   * reset dialog create tag
   */
  resetTag() {
    this.tagsForm.reset();
    this.addNew = false;
    this.response = {};
  }

  /**
   * save matomo tags on mongoDB
   */
  saveTag() {
    this.tagsForm.value.columns = this.columnSelected;
    this.tagsForm.value.customParameters =
      this.optionValuesForm.controls.optionValues.value;
    if (this.tagsForm.value._id) {
      this.matomoSrv.update(this.tagsForm.value).subscribe({
        next: () => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.resetTag(),
          this.getTags()
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          }),
      });
    } else {
      this.matomoSrv.add(this.tagsForm.value).subscribe({
        next: () => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.resetTag(),
          this.getTags()
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          }),
      });
    }
  }

  /**
   * It takes a tag object, sets the form values to the tag object values, and then tries the tag
   * @param tag - The tag object that is being edited.
   */
  async editTag(tag) {
    this.resetParams();
    this.tagsForm.controls._id.setValue(tag._id);
    this.tagsForm.controls.name.setValue(tag.name);
    this.tagsForm.controls.description.setValue(tag.description);
    this.tagsForm.controls.module.setValue(tag.module);
    this.getAllParams({ value: tag.module });
    this.tagsForm.controls.tag.setValue(tag.tag);
    tag.customParameters.forEach((param) => {
      this.addValue(param);
    });

    this.columnSelected = tag.columns;
    this.addNew = await this.tryTag();
  }

  /**
   * delete selected matomo tag
   * @param tag object (get _id)
   */
  deleteTag(tag) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el tag?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        this.matomoSrv.delete(tag._id).subscribe({
          next: () => (
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.DELETESUCCESS,
            }),
            this.getTags()
          ),
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.DELETEERROR,
            }),
        });
      },
    });
  }

  /**
   * create path and get from matomo server
   */

  tryTag() {
    const site = this.utilities.decryptSite();
    if (!site) {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.NOSITE,
      });
      return false; 
    }
    const date = moment().format('YYYY-MM-DD');
    const params = `method=${this.tagsForm.value.module}.${
      this.tagsForm.value.tag
      }&idSite=1&period=year&date=${date}&${this.setCustomParams()}/${encodeURIComponent(site.matomoUrl)}/${site.idSite}`;

    this.matomoSrv.getByUrl('tags', params).subscribe({
      next: (data) => ((this.response = data), this.formatColumns(data)),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERROREJECTION,
        }),
    });
    return true;
  }

  setCustomParams() {
    let params = '';
    const optionsValues = this.optionValuesForm.controls.optionValues.value;
    optionsValues.forEach((option) => {
      params += `${option.parameter}=${option.value}&`;
    });
    return params;
  }

  /**
   *
   * @param matomoResponseColumns
   * @returns columns formatted
   */
  formatColumns(obj) {
    const keys = Array.isArray(obj)
      ? Object.keys(obj.length > 0 ? obj[0] : [])
      : Object.keys(obj);
    let columns: any[] = [];
    keys.forEach((keys) => {
      let column = {
        header: keys,
        field: keys,
      };
      columns = [...columns, column];
    });
    this.matomoResponse = columns;
  }

  /**
   * check if response has data
   * @returns boolean
   */

  isEmpty(obj) {
    if (Object.keys(obj).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * get all modules
   */
  getAllTypesParams() {
    this.typeClasification = this.matomoSrv.getAllModules();
  }

  /**
   * tags filter
   * @param event
   */
  getAllParams(event) {
    switch (event.value) {
      case 'API': {
        this.typeParams = this.matomoSrv.getModuleAPi();
        break;
      }
      case 'Bandwidth': {
        this.typeParams = this.matomoSrv.getModuleBandwidth();
        break;
      }
      case 'Actions': {
        this.typeParams = this.matomoSrv.getModuleActions();
        break;
      }
      case 'Contents': {
        this.typeParams = this.matomoSrv.getModuleContents();
        break;
      }
      case 'CoreAdminHome': {
        this.typeParams = this.matomoSrv.getModuleCoreAdminHome();
        break;
      }
      case 'CustomAlerts': {
        this.typeParams = this.matomoSrv.getModuleCustomAlerts();
        break;
      }
      case 'CustomDimensions': {
        this.typeParams = this.matomoSrv.getModuleCustomDimensions();
        break;
      }
      case 'CustomJsTracker': {
        this.typeParams = this.matomoSrv.getModuleCustomJsTracker();
        break;
      }
      case 'CustomVariables': {
        this.typeParams = this.matomoSrv.getModuleCustomVariables();
        break;
      }
      case 'DBStats': {
        this.typeParams = this.matomoSrv.getModuleDBStats();
        break;
      }
      case 'Dashboard': {
        this.typeParams = this.matomoSrv.getModuleDashboard();
        break;
      }
      case 'DevicePlugins': {
        this.typeParams = this.matomoSrv.getModuleDevicePlugins();
        break;
      }
      case 'DevicesDetection': {
        this.typeParams = this.matomoSrv.getModuleDevicesDetection();
        break;
      }
      case 'Events': {
        this.typeParams = this.matomoSrv.getModuleEvents();
        break;
      }
      case 'ExampleAPI': {
        this.typeParams = this.matomoSrv.getModuleExampleAPI();
        break;
      }
      case 'ExamplePlugin': {
        this.typeParams = this.matomoSrv.getModuleExamplePlugin();
        break;
      }
      case 'ExampleReport': {
        this.typeParams = this.matomoSrv.getModuleExampleReport();
        break;
      }
      case 'ExampleUI': {
        this.typeParams = this.matomoSrv.getModuleExampleUI();
        break;
      }
      case 'Feedback': {
        this.typeParams = this.matomoSrv.getModuleFeedback();
        break;
      }
      case 'Goals': {
        this.typeParams = this.matomoSrv.getModuleGoals();
        break;
      }
      case 'ImageGraph': {
        this.typeParams = this.matomoSrv.getModuleImageGraph();
        break;
      }
      case 'Insights': {
        this.typeParams = this.matomoSrv.getModuleInsights();
        break;
      }
      case 'LanguagesManager': {
        this.typeParams = this.matomoSrv.getModuleLanguagesManager();
        break;
      }
      case 'Live': {
        this.typeParams = this.matomoSrv.getModuleLive();
        break;
      }
      case 'LogViewer': {
        this.typeParams = this.matomoSrv.getModuleLogViewer();
        break;
      }
      case 'LoginLdap': {
        this.typeParams = this.matomoSrv.getModuleLoginLdap();
        break;
      }
      case 'Login': {
        this.typeParams = this.matomoSrv.getModuleLogin();
        break;
      }
      case 'MarketingCampaignsReporting': {
        this.typeParams = this.matomoSrv.getModuleMarketingCampaignsReporting();
        break;
      }
      case 'Marketplace': {
        this.typeParams = this.matomoSrv.getModuleMarketplace();
        break;
      }
      case 'MobileMessaging': {
        this.typeParams = this.matomoSrv.getModuleMobileMessaging();
        break;
      }
      case 'MultiSites': {
        this.typeParams = this.matomoSrv.getModuleMultiSites();
        break;
      }
      case 'Overlay': {
        this.typeParams = this.matomoSrv.getModuleOverlay();
        break;
      }
      case 'PagePerformance': {
        this.typeParams = this.matomoSrv.getModulePagePerformance();
        break;
      }
      case 'PrivacyManager': {
        this.typeParams = this.matomoSrv.getModulePrivacyManager();
        break;
      }
      case 'Provider': {
        this.typeParams = this.matomoSrv.getModuleProvider();
        break;
      }
      case 'Referrers': {
        this.typeParams = this.matomoSrv.getModuleReferrers();
        break;
      }
      case 'SEO': {
        this.typeParams = this.matomoSrv.getModuleSEO();
        break;
      }
      case 'ScheduledReports': {
        this.typeParams = this.matomoSrv.getModuleScheduledReports();
        break;
      }
      case 'SegmentEditor': {
        this.typeParams = this.matomoSrv.getModuleSegmentEditor();
        break;
      }
      case 'SitesManager': {
        this.typeParams = this.matomoSrv.getModuleSitesManager();
        break;
      }
      case 'TagManager': {
        this.typeParams = this.matomoSrv.getModuleTagManager();
        break;
      }
      case 'Tour': {
        this.typeParams = this.matomoSrv.getModuleTour();
        break;
      }
      case 'Transitions': {
        this.typeParams = this.matomoSrv.getModuleTransitions();
        break;
      }
      case 'TreemapVisualization': {
        this.typeParams = this.matomoSrv.getModuleTreemapVisualization();
        break;
      }
      case 'TwoFactorAuth': {
        this.typeParams = this.matomoSrv.getModuleTwoFactorAuth();
        break;
      }
      case 'UserCountry': {
        this.typeParams = this.matomoSrv.getModuleUserCountry();
        break;
      }
      case 'UserId': {
        this.typeParams = this.matomoSrv.getModuleUserId();
        break;
      }
      case 'UserLanguage': {
        this.typeParams = this.matomoSrv.getModuleUserLanguage();
        break;
      }
      case 'UsersManager': {
        this.typeParams = this.matomoSrv.getModuleUsersManager();
        break;
      }
      case 'VisitFrequency': {
        this.typeParams = this.matomoSrv.getModuleVisitFrequency();
        break;
      }
      case 'VisitTime': {
        this.typeParams = this.matomoSrv.getModuleVisitTime();
        break;
      }
      case 'VisitorInterest': {
        this.typeParams = this.matomoSrv.getModuleVisitorInterest();
        break;
      }
      case 'VisitsSummary': {
        this.typeParams = this.matomoSrv.getModuleVisitsSummary();
        break;
      }
    }
  }
}
