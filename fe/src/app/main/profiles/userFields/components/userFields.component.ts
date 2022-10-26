import * as _ from 'lodash';
import { Component } from '@angular/core';
import { MessagesTst } from 'src/app/shared/enums';
import { UserFields } from 'src/app/shared/models';
import { UserFieldsService } from 'src/app/shared/services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-userFields',
  templateUrl: './userFields.component.html',
  styles: [
    `
      .disabled {
        pointer-events: none;

        opacity: 0.5;
      }
    `,
  ],
})
export class UserFieldsComponent {
  userFields: any[] = [];
  userFieldsDataSource: any[] = [];
  groupData: any[] = [];
  userFieldsForm: FormGroup;
  addNew: boolean = false;
  isEditing: boolean = false;
  submitted: boolean = false;
  typeOfData: string[] = ['boolean', 'email', 'date', 'number', 'string'];
  optionsSelected: boolean = true;
  options: any[];
  constructor(
    private msg: MessageService,
    private userFSrv: UserFieldsService,
    private confirmationService: ConfirmationService
  ) {
    this.getData(); // get all user fields

    this.userFieldsForm = new FormGroup({
      _id: new FormControl('', []),
      name: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      isRequired: new FormControl('', [Validators.required]),
      canModify: new FormControl('', [Validators.required]),
      massiveEdition: new FormControl('', [Validators.required]),
    });
    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];
  }

  /**
   *   get all user fields
   */
  getData() {
    this.userFSrv.getList().subscribe({
      next: (data) => ((this.userFields = data), this.filterDataSource()),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }

  filterDataSource() {
    this.userFieldsDataSource = this.userFields.filter(
      (x) => x.isActive === this.optionsSelected
    );
  }

  /**
   * open dialog of user fields and reset form
   */
  create() {
    this.getGroups();
    this.userFieldsForm.reset();
    this.userFieldsForm.controls.isRequired.setValue(false);
    this.userFieldsForm.controls.canModify.setValue(false);
    this.userFieldsForm.controls.massiveEdition.setValue(false);
    this.addNew = true;
    this.isEditing = false;
  }

  /**
   * get all groups
   * the method avoids saving in the DB
   */
  getGroups() {
    let groups = _.uniqBy(this.userFields, 'group');
    this.groupData = groups.map((x) => {
      return { name: x.group };
    });
  }

  /**
   * edit user field
   * @param userField - user field to edit
   */
  editField(field: UserFields) {
    this.getGroups();
    const controls = this.userFieldsForm.controls;
    controls._id.setValue(field._id);
    controls.name.setValue(field.name);
    controls.type.setValue(field.type);
    controls.isRequired.setValue(field.isRequired);
    controls.canModify.setValue(field.canModify);
    controls.group.setValue(field.group);
    controls.massiveEdition.setValue(field.massiveEdition);
    this.isEditing = true;
    this.addNew = true;
  }

  /**
   * create new user field
   */
  register() {
    this.submitted = true;
    const controls = this.userFieldsForm.controls;
    let newUserField = new UserFields();

    newUserField.name = controls.name.value;
    newUserField.type = controls.type.value;
    newUserField.isRequired = controls.isRequired.value;
    newUserField.canModify = controls.canModify.value;
    newUserField.group = controls.group.value;
    newUserField.massiveEdition = controls.massiveEdition.value;

    if (this.isEditing) {
      newUserField._id = controls._id.value;

      this.userFSrv.update(newUserField).subscribe({
        next: () => (
          this.getData(),
          (this.submitted = false),
          (this.addNew = false),
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.UPDATESUCCESS,
          })
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.UPDATEERROR,
          }),
      });
    } else {
      let find = this.userFields.find((x) => x.name === newUserField.name);
      if (find) {
        return this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.EXIST,
        });
      }
      this.userFSrv.add(newUserField).subscribe({
        next: () => (
          this.getData(),
          (this.addNew = false),
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.SAVESUCCESS,
          })
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.SAVEERROR,
          }),
      });
    }
  }
  /**
   * delete user field
   * @param id - id of user field
   */
  changeState(userField: UserFields) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${
        userField.isActive ? 'inactivar' : 'activar'
      } el campo de usuario <b>
        ${userField.name}
        </b>? <br/>El campo seleccionado quedará ${
          userField.isActive ? 'sin' : 'con'
        } función en la plataforma.`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        let update = new UserFields();
        update._id = userField._id;
        update.isActive = !userField.isActive;
        this.userFSrv.update(update).subscribe({
          next: () => (
            this.getData(),
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.SUCCESSTATE,
            })
          ),
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.CHANGESTATE,
            }),
        });
      },
    });
  }
}
