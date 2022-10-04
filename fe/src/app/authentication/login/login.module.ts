import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { RouterModule, Routes } from '@angular/router';
import { LoginService } from './services/login.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './components/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxCaptchaModule,
    RouterModule.forChild(routes),
  ],
  providers: [LoginService],
})
export class LoginModule {}
