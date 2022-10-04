import {
  RuleService,
  EventsService,
  ExportService,
  ActionsService,
  VariableService,
  ConditionsService,
} from 'src/app/shared/services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { RulesComponent } from './components/rules.component';
import { ConditionsModule } from '../conditions/conditions.module';

const routes: Routes = [
  {
    path: 'rules',
    canActivate: [AccesGuard],
    component: RulesComponent,
  },
];

@NgModule({
  declarations: [RulesComponent],
  providers: [
    RuleService,
    EventsService,
    ExportService,
    ActionsService,
    VariableService,
    ConditionsService,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ConditionsModule,
    RouterModule.forChild(routes),
  ],
})
export class RulesModule {}
