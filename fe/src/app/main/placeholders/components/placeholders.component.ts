import { Component } from '@angular/core';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Placeholders } from 'src/app/shared/models/placeholders.model';
import { PlaceholdersService } from 'src/app/shared/services/placeholders.service';
@Component({
  selector: 'app-placeholders',
  templateUrl: './placeholders.component.html',
  styleUrls: ['./placeholders.component.scss'],
})
export class PlaceholdersComponent {
  placeholders: Placeholders[];
  placeholdersDataSource: Placeholders[];
  addNew: boolean = false;
  placeholdersUpdate: Placeholders;
  isEditing: boolean = false;
  placeholdersForm: FormGroup;
  optionsSelected: boolean = true;
  options: any[];
  constructor(
    private msg: MessageService,
    private placeholdersService: PlaceholdersService,
    private confirmationService: ConfirmationService
  ) {
    this.getAlPlaceholders();

    this.placeholdersForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      typesMetaData: new FormControl('', []),
      required: new FormControl('', []),
      valueDefault: new FormControl('', []),
    });

    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];
  }

  /**
   * description: open the modal to update placeholder
   * @param placeholder - the placeholder selected
   */
  openUpdatePlaceholders(placeholder: Placeholders) {
    this.reset();
    this.addNew = true;
    this.isEditing = true;
    this.placeholdersUpdate = placeholder;

    this.placeholdersForm.patchValue({
      name: placeholder.name,
      type: placeholder.type,
      typesMetaData: placeholder.typesMetaData,
      required: placeholder.required,
      valueDefault: placeholder.valueDefault,
    });
  }

  duplicatePlaceholder(placeholder: Placeholders) {
    this.reset();
    this.addNew = true;
    this.isEditing = false;

    this.placeholdersForm.patchValue({
      name: '',
      type: placeholder.type,
      typesMetaData: placeholder.typesMetaData,
      required: placeholder.required,
      valueDefault: placeholder.valueDefault,
    });
  }

  /**
   * description: open modal with form placeholders
   */
  createPlaceholders() {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.placeholdersUpdate = new Placeholders();
  }

  /**
   * description: send request to backend, save a new placeholder
   */
  register() {
    let control = this.placeholdersForm.controls;

    if (control.type.value === MessagesTst.SYSTEM && control.required.value) {
      control.valueDefault.setValue(null);
    }

    let placeholder: Placeholders = {
      name: control.name.value,
      type: control.type.value,
      typesMetaData: control.typesMetaData.value,
      required: control.required.value,
      valueDefault: control.valueDefault.value,
    };

    if (!this.isEditing) {
      this.save(placeholder);
    } else {
      this.update(placeholder);
    }
  }

  /**
   * description: reset form
   */
  reset() {
    this.placeholdersForm.reset();
  }

  /**
   * description: get all placeholders
   */
  getAlPlaceholders() {
    this.placeholdersService.getList().subscribe(
      (response) => {
        this.placeholders = response;
        this.filterDataSource();
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  filterDataSource() {
    this.placeholdersDataSource = this.placeholders.filter((x)=> x.isActive === this.optionsSelected)
  }

  changeState(placeholder: Placeholders) {
    let message = `¿Está seguro que desea ${
      placeholder.isActive ? 'inactivar' : 'activar'
    } el placeholder <b>
      ${placeholder.name}
      </b>? <br/>El placeholder seleccionado quedará ${
        placeholder.isActive ? 'sin' : 'con'
      } función en la plataforma.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        let update = new Placeholders();

        update._id = placeholder._id;
        update.isActive = !placeholder.isActive;

        this.placeholdersService.update(update).subscribe(
          (data) => {
            if (placeholder.isActive) {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PLACEHOLDERINACTIVATED,
              });
            } else {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PLACEHOLDERACTIVATED,
              });
            }
            this.getAlPlaceholders();
          },
          (error) => {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.CHANGESTATE,
            });
          }
        );
      },
    });
  }

  /**
   * description: save new placeholder
   * @param placeholder - the placeholder
   */
  save(placeholder: Placeholders) {
    let found;
    if (this.placeholders) {
      found = this.placeholders.find((x) => x.name === placeholder.name);
    }
    if (!found) {
      this.placeholdersService.add(placeholder).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.INSERTSUCCESS,
            });
            placeholder = new Placeholders();
            this.reset();
            this.getAlPlaceholders();
            this.addNew = false;
          } else {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.INSERTERROR,
            });
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
        summary: MessagesTst.EXIST,
      });
    }
  }

  /**
   * description: update placeholder selected
   * @param placeholder - the placeholder selected
   */
  update(placeholder: Placeholders) {
    placeholder._id = this.placeholdersUpdate._id;
    let found = this.placeholders.find((x) => x.name === placeholder.name);
    if (!found || found.name === this.placeholdersUpdate.name) {
      this.placeholdersService.update(placeholder).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            });
            placeholder = new Placeholders();
            this.reset();
            this.addNew = false;
            this.getAlPlaceholders();
            this.addNew = false;
          } else {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.INSERTERROR,
            });
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
        summary: MessagesTst.EXIST,
      });
    }
  }

  validators() {
    let control = this.placeholdersForm.controls;

    if (control.type.value === 'Estándar') {
      this.placeholdersForm.controls.valueDefault.setValidators([
        Validators.required,
      ]);
      this.placeholdersForm.controls.valueDefault.updateValueAndValidity();

      this.placeholdersForm.controls.required.setValidators([]);
      this.placeholdersForm.controls.required.updateValueAndValidity();

      this.placeholdersForm.controls.typesMetaData.setValidators([]);
      this.placeholdersForm.controls.typesMetaData.updateValueAndValidity();
    } else {
      this.placeholdersForm.controls.required.setValidators([
        Validators.required,
      ]);
      this.placeholdersForm.controls.required.updateValueAndValidity();

      this.placeholdersForm.controls.typesMetaData.setValidators([
        Validators.required,
      ]);
      this.placeholdersForm.controls.typesMetaData.updateValueAndValidity();

      if (control.required.value === false) {
        this.placeholdersForm.controls.valueDefault.setValidators([
          Validators.required,
        ]);

        this.placeholdersForm.controls.valueDefault.updateValueAndValidity();
      } else {
        this.placeholdersForm.controls.valueDefault.setValidators([]);

        this.placeholdersForm.controls.valueDefault.updateValueAndValidity();
      }
    }
  }
}
