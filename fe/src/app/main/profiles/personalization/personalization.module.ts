import {
  RuleService,
  PagesService,
  BlockService,
  VariableService,
  TemplateService,
  ConditionsService,
  PersonalizationService,
  TemplatePersonalizationService,
} from 'src/app/shared/services';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { PersonalizationComponent } from './components/personalization.component';

const routes: Routes = [
  {
    path: 'personalization',
    canActivate: [AccesGuard],
    component: PersonalizationComponent,
  },
];

const modules = [SharedModule];
@NgModule({
  providers: [
    RuleService,
    PagesService,
    BlockService,
    TemplateService,
    VariableService,
    ConditionsService,
    PersonalizationService,
    TemplatePersonalizationService,
  ],
  declarations: [PersonalizationComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class PersonalizationModule {}
