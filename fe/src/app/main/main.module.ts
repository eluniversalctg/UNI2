import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },

  {
    path: 'register',
    loadChildren: () =>
      import('./createUser/createUser.module').then((m) => m.CreateUserModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./roles/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'profiles',
    loadChildren: () =>
      import('./profiles/profiles.module').then((m) => m.ProfilesModule),
  },
  {
    path: 'matomo',
    loadChildren: () =>
      import('./matomo/matomo.module').then((m) => m.MatomoModule),
  },
  {
    path: 'croma',
    loadChildren: () =>
      import('./croma/croma.module').then((m) => m.CromaModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./templates/templates.module').then((m) => m.TemplatesModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./placeholders/placeholders.module').then(
        (m) => m.PlaceholdersModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./createTemplateArt/createTemplateArt.module').then(
        (m) => m.CreateTemplateArtModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./maintenance/maintenance.module').then(
        (m) => m.MaintenanceModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./placeholderUnomi/placeholderUnomi.module').then(
        (m) => m.PlaceholderUnomiModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./templatesPersonalization/templatesPersonalization.module').then(
        (m) => m.TemplatesPersonalizationModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./propertiesUnomi/propertiesUnomi.module').then(
        (m) => m.PropertiesUnomiModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./siteAdmin/siteAdmin.module').then((m) => m.BlocksModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./weighing/weighing.module').then((m) => m.WeighingModule),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), CoreModule],
})
export class MainModule {}
