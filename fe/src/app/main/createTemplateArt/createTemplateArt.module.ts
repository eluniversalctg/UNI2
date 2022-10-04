import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplateService } from 'src/app/shared/services/templates.service';
import { CreateTemplateComponent } from './components/createTemplate.component';
import { PlaceholdersService } from 'src/app/shared/services/placeholders.service';
import { ReplacePlaceholderService } from 'src/app/shared/services/replacePlaceholder.service';

//prime modules
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'createTemplateArt', component: CreateTemplateComponent },
    ],
  },
];
const modules = [SharedModule, FileUploadModule, ImageModule];
@NgModule({
  providers: [TemplateService, PlaceholdersService, ReplacePlaceholderService],
  declarations: [CreateTemplateComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class CreateTemplateArtModule {}
