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
import { ConditionsModule } from '../conditions/conditions.module';
import { SegmentsComponent } from './components/segments.component';

const routes: Routes = [
  {
    path: 'segments',
    canActivate: [AccesGuard],
    component: SegmentsComponent,
  },
];

@NgModule({
  declarations: [SegmentsComponent],
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
export class SegmentsModule {}
