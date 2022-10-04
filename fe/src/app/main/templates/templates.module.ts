import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { TemplatesComponent } from './components/templates.component';
import { TemplateService } from 'src/app/shared/services/templates.service';
import { PlaceholdersService } from 'src/app/shared/services/placeholders.service';
import { ReplacePlaceholderService } from 'src/app/shared/services/replacePlaceholder.service';
// primeng modules
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AngularEditorModule } from '@kolkov/angular-editor';
const modules = [
  SharedModule,
  FileUploadModule,
  RadioButtonModule,
  AngularEditorModule,
];

const routes: Routes = [
  {
    path: '',
    canActivate: [AccesGuard],
    children: [{ path: 'templates', component: TemplatesComponent }],
  },
];
@NgModule({
  providers: [TemplateService, PlaceholdersService, ReplacePlaceholderService],
  declarations: [TemplatesComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class TemplatesModule {}
