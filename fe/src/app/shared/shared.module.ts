import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNgModules
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { TreeDragDropService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
import { SpeedDialModule } from 'primeng/speeddial';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

//services
import {
  RuleService,
  UserService,
  RolesService,
  MatomoService,
  SpinnerService,
  VariableService,
  UserFieldsService,
  ConditionsService,
  PermissionsService,
  UnomiProfilesService,
  ProfileAnaliticService,
} from './services';

// components
import { UnomiComponent } from './components/unomi/unomi.component';
import { IframeComponent } from './components/iframe/iframe.component';
import { InputsTreeComponent } from './components/inputs/inputs.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { ProfileAnalitic } from './components/profile-analitic/profile-analitic.component';
import { SharedConditionsComponent } from './components/conditions/sharedConditions.component';
import { RecordSegmentsComponent } from './components/recordSegments/recordSegments.component';

//pipes
import { SafePipe } from './pipes/save.pipe';
import { statePipe } from './pipes/state.pipe';
import { ReplacePipe } from './pipes/replace.pipe';
import { GetValuePipe } from './pipes/getData.pipe';
import { isRequiredPipe } from './pipes/isRequired.pipe';
import { GoalDatePipe } from './pipes/transformDate.pipe';
import { ActivityLogService } from './services/activity-log.service';
import { UserDetailsComponent } from './components/userDetails/userDetails.component';

//date format
import localePy from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePy, 'es');

const pipes = [
  SafePipe,
  statePipe,
  ReplacePipe,
  GoalDatePipe,
  GetValuePipe,
  isRequiredPipe,
];

const angularModules = [FormsModule, ReactiveFormsModule, CommonModule];

const primeNgModules = [
  ButtonModule,
  CardModule,
  ConfirmDialogModule,
  ChipsModule,
  ConfirmPopupModule,
  DialogModule,
  InputTextModule,
  ToastModule,
  ToolbarModule,
  TooltipModule,
  TableModule,
  DropdownModule,
  MessageModule,
  CalendarModule,
  ChartModule,
  MultiSelectModule,
  OverlayPanelModule,
  SelectButtonModule,
  SpeedDialModule,
  GalleriaModule,
  RadioButtonModule,
  InputSwitchModule,
];

const providers = [
  UserService,
  RuleService,
  RolesService,
  MatomoService,
  MessageService,
  SpinnerService,
  VariableService,
  UserFieldsService,
  ConditionsService,
  ActivityLogService,
  PermissionsService,
  TreeDragDropService,
  ConfirmationService,
  UnomiProfilesService,
  ProfileAnaliticService,
];

const components = [
  UnomiComponent,
  ProfileAnalitic,
  IframeComponent,
  InputsTreeComponent,
  UserDetailsComponent,
  ActivityLogComponent,
  RecordSegmentsComponent,
  SharedConditionsComponent,
];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [...angularModules, ...primeNgModules],
  providers: [...providers],
  exports: [...angularModules, ...primeNgModules, ...components, ...pipes],
})
export class SharedModule {}
