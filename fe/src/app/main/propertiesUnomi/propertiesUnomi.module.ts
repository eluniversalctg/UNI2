import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { PropertiesUnomiService } from 'src/app/shared/services';
import { PropertiesUnomiComponent } from './components/propertiesUnomi.component';

// primeng modules
const modules = [SharedModule];
const routes: Routes = [
  {
    path: '',
    canActivate: [AccesGuard, AuthGuard],
    children: [
      { path: 'propertiesUnomi', component: PropertiesUnomiComponent },
    ],
  },
];
@NgModule({
  providers: [PropertiesUnomiService],
  declarations: [PropertiesUnomiComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class PropertiesUnomiModule {}
