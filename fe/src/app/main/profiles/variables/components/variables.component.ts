import {
  FormArray,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Variable } from 'src/app/shared/models';
import { Component, ViewChild } from '@angular/core';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VariableService } from 'src/app/shared/services/variable.service';

@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss'],
})
export class VariablesComponent {
  typeOfData: any[];
  variables: Variable[];
  variablesBck: Variable[] = [];
  addNew: boolean = false;
  variablesForm: FormGroup;
  variableUpdate: Variable;
  isEditing: boolean = false;
  submited: boolean = false;
  validDefault: boolean = true;
  typeDefaul;
  optionsSelected: boolean = true;
  options: any[];

  // options values form
  optionValuesForm: FormGroup;

  @ViewChild('dt') dt;

  constructor(
    private fb: FormBuilder,
    private msg: MessageService,
    private variableService: VariableService,
    private confirmationService: ConfirmationService
  ) {
    this.optionValuesForm = this.fb.group({
      optionValues: this.fb.array([]),
    });

    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];

    this.getAllVariables();

    this.typeOfData = [
      'boolean',
      'char',
      'Condition',
      'comparisonOperator',
      'date',
      'double',
      'float',
      'integer',
      'string',
    ];

    this.variablesForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      multivalued: new FormControl('', [Validators.required]),
      isActive: new FormControl('', [Validators.required]),
      defaultValue: new FormControl('', []),
    });
  }

  filterTable() {
    this.dt.reset();
    this.variablesBck = [
      ...this.variables.filter((x) => x.isActive === this.optionsSelected),
    ];
  }

  // crete array of values
  values(): FormArray {
    return this.optionValuesForm.get('optionValues') as FormArray;
  }

  newValue(loadValue?): FormGroup {
    return this.fb.group({
      value: loadValue ? loadValue.value : '',
      saveInto: loadValue ? loadValue.saveInto : '',
      options: loadValue ? [loadValue.options] : '',
    });
  }

  addValue(loadValue?) {
    this.values().push(this.newValue(loadValue));
  }

  removeValue(i: number) {
    this.values().removeAt(i);
  }
  // #END create array of values

  /**
   * description: open the modal to update variable
   * @param variable - the variable selected
   */
  openUpdatevariable(variable: Variable) {
    if (
      variable.type === 'Condition' ||
      variable.type === 'comparisonOperator'
    ) {
      this.validDefault = false;
    } else {
      this.validDefault = true;
    }
    if (
      variable.type === 'integer' ||
      variable.type === 'double' ||
      variable.type === 'float'
    ) {
      this.typeDefaul = 'number';
    } else {
      this.typeDefaul = 'text';
    }
    this.reset();
    this.addNew = true;
    this.isEditing = true;
    this.variableUpdate = variable;

    this.variablesForm.patchValue({
      id: variable.id,
      type: variable.type,
      isActive: variable.isActive,
      multivalued: variable.multivalued,
      defaultValue: variable.defaultValue,
    });

    variable.optionValues?.forEach((value) => {
      if (value.options.length !== 0) {
        value.options = value.options.map((obj) => {
          return obj.value ? obj.value : obj;
        });
      }
      this.addValue(value);
    });
  }

  changeState(variable: Variable) {
    let message = `¿Está seguro que desea ${
      variable.isActive ? 'inactivar' : 'activar'
    } la varibale <b>
      ${variable.id}
      </b>? <br/>La varibale seleccionada quedará ${
        variable.isActive ? 'sin' : 'con'
      } función en la plataforma.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        variable.isActive = !variable.isActive;
        this.variableService.update(variable).subscribe(
          (data) => {
            if (variable.isActive) {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.VARIABLEACTIVATED,
              });
            } else {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.VARIABLEINACTIVATED,
              });
            }
            this.getAllVariables();
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

  /**
   * description: open modal with form variables
   */
  createVariable() {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.variableUpdate = new Variable();
    this.variablesForm.patchValue({
      multivalued: false,
      isActive: true,
    });
  }

  changeType() {
    this.validDefault = true;
    let control = this.variablesForm.controls;
    control.defaultValue.setValue(null);
    if (
      control.type.value === 'integer' ||
      control.type.value === 'double' ||
      control.type.value === 'float'
    ) {
      this.typeDefaul = 'number';
    } else {
      this.typeDefaul = 'text';
    }

    if (
      control.type.value === 'Condition' ||
      control.type.value === 'comparisonOperator'
    ) {
      this.validDefault = false;
    }
  }

  /**
   * description: send request to backend, save a new variable
   */
  register() {
    const optionsValues = this.optionValuesForm.controls.optionValues.value;
    if (optionsValues.length === 0) {
      return this.msg.add({
        severity: MessagesTst.ERROR,
        summary: 'Debe agregar al menos un valor',
      });
    }

    let control = this.variablesForm.controls;

    // map options values
    optionsValues.forEach((option) => {
      if (option.saveInto === '') {
        option.saveInto = control.id.value;
      }

      if (Array.isArray(option.options)) {
        if (option.options.length === 0) {
          option.options = [];
        } else {
          option.options = option.options.map((obj) => {
            let newObj = {};
            if (obj.value) {
              newObj['value'] = obj.value;
            } else {
              newObj['value'] = obj;
            }
            return newObj;
          });
        }
      }
    });

    if (control.defaultValue.value === '') {
      control.defaultValue.setValue(null);
    }
    let variable: Variable = {
      id: control.id.value,
      type: control.type.value,
      isActive: control.isActive.value,
      multivalued: control.multivalued.value,
      defaultValue: control.defaultValue.value,
      optionValues: optionsValues,
    };
    if (!this.isEditing) {
      this.save(variable);
    } else {
      this.update(variable);
    }
  }

  /**
   * description: reset form
   */
  reset() {
    this.variablesForm.reset();
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
   * description: get all variables
   */
  getAllVariables() {
    this.variableService.getList().subscribe(
      (response) => {
        this.variables = response;
        this.variablesBck = [
          ...response.filter((x) => x.isActive === this.optionsSelected),
        ];
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
   * description: duplicate the variable selected
   * * @param variable - the variable selected
   */
  duplicateVariable(variable: Variable) {
    if (
      variable.type === 'Condition' ||
      variable.type === 'comparisonOperator'
    ) {
      this.validDefault = false;
    } else {
      this.validDefault = true;
    }
    if (
      variable.type === 'integer' ||
      variable.type === 'double' ||
      variable.type === 'float'
    ) {
      this.typeDefaul = 'number';
    } else {
      this.typeDefaul = 'text';
    }
    this.isEditing = false;
    this.reset();
    this.addNew = true;

    this.variablesForm.patchValue({
      id: variable.id,
      type: variable.type,
      isActive: variable.isActive,
      multivalued: variable.multivalued,
      defaultValue: variable.defaultValue,
    });

    variable.optionValues?.forEach((value) => {
      value.options = value.options.map((obj) => {
        return obj.value ? obj.value : obj;
      });
      this.addValue(value);
    });
  }

  /**
   * description: save new variable
   * @param variable - the variable
   */
  save(variable: Variable) {
    let found = this.variables.find((x) => x.id === variable.id);
    if (!found) {
      this.variableService.add(variable).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.INSERTSUCCESS,
            });
            variable = new Variable();
            this.reset();
            this.getAllVariables();
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

  /**
   * description: update variable selected
   * @param variable - the variable selected
   */
  update(variable: Variable) {
    variable._id = this.variableUpdate._id;
    let found = this.variables.find((x) => x.id === variable.id);
    if (!found || found.id === this.variableUpdate.id) {
      this.variableService.update(variable).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            });
            variable = new Variable();
            this.reset();
            this.addNew = false;
            this.getAllVariables();
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
}
