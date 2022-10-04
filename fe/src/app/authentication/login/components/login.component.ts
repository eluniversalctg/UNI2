import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/shared/models/index';
import { LoginService } from '../services/login.service';
import { environment } from 'src/environments/environment';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotForm: FormGroup;
  showForgotForm: boolean = false;
  captchaKey = environment.captcha;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private msg: MessageService,
    private loginService: LoginService,
    private utilities: UtilitiesService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      recaptcha: ['', [Validators.required]],
    });
    this.forgotForm = this.fb.group({
      username: ['', Validators.required],
      recaptcha: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      let user: User = new User();
      user.username = this.loginForm.controls.username.value;
      user.password = this.loginForm.controls.password.value;
      this.loginService.login(user).subscribe(
        (data) => {
          // set token on localStorage
          this.utilities.setToken(data);

          // check if user and user role is active
          let userRole = this.utilities.getCurrentUser();
          if (userRole.isActive && userRole.roles.isActive) {
            this.router.navigateByUrl('/');
          } else {
            this.utilities.logOut();
          }
        },
        () => {
          this.msg.add({
            key: 'loginError',
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORLOGIN,
          });
        }
      );
    }
  }

  forgotPassword() {
    if (this.forgotForm.valid) {
      let username = this.forgotForm.controls.username.value;

      this.loginService.forgotPassword(username).subscribe(
        () => {
          this.msg.add({
            key: 'forgotMsgs',
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.SUCSSESMAIL,
          });
        },
        () => {
          this.msg.add({
            key: 'forgotMsgs',
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORMAIL,
          });
        }
      );
    }
  }
}
