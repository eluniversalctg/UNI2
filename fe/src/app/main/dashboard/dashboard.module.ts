import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/widgets/widgets.module').then(
        (m) => m.WidgetsModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/paramsWidgets/paramsWidgets.module').then(
        (m) => m.DashboardModule
      ),
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class DashboardModule {}
