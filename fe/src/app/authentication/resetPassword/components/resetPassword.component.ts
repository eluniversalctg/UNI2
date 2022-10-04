import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilitiesService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { MustMatch } from 'src/app/shared/validators/mustMatch';
import { ResetPasswordService } from '../services/resetPassword.service';

@Component({
  selector: 'app-resetPassword',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  captchaKey = environment.captcha;

  constructor(
    private router: Router,
    private msg: MessageService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private utilities: UtilitiesService,
    private resetService: ResetPasswordService
  ) {}

  // #region LifeHooks

  ngOnInit() {
    let pattern = this.utilities.patterOfPassword;

    this.resetPasswordForm = this._formBuilder.group(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(pattern),
        ]),
        passwordVerification: new FormControl('', [
          Validators.required,
          Validators.pattern(pattern),
        ]),
        recaptcha: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'passwordVerification'),
      }
    );
  }

  //#endregion

  //#region Custom Methods

  reset() {
    if (this.resetPasswordForm.valid) {
      let password = this.resetPasswordForm.controls.password.value;
      let token = this.route.snapshot.paramMap.get('token');

      this.resetService.resetPassword(password, token).subscribe(
        () => {
          this.msg.add({
            key: 'resetErrors',
            severity: MessagesTst.INFO,
            summary: MessagesTst.SUCSSEPASSWORD,
          });

          this.resetPasswordForm.reset();

          this.router.navigateByUrl('/auth/login');
        },
        () => {
          this.msg.add({
            key: 'resetErrors',
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORPASSWORD,
          });
        }
      );
    }
  }

  //#endregion
}
