import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./blocks/blocks.module').then((m) => m.BlocksModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./websiteStructure/websiteStructure.module').then(
        (m) => m.WebsiteStructureModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class BlocksModule {}
