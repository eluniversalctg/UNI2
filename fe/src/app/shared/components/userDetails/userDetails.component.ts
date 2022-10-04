import {
  Input,
  Output,
  Component,
  OnChanges,
  EventEmitter,
} from '@angular/core';
import * as _ from 'lodash';
import { MessagesTst } from '../../enums';
import { UserFields } from '../../models';
import { MessageService } from 'primeng/api';
import { UserFieldsService } from '../../services';

@Component({
  selector: 'app-user-details',
  templateUrl: './userDetails.component.html',
  styleUrls: ['./userDetails.component.scss'],
})
export class UserDetailsComponent implements OnChanges {
  @Input() profile: any;
  @Input() edit: boolean = false;
  @Input() userFields: UserFields[] = [];
  @Input() visualizing: boolean = false;
  @Input() editing: boolean = false;
  @Output() saveEvent = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();
  aditionalFields: any[] = [];
  step: string = 'step1';
  unomiFields: UserFields[] = [];
  hoy = new Date();
  constructor(
    private msg: MessageService,
    private userFieldSrv: UserFieldsService
  ) {
    this.unomiFields = this.userFieldSrv.exportUnomiFields();
  }
  ngOnChanges(): void {
    this.step = 'step1';
    //aditional fields
    this.aditionalFields = _.groupBy(this.userFields, 'group');
    // ***************************** profile *****************************

    if (!this.profile.properties) {
      this.profile.properties = {};
    }
    // set values to profile fields
    this.unomiFields.forEach((field) => {
      if (!this.profile.properties[field.name]) {
        //set empty to avoid binding errors
        this.profile.properties[field.name] = '';
      }
    });

    if (this.profile.systemProperties && !this.profile.systemProperties.goals) {
      this.profile.systemProperties = { goals: {} };
    }
  }

  cancel() {
    this.cancelEvent.emit('true');
  }

  save() {
    // validate UNOMI default fields
    let fieldsToValidate = [...this.userFields, ...this.unomiFields];

    // add properties to profile
    this.userFields.forEach((field) => {
      this.profile.properties[field.name] = field.value;
    });

    //get unomi fields
    let keys = Object.keys(this.profile.properties);

    for (let i = 0; i < keys.length; i++) {
      const element = keys[i];

      let find = fieldsToValidate.find((x) => x.name === element);

      // validate if required field is not empty
      if (
        find &&
        (!find.value || find.value.length === 0) &&
        find.isRequired &&
        !_.get(this.profile.properties, element)
      ) {
        return this.msg.add({
          severity: MessagesTst.ERROR,
          summary: `${find.name} es requerido`,
        });
      }

      // validate if email field is valid
      if (
        find &&
        find.type === 'email' &&
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          this.profile.properties.email
        )
      ) {
        return this.msg.add({
          severity: MessagesTst.ERROR,
          summary: 'El correo no cumple con un patrón adecuado.',
        });
      }
    }

    // send event to main event to save profile
    this.saveEvent.emit('true');
  }
}
