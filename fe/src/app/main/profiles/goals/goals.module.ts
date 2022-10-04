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
import { GoalsComponent } from './components/goals.component';
import { ConditionsModule } from '../conditions/conditions.module';

const routes: Routes = [
  {
    path: 'goals',
    canActivate: [AccesGuard],
    component: GoalsComponent,
  },
];

@NgModule({
  declarations: [GoalsComponent],
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
    RouterModule.forChild(routes),
    ConditionsModule,
  ],
})
export class GoalsModule {}
