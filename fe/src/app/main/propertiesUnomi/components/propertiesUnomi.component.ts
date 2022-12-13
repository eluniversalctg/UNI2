import { Component, ViewChild } from '@angular/core';
import { PropertiesUnomi } from 'src/app/shared/models';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { PropertiesUnomiService } from 'src/app/shared/services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-propertiesUnomi',
  templateUrl: './propertiesUnomi.component.html',
  styleUrls: ['./propertiesUnomi.component.scss'],
})
export class PropertiesUnomiComponent {
  propertiesUnomi: PropertiesUnomi[];
  propertiesUnomiDataSource: PropertiesUnomi[];
  addNew: boolean = false;
  propertiesUnomiUpdate: PropertiesUnomi;
  isEditing: boolean = false;
  propertiesUnomiForm: FormGroup;
  optionsSelected: boolean = true;
  options: any[];
  isSystem: boolean = false;
  @ViewChild('dt') dt;

  constructor(
    private msg: MessageService,
    private confirmationService: ConfirmationService,
    private propertiesUnomiService: PropertiesUnomiService
  ) {
    this.getAllProperties();

    this.propertiesUnomiForm = new FormGroup({
      label: new FormControl('', [Validators.required]),
      valueDefault: new FormControl('', [Validators.required]),
    });

    this.options = [
      { label: 'Activos', value: true },
      { label: 'Inactivos', value: false },
    ];
  }

  /**
   * description: open the modal to update property
   * @param property - the property selected
   */
  openUpdateProperty(property: PropertiesUnomi) {
    this.reset();
    this.addNew = true;
    this.isEditing = true;
    this.propertiesUnomiUpdate = property;

    this.propertiesUnomiForm.patchValue({
      label: property.label,
      valueDefault: property.valueDefault,
    });
    this.isSystem = true;
  }

  /**
   * description: open modal with form propertiesUnomi
   */
  createPropertie() {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.propertiesUnomiUpdate = new PropertiesUnomi();
  }

  /**
   * description: send request to backend, save a new property
   */
  register() {
    let control = this.propertiesUnomiForm.controls;

    let property: PropertiesUnomi = {
      label: control.label.value,
      valueDefault: control.valueDefault.value,
    };

    if (!this.isEditing) {
      this.save(property);
    } else {
      this.update(property);
    }
  }

  /**
   * description: reset form
   */
  reset() {
    this.propertiesUnomiForm.reset();
  }

  /**
   * description: get all propertiesUnomi
   */
  getAllProperties() {
    this.propertiesUnomiService.getList().subscribe(
      (response) => {
        this.propertiesUnomi = response;
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
    this.dt.reset();
    this.propertiesUnomiDataSource = this.propertiesUnomi.filter(
      (x) => x.isActive === this.optionsSelected
    );
  }

  changeState(property: PropertiesUnomi) {
    let message = `¿Está seguro que desea ${
      property.isActive ? 'inactivar' : 'activar'
    } la propiedad <b>
      ${property.label}
      </b>? <br/>La propiedad seleccionado quedará ${
        property.isActive ? 'sin' : 'con'
      } función en la plataforma.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        let update = new PropertiesUnomi();

        update._id = property._id;
        update.isActive = !property.isActive;

        this.propertiesUnomiService.update(update).subscribe(
          (data) => {
            if (property.isActive) {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PROPERTYINACTIVATED,
              });
            } else {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PROPERTYACTIVATED,
              });
            }
            this.getAllProperties();
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
   * description: save new property
   * @param property - the property
   */
  save(property: PropertiesUnomi) {
    let found;
    if (this.propertiesUnomi) {
      found = this.propertiesUnomi.find((x) => x.label === property.label);
    }
    if (!found) {
      this.propertiesUnomiService.add(property).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.INSERTSUCCESS,
            });
            property = new PropertiesUnomi();
            this.reset();
            this.getAllProperties();
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
   * description: update property selected
   * @param property - the property selected
   */
  update(property: PropertiesUnomi) {
    property._id = this.propertiesUnomiUpdate._id;
    let found = this.propertiesUnomi.find((x) => x.label === property.label);
    if (!found || found.label === this.propertiesUnomiUpdate.label) {
      this.propertiesUnomiService.update(property).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            });
            property = new PropertiesUnomi();
            this.reset();
            this.addNew = false;
            this.getAllProperties();
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

  changeSystem() {
    this.isSystem = true;
  }

  validators() {
    this.propertiesUnomiForm.controls.valueDefault.setValue('');
  }
}
