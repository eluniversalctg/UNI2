import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParamsWidgets, Widgets } from 'src/app/shared/models';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParamsWidgetsService, UtilitiesService, WidgetsService } from 'src/app/shared/services';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
})
export class WidgetsComponent {
  testURL: string; //string to test the widget
  newWidgetURL: string;
  widgetsForm: FormGroup;
  paramSelected: ParamsWidgets = new ParamsWidgets();
  parameters: ParamsWidgets[] = [];
  paramsSelected: ParamsWidgets[] = [];
  trying: boolean = false;
  widgets: Widgets[] = [];
  addNew: boolean = false;
  url: string = "";
  auth_token: string = "";

  constructor(
    private fb: FormBuilder,
    private msg: MessageService,
    private utilities: UtilitiesService,
    private widgetsService: WidgetsService,
    private paramService: ParamsWidgetsService,
    private confirmationService: ConfirmationService
  ) {
    //get saved widget parameters
    this.paramService.getList().subscribe({
      next: (data) => (this.parameters = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });

    // create form
    this.widgetsForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      description: ['', Validators.required],
      url: ['', Validators.required],
    });

    // get widgets saved
    this.getWidgets();
  }

  /**
   *  add new param to the table in the pop up
   */
  addParam() {
    this.paramsSelected = [...this.paramsSelected, this.paramSelected];
    this.paramSelected = new ParamsWidgets();
  }

  /**
   * delete param selected from table
   * @param index
   */
  deleteParam(index) {
    this.paramsSelected.splice(index, 1);
  }

  /**
   * get widgets from mongoDB
   */
  getWidgets() {
    this.widgetsService.getList().subscribe({
      next: (data) => (this.widgets = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }

  /**
   * save and update the widgets
   */
  saveWidget() {
    this.tryWidget();
    this.widgetsForm.controls.url.setValue(this.newWidgetURL);
    if (this.widgetsForm.value._id) {
      // update widget
      this.widgetsService.update(this.widgetsForm.value).subscribe({
        next: () => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.resetWidget(),
          this.getWidgets()
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          }),
      });
    } else {
      // save widgets
      this.widgetsService.add(this.widgetsForm.value).subscribe({
        next: () => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.resetWidget(),
          this.getWidgets()
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
   * load widget into deopdown
   * @param value Widget
   */
  editWidget(value: Widgets) {
    let paramsSelected: ParamsWidgets[] = [];
    let parameters: string = value.url.split('?')[1];
    let allParameters: string[] = parameters.split('&');

    // load parameters from value.url
    allParameters.forEach((param) => {
      let newParam = param.split('=');

      if (newParam[0] !== 'token_auth') {
        // find name of parameter
        let findName = this.parameters.find(
          (x) => x.parameter === newParam[0] && x.value === newParam[1]
        );

        let parameter: ParamsWidgets = {
          name: findName ? findName.name : '',
          parameter: newParam[0],
          value: newParam[1],
        };

        paramsSelected = [...paramsSelected, parameter];
      }
    });

    this.widgetsForm.controls._id.setValue(value._id);
    this.widgetsForm.controls.url.setValue(value.url);
    this.widgetsForm.controls.name.setValue(value.name);
    this.widgetsForm.controls.description.setValue(value.description);
    this.paramsSelected = [...paramsSelected];
    this.addNew = true;
  }

  /**
   * delete widget selected
   * @param value widget
   */
  deleteWidget(value: Widgets) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el widget?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        this.widgetsService.delete(value._id || '').subscribe({
          next: () => (
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.DELETESUCCESS,
            }),
            this.getWidgets()
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
   * open dialog to add  or edit
   */
  createWidget() {
    this.resetWidget();
    this.paramsSelected = [];
    this.addNew = true;
  }

  /**
   * reset dialog information
   */
  resetWidget() {
    this.paramsSelected = [];
    this.testURL = '';
    this.newWidgetURL = '';
    this.addNew = false;
    this.trying = false;
    this.widgetsForm.reset();
  }

  /**
   * concat the params with token and matomo url
   */
  tryWidget() {
    let URL = 'index.php?';
    this.paramsSelected.forEach((param) => {
      URL = URL.concat(param.parameter)
        .concat('=')
        .concat(param.value)
        .concat('&');
    });
    this.testURL = `${
      this.url.charAt(this.url.length - 1) === '/' ? this.url : this.url + '/'
    }${URL}token_auth=${this.auth_token}`;
    this.newWidgetURL = URL;
  }
}
