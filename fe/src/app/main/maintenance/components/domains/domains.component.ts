import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesTst } from 'src/app/shared/enums';
import { Domains } from 'src/app/shared/models';
import { DomainsService, UtilitiesService } from 'src/app/shared/services';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
})
export class DomainsComponent {
  domains: Domains[] = [];
  addNew: boolean = false;
  isEditing: boolean = false;
  domainForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private msg: MessageService,
    private domainService: DomainsService,
    private utilitiesSrv: UtilitiesService,
    private confirmationService: ConfirmationService
  ) {
    this.domainForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      domain: ['', Validators.required],
      idSite: ['', Validators.required],
      matomoUrl: ['', Validators.required],
      cromaUrl: ['', Validators.required],
    });

    //get saved widget parameters
    this.domainService.getList().subscribe({
      next: (data) => (this.domains = data),
      error: (err) =>
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
    const testDomain =
      /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g.test(
        this.domainForm.controls.domain.value
      );

    const testCroma =
      /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g.test(
        this.domainForm.controls.cromaUrl.value
      );

    const testMatomo =
      /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g.test(
        this.domainForm.controls.matomoUrl.value
      );

    if (!testDomain) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'El link del domino no es válido.',
      });
    }
    if (!testMatomo) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'El link de matomo no es válido.',
      });
    }
    if (!testCroma) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'El link de croma no es válido.',
      });
    }

    if (this.domainForm.value._id) {
      // update widget
      this.domainService.update(this.domainForm.value).subscribe({
        next: () => (
          this.utilitiesSrv.domainsUpdatedOrCreated(),
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
          this.utilitiesSrv.domainsUpdatedOrCreated(),
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
    this.domainForm.controls.matomoUrl.setValue(value.matomoUrl);
    this.domainForm.controls.cromaUrl.setValue(value.cromaUrl);
    this.addNew = true;
    this.isEditing = true;
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
            this.utilitiesSrv.domainsUpdatedOrCreated(),
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
    this.isEditing = false;
  }

  /**
   * reset dialog information
   */
  resetDomain() {
    this.domainForm.reset();
    this.addNew = false;
  }
}
