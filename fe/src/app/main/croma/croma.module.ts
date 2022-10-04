import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/cromaTags/CromaTags.module').then(
        (m) => m.CromaTagsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CromaModule {}
