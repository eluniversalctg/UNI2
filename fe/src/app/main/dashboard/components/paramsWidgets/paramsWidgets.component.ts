import { Component } from '@angular/core';
import { ParamsWidgets } from 'src/app/shared/models';
import { ParamsWidgetsService } from 'src/app/shared/services';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-paramsWidgets',
  templateUrl: './paramsWidgets.component.html',
})
export class ParamsWidgetsComponent {
  paramsForm: FormGroup;
  params: ParamsWidgets[] = [];
  addNew: boolean = false;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private msg: MessageService,
    private paramsService: ParamsWidgetsService,
    private confirmationService: ConfirmationService
  ) {
    this.paramsForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      value: ['', Validators.required],
      parameter: ['', Validators.required],
    });

    this.getParams();
  }

  /**
   * get params from mongoDB
   */
  getParams() {
    this.paramsService.getList().subscribe({
      next: (data) => (this.params = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }

  /**
   * save and update the params
   */
  saveParameter() {
    if (this.paramsForm.value._id) {
      // update param
      this.paramsService.update(this.paramsForm.value).subscribe({
        next: () => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.resetParameter(),
          this.getParams()
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          }),
      });
    } else {
      let findName = this.params.find(
        (x) =>
          x.name.toUpperCase() ===
          this.paramsForm.controls.name.value.toUpperCase()
      );
      if (findName) {
        return this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.PARAMETEREXIST,
        });
      }

      // save param
      this.paramsService.add(this.paramsForm.value).subscribe({
        next: () => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.resetParameter(),
          this.getParams()
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
   * load param into deopdown
   * @param value param
   */
  editParameter(value: ParamsWidgets) {
    this.paramsForm.controls._id.setValue(value._id);
    this.paramsForm.controls.name.setValue(value.name);
    this.paramsForm.controls.parameter.setValue(value.parameter);
    this.paramsForm.controls.value.setValue(value.value);

    this.addNew = true;
    this.isEditing = true;
  }

  /**
   * delete param selected
   * @param value param
   */
  deleteParameter(value: ParamsWidgets) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el parámetro?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        this.paramsService.delete(value._id || '').subscribe({
          next: () => (
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.DELETESUCCESS,
            }),
            this.getParams()
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
  createParameter() {
    this.resetParameter();
    this.addNew = true;
    this.isEditing = false;
  }

  /**
   * reset dialog information
   */
  resetParameter() {
    this.addNew = false;
    this.paramsForm.reset();
  }
}
