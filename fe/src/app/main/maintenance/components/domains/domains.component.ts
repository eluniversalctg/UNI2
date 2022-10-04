import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesTst } from 'src/app/shared/enums';
import { Domains } from 'src/app/shared/models';
import { DomainsService } from 'src/app/shared/services';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
})
export class DomainsComponent {
  domains: Domains[] = [];
  addNew: boolean = false;
  domainForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private msg: MessageService,
    private domainService: DomainsService,
    private confirmationService: ConfirmationService
  ) {
    this.domainForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      domain: ['', Validators.required],
      idSite: ['', Validators.required],
    });

    //get saved widget parameters
    this.domainService.getList().subscribe({
      next: (data) => (this.domains = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });

    // get domains saved
    this.getDomain();
  }

  /**
   * get domains from mongoDB
   */
  getDomain() {
    this.domainService.getList().subscribe({
      next: (data) => (this.domains = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }

  /**
   * save and update the domains
   */
  saveDomain() {
    if (this.domainForm.value._id) {
      // update widget
      this.domainService.update(this.domainForm.value).subscribe({
        next: () => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.resetDomain(),
          this.getDomain()
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          }),
      });
    } else {
      //validate if domain is already exist
      let findDomain = this.domains.find((x) =>
        x.domain.includes(this.domainForm.controls.domain.value)
      );
      //validate if name is already exist
      let findName = this.domains.find(
        (x) =>
          x.name.toUpperCase() ===
          this.domainForm.controls.name.value.toUpperCase()
      );

      if (findDomain || findName) {
        return this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.DOMAINEXIST,
        });
      }

      // save domain
      this.domainService.add(this.domainForm.value).subscribe({
        next: () => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.resetDomain(),
          this.getDomain()
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          }),
      });
    }
  }

  /**
   * load domain into deopdown
   * @param value domain
   */
  editDomain(value: Domains) {
    this.domainForm.controls._id.setValue(value._id);
    this.domainForm.controls.name.setValue(value.name);
    this.domainForm.controls.domain.setValue(value.domain);
    this.domainForm.controls.idSite.setValue(value.idSite);
    this.addNew = true;
  }

  /**
   * delete domain selected
   * @param value domain
   */
  deleteDomain(value: Domains) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el dominio?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        this.domainService.delete(value._id || '').subscribe({
          next: () => (
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.DELETESUCCESS,
            }),
            this.getDomain()
          ),

          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.DELETEERROR,
            }),
        });
      },
    });
  }

  /**
   * open dialog to add  or edit
   */
  createDomain() {
    this.resetDomain();
    this.addNew = true;
  }

  /**
   * reset dialog information
   */
  resetDomain() {
    this.domainForm.reset();
    this.addNew = false;
  }
}
