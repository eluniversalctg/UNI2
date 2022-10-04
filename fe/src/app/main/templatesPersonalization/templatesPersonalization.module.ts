import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { ReplacePlaceholderService } from 'src/app/shared/services/replacePlaceholder.service';
import { TemplatesPersonalizationComponent } from './components/templatesPersonalization.component';
import { PlaceholderUnomiService,PlaceholdersService,TemplatePersonalizationService} from 'src/app/shared/services';
// primeng modules
import { RadioButtonModule } from 'primeng/radiobutton';
import { AngularEditorModule } from '@kolkov/angular-editor';

const modules = [SharedModule, RadioButtonModule, AngularEditorModule];
const routes: Routes = [
  {
    path: '',
    canActivate: [AccesGuard],
    children: [
      {
        path: 'templatesPersonalization',
        component: TemplatesPersonalizationComponent,
      },
    ],
  },
];
@NgModule({
  providers: [
    TemplatePersonalizationService,
    PlaceholderUnomiService,
    ReplacePlaceholderService,
    PlaceholdersService
  ],
  declarations: [TemplatesPersonalizationComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class TemplatesPersonalizationModule {}
