import {
  BlockService,
  PagesService,
  ExportService,
  MatomoService,
  WeighingService,
  PlaceholdersService,
  PersonalizationService,
  PlaceholderUnomiService,
  TemplatePersonalizationService,
} from 'src/app/shared/services';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { WebsiteStructureComponent } from './websiteStructure.component';

// primeng modules
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

const routes: Routes = [
  {
    path: 'websiteStructure',
    canActivate: [AccesGuard, AuthGuard],
    component: WebsiteStructureComponent,
  },
];

const modules = [
  CardModule,
  StepsModule,
  SharedModule,
  CheckboxModule,
  DropdownModule,
  RadioButtonModule,
];

const providers = [
  BlockService,
  MatomoService,
  WeighingService,
  PlaceholdersService,
  PersonalizationService,
  PlaceholderUnomiService,
  TemplatePersonalizationService,
];

@NgModule({
  providers: [PagesService, ExportService, ...providers],
  declarations: [WebsiteStructureComponent],
  imports: [RouterModule.forChild(routes), ...modules],
  exports: [WebsiteStructureComponent],
})
export class WebsiteStructureModule {}
