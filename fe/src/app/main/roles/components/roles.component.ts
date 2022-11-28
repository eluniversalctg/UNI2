import { Component } from '@angular/core';
import { Roles, User } from 'src/app/shared/models/index';
import { MenuService } from 'src/app/core/services/index';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService, UserService } from 'src/app/shared/services/index';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './roles.component.html',
})
export class RolesComponent {
  menu: TreeNode[];
  selectedPages: TreeNode[];
  options: any[] = [];
  parentsChild: any[] = [];
  roles: Roles[];
  rolesDataSource: Roles[];
  selectedRole: Roles = new Roles();
  rolesForm: FormGroup;
  addNew: boolean = false;
  state: boolean = true;
  isEditing: boolean = false;
  optionsSelected: boolean = true;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private usersSrv: UserService,
    private msg: MessageService,
    private menuService: MenuService,
    private rolesService: RolesService,
    private confirmationService: ConfirmationService
  ) {
    this.usersSrv.getList().subscribe({
      next: (data) => (this.users = data),
    });

    this.options = [
      { name: 'Activos', value: true },

      { name: 'Inactivos', value: false },
    ];

    // create form
    this.rolesForm = this.fb.group({
      _id: [],
      name: ['name', Validators.required],
      template: [],
      pages: [[], Validators.required],
      isActive: [false, Validators.required],
    });
    // get the menu to map on tree node
    this.menu = this.menuService.getMenu();

    this.getRoles();
  }

  filterDataSource() {
    this.rolesDataSource = this.roles.filter(
      (x) => x.isActive === this.optionsSelected
    );
  }

  // get roles from DB
  getRoles() {
    this.rolesService.getList().subscribe((data) => {
      this.roles = data;
      this.filterDataSource();
    });
  }

  // reset role pop up
  resetData() {
    this.rolesForm.reset();
    this.rolesForm.controls.isActive.setValue(false);
    this.selectedPages = [];
    this.addNew = false;
  }

  // opens create role pop up
  createRole() {
    this.resetData();
    this.selectedPages = [];
    this.isEditing = false;
    this.addNew = true;
  }

  editRole(role: Roles) {
    this.selectedPages = [];
    // load role information pop up
    this.rolesForm.controls._id.setValue(role._id);
    this.rolesForm.controls.isActive.setValue(role.isActive);
    this.rolesForm.controls.name.setValue(role.name);
    this.selectedPages = role.pages;
    this.addNew = true;
    this.isEditing = true;
  }

  // save the role
  saveRole() {
    // if valid name
    if (
      this.rolesForm.controls.name.value !== null &&
      this.rolesForm.controls.name.value !== ''
    ) {
      // check if role with same name exist
      let found = this.roles.find(
        (x) =>
          x.name.toUpperCase() ===
          this.rolesForm.controls.name.value.toUpperCase()
      );

      if (found && !this.isEditing) {
        return this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.ERRORROLE,
        });
      }

      this.parentsChild = [];

      if (
        this.selectedPages.length === 0 ||
        (this.selectedPages.length === 1 &&
          this.selectedPages.filter((x) => x.key === '0'))
      ) {
        return this.msg.add({
          severity: MessagesTst.WARNING,
          summary: 'Debe seleccionar al menos una pantalla a asignar',
        });
      }
      // function to get all nodes from tree
      this.selectedPages.forEach((node) => {
        this.saveNodes({
          key: node.key,
          hasAccess: true,
          parent: node.parent,
          routerLink: node['routerLink']
            ? typeof node['routerLink'] === 'object'
              ? node['routerLink'][0]
              : node['routerLink']
            : null,
        });
      });

      this.rolesForm.controls.pages.setValue(
        this.checkNodes(this.parentsChild)
      );

      // check if is editing to update role
      if (this.isEditing) {
        if (
          this.roleInUse(this.rolesForm.controls._id.value) &&
          !this.rolesForm.controls.isActive.value
        ) {
          return this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ROLEUSED,
          });
        }
        this.rolesService.update(this.rolesForm.value).subscribe(
          () => {
            this.isEditing = false;
            this.resetData();
            this.getRoles();
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            });
          },
          () => {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.UPDATEERROR,
            });
          }
        );
      } else {
        // if is not editing.. create role
        this.rolesService.add(this.rolesForm.value).subscribe(
          () => {
            this.resetData();
            this.getRoles();
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.INSERTSUCCESS,
            });
          },
          () => {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.INSERTERROR,
            });
          }
        );
      }
    } else {
      this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'Debe agregar el nombre',
      });
    }
  }

  roleInUse(_id) {
    const find = this.users.find((x) => x.roles._id === _id);
    if (find) {
      return true;
    }
    return false;
  }

  changeState(role: Roles) {
    if (this.roleInUse(role._id) && role.isActive) {
      return this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ROLEUSED,
      });
    }
    // change role state.
    this.confirmationService.confirm({
      message:
        `Está seguro que desea  ${role.isActive ? 'inactivar' : 'activar'}
            el role <b>` +
        role.name +
        `</b>? <br/>Si existe algún usuario con este role asignado se quedará  ${
          role.isActive ? 'sin' : 'con'
        } acceso a la plataforma.`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        //copy of object role
        let update = { ...role };
        update.isActive = !role.isActive;
        this.rolesService.update(update).subscribe(
          () => {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.SUCCESSTATE,
            });

            this.getRoles();
          },
          () => {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.ERRORSTATE,
            });
          }
        );
      },
    });
  }

  // load nodes on tree node from role template.
  setPages() {
    const template = this.rolesForm.controls.template.value;
    this.selectedPages = template.pages;
  }

  // # check tree nodes
  saveNodes(node) {
    let found = this.parentsChild.find((x) => x.key === node.key);
    if (!found) {
      this.parentsChild.push({
        key: node.key,
        hasAccess: true,
        routerLink: node.routerLink,
      });
    }
    while (node.parent) {
      node = node.parent;
      let found = this.parentsChild.find((x) => x.key === node.key);
      if (!found) {
        this.parentsChild.push({
          key: node.key,
          hasAccess: true,
          routerLink: node.routerLink,
        });
      }
    }
    let grandpa = this.parentsChild.find((x) => x.key === '0');
    if (!grandpa) {
      this.parentsChild.push({
        key: '0',
        hasAccess: true,
        routerLink: node.routerLink,
      });
    }
    if (node.key) {
      let newKey = node.key.substring(0, node.key.length - 2);
      let foundKey = this.parentsChild.find((x) => x.key === newKey);
      if (!foundKey && newKey !== '' && newKey !== undefined) {
        this.parentsChild.push({
          key: newKey,
          hasAccess: true,
          routerLink: node.routerLink,
        });
      }
    }
  }

  checkNodes(pChild) {
    for (let i = 0; i < pChild.length; i++) {
      if (pChild[i].key && pChild[i].key.length > 2) {
        let newKey = pChild[i].key.substring(0, pChild[i].key.length - 2);
        let foundKey = this.parentsChild.find((x) => x.key === newKey);
        if (!foundKey && newKey !== '' && newKey !== undefined) {
          this.parentsChild.push({
            key: newKey,
            hasAccess: true,
            routerLink: pChild.routerLink,
          });
        }
      }
    }
    return this.parentsChild;
  }
  // #end check tree nodes
}
