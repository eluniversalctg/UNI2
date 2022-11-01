import { forkJoin } from 'rxjs';
import { Component } from '@angular/core';
import { Roles, User } from 'src/app/shared/models';
import { UserService } from 'src/app/shared/services';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { RolesService, UtilitiesService } from 'src/app/shared/services';

@Component({
  selector: 'app-createUser',
  templateUrl: './createUser.component.html',
  styleUrls: ['./createUser.component.scss'],
})
export class CreateUserComponent {
  users: User[];
  usersDataSource: User[];
  roles: Roles[];
  options: any[];
  userUpdate: User;
  addNew: boolean = false;
  registerForm: FormGroup;
  isEditing: boolean = false;
  submitted: boolean = false;
  optionsSelected: boolean = true;

  nameForm: boolean = false;
  rolesForm: boolean = false;
  emailForm: boolean = false;
  usernameForm: boolean = false;
  passwordForm: boolean = false;
  confirmPassword: boolean = false;
  firtSurnameForm: boolean = false;
  secondSurnameForm: boolean = false;

  constructor(
    private msg: MessageService,
    private userService: UserService,
    private rolesService: RolesService,
    private utilities: UtilitiesService,
    private confirmationService: ConfirmationService
  ) {
    this.getAllUsers();

    let pattern = this.utilities.patterOfPassword;

    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      roles: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      firstSurname: new FormControl('', [Validators.required]),
      secondSurname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(pattern),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(pattern),
      ]),
    });

    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];
  }

  /**
   * description: send request to backend, save a new user
   */
  register() {
    let valid = true;
    this.nameForm = false;
    this.rolesForm = false;
    this.emailForm = false;
    this.usernameForm = false;
    this.passwordForm = false;
    this.confirmPassword = false;
    this.firtSurnameForm = false;
    this.secondSurnameForm = false;

    let control = this.registerForm.controls;
    let confirmPassword = control.confirmPassword.value;

    let user: User = {
      name: control.name.value,
      roles: control.roles.value,
      email: control.email.value,
      username: control.username.value,
      password: control.password.value,
      firtSurname: control.firstSurname.value,
      secondSurname: control.secondSurname.value,
    };

    if (user.name === null || user.name === '') {
      valid = false;
      this.nameForm = true;
    }

    if (user.firtSurname === null || user.firtSurname === '') {
      valid = false;
      this.firtSurnameForm = true;
    }
    if (user.secondSurname === null || user.secondSurname === '') {
      valid = false;
      this.secondSurnameForm = true;
    }

    if (!user.roles) {
      valid = false;
      this.rolesForm = true;
    }
    if (user.email === null || user.email === '' || !control.email.valid) {
      valid = false;
      this.emailForm = true;
    }

    if (user.username === null || user.username === '') {
      valid = false;
      this.usernameForm = true;
    }
    if (!this.isEditing) {
      if (
        user.password === null ||
        user.password === '' ||
        !control.password.valid
      ) {
        valid = false;
        this.passwordForm = true;
      }

      if (
        confirmPassword === null ||
        confirmPassword === '' ||
        confirmPassword !== user.password
      ) {
        valid = false;
        this.confirmPassword = true;
      }
    }

    if (valid) {
      if (!this.isEditing) {
        if (user.password === confirmPassword) {
          this.save(user);
        } else {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.PASSWORDNOTEQUALS,
          });
        }
      } else {
        this.update(user);
      }
    }
  }

  filterDataTable() {
    this.usersDataSource = this.users.filter(
      (x) => x.isActive === this.optionsSelected
    );
  }

  /**
   * description: reset form
   */
  reset() {
    this.registerForm.reset();
  }

  /**
   * description: get all users
   */
  getAllUsers() {
    let userReq = this.userService.getList();
    let roleReq = this.rolesService.getList();
    forkJoin([userReq, roleReq]).subscribe({
      next: (response) => {
        this.users = response[0];
        this.roles = response[1].filter((x) => x.isActive);
        this.filterDataTable();
      },
      error: () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      },
    });
  }

  /**
   * description: open modal with form register
   */
  createUser() {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.userUpdate = new User();
  }

  /**
   * description: active a user
   * @param user - the user selected
   */
  changeState(user: User) {
    let message = `¿Está seguro que desea ${
      user.isActive ? 'inactivar' : 'activar'
    } el usuario <b>
      ${user.name} ${user.firtSurname} ${user.secondSurname}
      </b>? <br/>El usuario seleccionado quedará ${
        user.isActive ? 'sin' : 'con'
      } acceso a la plataforma.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        let update = new User();

        update._id = user._id;
        update.isActive = !user.isActive;

        this.userService.update(update).subscribe(
          () => {
            if (user.isActive) {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PROFILEINACTIVATED,
              });
            } else {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PROFILEACTIVATED,
              });
            }
            this.getAllUsers();
          },
          () => {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.CHANGESTATE,
            });
          }
        );
      },
    });
  }

  /**
   * description: open the modal to update user
   * @param user - the user selected
   */
  openUpdateUser(user: User) {
    this.reset();
    this.addNew = true;
    this.isEditing = true;
    this.userUpdate = user;

    this.registerForm.patchValue({
      name: user.name,
      email: user.email,
      roles: user.roles,
      username: user.username,
      firstSurname: user.firtSurname,
      secondSurname: user.secondSurname,
    });

    this.registerForm.controls.password.setValidators(null);
    this.registerForm.controls.password.updateValueAndValidity();
    this.registerForm.controls.confirmPassword.setValidators(null);
    this.registerForm.controls.confirmPassword.updateValueAndValidity();
  }

  /**
   * description: update user selected
   * @param user - the user selected
   */
  update(user: User) {
    user._id = this.userUpdate._id;
    user.isActive = this.userUpdate.isActive;

    this.userService.update(user).subscribe(
      (data) => {
        if (data) {
          if (data['codeName']) {
            return this.msg.add({
              severity: MessagesTst.ERROR,
              summary: `${
                data['codeName'] === 'DuplicateKey' &&
                Object.keys(data['keyValue'])[0] === 'username'
                  ? 'El username es único.'
                  : data['codeName']
              }`,
            });
          }
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.UPDATESUCCESS,
          });
          user = new User();
          this.reset();
          this.addNew = false;
          this.getAllUsers();
        }
      },
      (error) => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.INSERTERROR,
        });
      }
    );
  }

  /**
   * description: save new user
   * @param user - the user selected
   */
  save(user: User) {
    this.userService.add(user).subscribe(
      (data) => {
        if (data != undefined) {
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          });
          user = new User();
          this.addNew = false;
          this.reset();
          this.getAllUsers();
        }
      },
      (error) => {
        if (error.error.message === 'El username ya existe') {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: error.error.message,
          });
        } else {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          });
        }
      }
    );
  }
}
