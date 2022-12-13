import {
  PropertiesUnomiService,
  PlaceholderUnomiService,
  UserFieldsService,
} from 'src/app/shared/services';
import { Component, ViewChild } from '@angular/core';
import { MessagesTst, html } from 'src/app/shared/enums';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertiesUnomi, PlaceholderUnomi } from 'src/app/shared/models';
@Component({
  selector: 'app-placeholderUnomi',
  templateUrl: './placeholderUnomi.component.html',
  styleUrls: ['./placeholderUnomi.component.scss'],
})
export class PlaceholderUnomiComponent {
  propertiesUnomi: PropertiesUnomi[];
  placeholders: PlaceholderUnomi[];
  placeholdersDataSource: PlaceholderUnomi[];
  placeholdersUpdate: PlaceholderUnomi;
  isEditing: boolean = false;
  addNew: boolean = false;
  placeholdersForm: FormGroup;
  optionsSelected: boolean = true;
  options: any[];
  unomi: any[];
  isSystem: boolean = false;
  unomiFields: any[] = [];

  @ViewChild('dt') dt;

  constructor(
    private msg: MessageService,
    private userFieldSrv: UserFieldsService,
    private confirmationService: ConfirmationService,
    private propertiesUnomiService: PropertiesUnomiService,
    private placeholderUnomiService: PlaceholderUnomiService
  ) {
    this.getAlPlaceholders();
    this.getAllProperties();
    this.unomiFields = this.userFieldSrv.exportUnomiFields();
    this.userFieldSrv.getList().subscribe({
      next: (data) => (
        (this.unomiFields = [...data, ...this.unomiFields]),
        (this.unomiFields = this.unomiFields.map((item) => {
          return { name: item.name, value: `profile.properties.${item.name}` };
        }))
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });

    this.placeholdersForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      valueDefault: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
    });

    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];
  }

  getAllProperties() {
    this.propertiesUnomiService.getList().subscribe(
      (response) => {
        this.propertiesUnomi = response;
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  /**
   * description: open the modal to update placeholder
   * @param placeholder - the placeholder selected
   */
  openUpdatePlaceholders(placeholder: PlaceholderUnomi) {
    this.reset();
    this.addNew = true;
    this.isEditing = true;
    this.placeholdersUpdate = placeholder;

    this.placeholdersForm.patchValue({
      name: placeholder.name,
      valueDefault: placeholder.valueDefault,
      type: placeholder.type,
    });
    this.isSystem = true;
  }

  /**
   * description: open modal with form placeholders
   */
  createPlaceholders() {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.placeholdersUpdate = new PlaceholderUnomi();
  }

  /**
   * description: send request to backend, save a new placeholder
   */
  register() {
    let control = this.placeholdersForm.controls;
    let valid = false;

    let placeholder: PlaceholderUnomi = {
      name: control.name.value,
      valueDefault: control.valueDefault.value,
      type: control.type.value,
    };

    if (placeholder.name) {
      valid = true;
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERRORNAME,
      });
    }
    if (placeholder.valueDefault) {
      valid = true;
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERROVALUEDEFAULT,
      });
    }

    if (valid) {
      if (!this.isEditing) {
        this.save(placeholder);
      } else {
        this.update(placeholder);
      }
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
    this.placeholderUnomiService.getList().subscribe(
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
    this.placeholdersDataSource = this.placeholders.filter(
      (x) => x.isActive === this.optionsSelected
    );
    this.dt.reset();
  }
  changeState(placeholder: PlaceholderUnomi) {
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
        let update = new PlaceholderUnomi();

        update._id = placeholder._id;
        update.isActive = !placeholder.isActive;

        this.placeholderUnomiService.update(update).subscribe(
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
  save(placeholder: PlaceholderUnomi) {
    let found;
    if (this.placeholders) {
      found = this.placeholders.find((x) => x.name === placeholder.name);
    }
    if (!found) {
      this.placeholderUnomiService.add(placeholder).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.INSERTSUCCESS,
            });
            placeholder = new PlaceholderUnomi();
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
        summary: MessagesTst.PLACEHOLDEREXIST,
      });
    }
  }

  /**
   * description: update placeholder selected
   * @param placeholder - the placeholder selected
   */
  update(placeholder: PlaceholderUnomi) {
    placeholder._id = this.placeholdersUpdate._id;
    let found = this.placeholders.find((x) => x.name === placeholder.name);
    if (!found || found.name === this.placeholdersUpdate.name) {
      this.placeholderUnomiService.update(placeholder).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            });
            placeholder = new PlaceholderUnomi();
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
        summary: MessagesTst.PLACEHOLDEREXIST,
      });
    }
  }

  changeSystem() {
    this.isSystem = true;
  }

  validators() {
    this.placeholdersForm.controls.valueDefault.setValue('');
  }
}
