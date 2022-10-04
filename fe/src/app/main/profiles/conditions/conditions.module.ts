import {
  RuleService,
  VariableService,
  ConditionsService,
} from 'src/app/shared/services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { ConditionsComponent } from './components/conditions.component';

const routes: Routes = [
  {
    path: 'conditions',
    canActivate: [AccesGuard, AuthGuard],
    component: ConditionsComponent,
  },
];

const modules = [SharedModule];
@NgModule({
  declarations: [ConditionsComponent],
  providers: [VariableService, ConditionsService, RuleService],
  imports: [CommonModule, RouterModule.forChild(routes), ...modules],
})
export class ConditionsModule {}
