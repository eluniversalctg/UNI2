import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilitiesService } from '../shared/services/utilities.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'resetPassword/:token',
    loadChildren: () =>
      import('./resetPassword/resetPassword.module').then(
        (m) => m.ResetPasswordModule
      ),
  },
];

@NgModule({
  providers: [UtilitiesService],
  imports: [RouterModule.forChild(routes)],
})
export class AuthenticationModule {}
