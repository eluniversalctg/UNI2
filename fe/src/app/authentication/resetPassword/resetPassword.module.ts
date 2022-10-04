import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResetPasswordService } from './services/resetPassword.service';
import { ResetPasswordComponent } from './components/resetPassword.component';
// primeng modules
import { PasswordModule } from 'primeng/password';

const routes = [
  {
    path: '',
    component: ResetPasswordComponent,
  },
];
const modules = [PasswordModule];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgxCaptchaModule,
    ...modules,
  ],
  providers: [ResetPasswordService],
})
export class ResetPasswordModule {}
