import {
  PropertiesUnomiService,
  PlaceholderUnomiService,
} from 'src/app/shared/services';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { PlaceholderUnomiComponent } from './components/placeholderUnomi.component';
// primeng modules
import { RadioButtonModule } from 'primeng/radiobutton';

const routes: Routes = [
  {
    path: '',
    canActivate: [AccesGuard, AuthGuard],
    children: [
      { path: 'placeholderUnomi', component: PlaceholderUnomiComponent },
    ],
  },
];
const modules = [SharedModule, RadioButtonModule];

@NgModule({
  providers: [PlaceholderUnomiService, PropertiesUnomiService],
  declarations: [PlaceholderUnomiComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class PlaceholderUnomiModule {}
