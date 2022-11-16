import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./variables/variables.module').then((m) => m.VariablesModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./rules/rules.module').then((m) => m.RulesModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./conditions/conditions.module').then((m) => m.ConditionsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./actions/actions.module').then((m) => m.ActionsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./personalization/personalization.module').then(
        (m) => m.PersonalizationModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./goals/goals.module').then((m) => m.GoalsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./segments/segments.module').then((m) => m.SegmentsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./campaigns/campaigns.module').then((m) => m.CampaignsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./scoring/scoring.module').then((m) => m.ScoringModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./userFields/userFields.module').then((m) => m.UserFieldsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./statistics/statistics.module').then(
        (m) => m.StaticsProfileModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./unomiProfiles/unomiProfiles.module').then(
        (m) => m.UnomiProfilesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProfilesModule {}
