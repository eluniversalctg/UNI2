import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CromaService } from 'src/app/shared/services';
import { RouterModule, Routes } from '@angular/router';
import { CromaTagsComponent } from './cromaTags.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { TemplateService } from 'src/app/shared/services/templates.service';

// primeng modules
import { StepsModule } from 'primeng/steps';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
const routes: Routes = [
  {
    path: 'cromatags',
    canActivate: [AccesGuard],
    component: CromaTagsComponent,
  },
];
const modules = [
  SharedModule,
  StepsModule,
  FileUploadModule,

  ImageModule,
  AccordionModule,
  CalendarModule,
];

@NgModule({
  providers: [CromaService, TemplateService],
  declarations: [CromaTagsComponent],
  imports: [CommonModule, ...modules, RouterModule.forChild(routes)],
})
export class CromaTagsModule {}
