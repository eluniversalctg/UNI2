import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PagesService,
  ExportService,
  DomainsService,
} from 'src/app/shared/services';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { PagesComponent } from './pages.component';

// primeng modules
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { WebsiteStructureModule } from '../websiteStructure/websiteStructure.module';

const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AccesGuard, AuthGuard],
    component: PagesComponent,
  },
];

const modules = [SharedModule, CheckboxModule, DropdownModule];

@NgModule({
  providers: [PagesService, ExportService, DomainsService],
  declarations: [PagesComponent],
  imports: [RouterModule.forChild(routes), ...modules, WebsiteStructureModule],
})
export class PagesModule {}
