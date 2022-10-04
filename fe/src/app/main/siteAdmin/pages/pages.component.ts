import * as _ from 'lodash';
import {
  BlockService,
  PagesService,
  ExportService,
  DomainsService,
} from 'src/app/shared/services';
import { Component, ViewChild } from '@angular/core';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Domains, Pages, WizardModel } from 'src/app/shared/models';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  pages: Pages[];
  children: Pages;
  pageWithBlock: Pages;
  pagesActive: Pages[] = [];
  addNew: boolean = false;
  addingSon: boolean = false;
  duplicate: boolean = false;
  addBlock: boolean = false;
  viewBlockDialog: boolean = false;
  pagesUpdate: Pages = new Pages();
  pageDuplicate: Pages = new Pages();
  pageFatherDuplicate;
  isEditing: boolean = false;
  optionsSelected: boolean = true;
  options: any[];
  pagesForm: FormGroup;
  sections: any[];
  route: string;
  routeSons: string;
  items;
  @ViewChild('dt') dt;
  cols: any[] = [];
  selectedRows: any[] = [];
  domains: Domains[] = [];

  selectPageViewBlock: WizardModel[] = [];
  selectPageEditBlock: Pages;
  selectEditBlock: WizardModel;

  constructor(
    private msg: MessageService,
    private pagesService: PagesService,
    private exportService: ExportService,
    private domainService: DomainsService,
    private blockService: BlockService,
    private confirmationService: ConfirmationService
  ) {
    this.domainService.getList().subscribe({
      next: (data) => {
        this.domains = data;
      },
    });
    this.sections = [
      { name: 'Sección', value: 'Sección' },
      { name: 'Interna', value: 'Interna' },
    ];

    this.getAllPages();

    this.pagesForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      typeSection: new FormControl('', [Validators.required]),
      isActive: new FormControl('', [Validators.required]),
      route: new FormControl('', []),
      site: new FormControl('', [Validators.required]),
    });

    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];

    this.items = [
      {
        tooltipOptions: {
          tooltipLabel: 'Excel',
          tooltipPosition: 'top',
        },
        icon: 'pi pi-file-excel',
        command: () => {
          this.exportExcel();
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'CSV',
          tooltipPosition: 'top',
        },
        icon: 'pi pi-download',
        command: () => {
          this.exportCSV();
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'JSON',
          tooltipPosition: 'top',
        },
        icon: 'pi pi-angle-double-down',
        command: () => {
          this.exportJSON();
        },
      },
    ];
  }

  /**
   * The function takes the data from the form and pushes it into the wizardModel array. Then it updates
   * the pageWithBlock object and sends it to the server. After that, it updates the block object and
   * sets the pageWithBlock object to a new Pages object
   * @param saveWizard - the object that contains the data to be saved
   */
  emmit(saveWizard) {
    if (saveWizard != '') {
      if (!this.pageWithBlock.wizardModel) {
        this.pageWithBlock.wizardModel = [];
      }

      let found = this.pageWithBlock.wizardModel.find(
        (x) => x.block._id === saveWizard.block._id
      );
      if (found) {
        let index = this.pageWithBlock.wizardModel.findIndex(
          (x) => x.block._id === saveWizard.block._id
        );
        this.pageWithBlock.wizardModel.splice(index, 1);
      }

      this.pageWithBlock.wizardModel.push(saveWizard);

      this.pagesService.updateMany(this.pages, 'updateMany').subscribe({
        next: (data) => (
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.INSERTSUCCESS,
          }),
          this.updateBlock(saveWizard),
          (this.pageWithBlock = new Pages())
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          }),
      });
    }

    //close pop up
    this.addBlock = false;
    this.pageWithBlock = new Pages();
  }

  /**
   * It updates the block's inUse property to true and then sends the updated block to the server
   * @param data - The data object that is passed to the function.
   */
  updateBlock(data) {
    data.block.inUse = true;
    this.blockService.update(data.block).subscribe({
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.INSERTERROR,
        }),
    });
  }

  /**
   * This function is called when the user clicks the "Add Block" button on the page. It sets the
   * pageWithBlock variable to the page that the user is currently on, and sets the addBlock variable to
   * true
   * @param page - The page that the block will be added to.
   */
  addNewBlock(page) {
    this.pageWithBlock = new Pages();
    this.pageWithBlock = page;
    this.addBlock = true;
  }

  /**
   * description: open the modal to update page
   * @param page - the page selected
   */
  openUpdatePages(page: Pages) {
    this.reset();
    this.addNew = true;
    this.isEditing = true;
    this.pagesUpdate = page;

    this.pagesForm.patchValue({
      name: page.name,
      typeSection: page.typeSection,
      isActive: page.isActive,
      site: page.site,
    });
    this.route = page.route;
  }

  /**
   * It takes a page and a father as parameters, resets the form, sets the addNew and duplicate variables
   * to true, and sets the pageDuplicate and pageFatherDuplicate variables to the page and father
   * parameters
   * @param {Pages} page - Pages,father
   * @param father - the page that contains the page to be duplicated
   */
  duplicatePages(page: Pages, father) {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.duplicate = true;
    this.pageDuplicate = page;
    this.pageFatherDuplicate = father;

    //asigned data to the form
    this.pagesForm.patchValue({
      name: '',
      typeSection: page.typeSection,
      isActive: page.isActive,
      site: page.site,
    });
  }

  /**
   * description: open modal with form pages
   */
  createPages() {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.addingSon = false;
    this.pagesUpdate = new Pages();
  }

  /**
   * description: send request to backend, save a new page
   */
  register() {
    let control = this.pagesForm.controls;

    let page: Pages = {
      name: control.name.value,
      typeSection: control.typeSection.value,
      isActive: control.isActive.value,
      route: this.route,
      site: control.site.value,
    };

    if (this.addingSon) {
      if (!this.pagesUpdate.children) {
        this.pagesUpdate.children = [];
      }

      //add level
      page.level = this.pagesUpdate.level + 1;

      this.pagesUpdate.children.push(page);
      //update children
      this.update(this.pages);
    } else if (!this.isEditing) {
      if (this.duplicate) {
        if (this.pageDuplicate.level === 0) {
          page.children = this.pageDuplicate.children;
          page.level = this.pageDuplicate.level;
          page.wizardModel = this.pageDuplicate.wizardModel;

          this.save(page);
        } else {
          if (this.pageFatherDuplicate) {
            page.children = this.pageDuplicate.children;
            page.level = this.pageDuplicate.level;
            page.wizardModel = this.pageDuplicate.wizardModel;

            this.pageFatherDuplicate.children.push(page);
            this.update(this.pages);
          }
        }
      } else {
        //new is always dad that's why level 0
        page.level = 0;
        //add page
        this.save(page);
      }
    } else if (this.isEditing) {
      //change new data
      this.pagesUpdate.isActive = page.isActive;
      this.pagesUpdate.name = page.name;
      this.pagesUpdate.route = page.route;
      this.pagesUpdate.site = page.site;
      this.pagesUpdate.typeSection = page.typeSection;
      //update page
      this.update(this.pages);
    }
  }

  /**
   * description: reset form
   */
  reset() {
    this.duplicate = false;
    this.addingSon = false;
    this.isEditing = false;
    this.route = '';
    this.pagesForm.reset();
  }

  /**
   * description: get all pages
   */
  getAllPages() {
    this.pagesService.getList().subscribe(
      (response) => {
        this.pages = response;
        this.pagesActive = _.filter(response, ['isActive', true]);
        this.pagesActive = _.filter(response, ['typeSection', 'Sección']);
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  changeState(page: Pages) {
    let message = `¿Está seguro que desea ${
      page.isActive ? 'inactivar' : 'activar'
    } la página <b>
      ${page.name}
      </b>? <br/>La página seleccionada quedará ${
        page.isActive ? 'sin' : 'con'
      } función en la plataforma.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        let update = new Pages();

        update._id = page._id;
        update.isActive = !page.isActive;

        this.pagesService.update(update).subscribe(
          (data) => {
            if (page.isActive) {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PAGEACTIVATED,
              });
            } else {
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: MessagesTst.PAGEINACTIVATED,
              });
            }
            this.getAllPages();
          },
          (error) => {
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
   * description: save new page
   * @param page - the page
   */
  save(page: Pages) {
    let found;
    if (this.pages) {
      found = this.pages.find((x) => x.name === page.name);
    }
    if (!found) {
      this.pagesService.add(page).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.INSERTSUCCESS,
            });
            page = new Pages();
            this.reset();
            this.getAllPages();
            this.addNew = false;
          } else {
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.INSERTERROR,
            });
          }
        },
        (error) => {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          });
        }
      );
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.EXIST,
      });
    }
  }

  /**
   * description: update page selected
   * @param page - the page selected
   */
  update(page: Pages[]) {
    this.pagesService.updateMany(page, 'updateMany').subscribe(
      (data) => {
        if (data) {
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.UPDATESUCCESS,
          });
          this.reset();
          this.addNew = false;
          this.getAllPages();
          this.addNew = false;
        } else {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.INSERTERROR,
          });
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
  createRoute() {
    if (this.pagesForm.controls.father) {
      this.route =
        this.pagesForm.controls.father.value.route +
        '/' +
        this.pagesForm.controls.name.value.toLowerCase();
    }
  }

  addSonsPages(page) {
    this.addNew = true;
    this.addingSon = true;
    this.pagesUpdate = page;
    this.pagesForm.reset();
  }

  saveSons() {
    let update: any[] = [];
    this.children.route = this.routeSons;

    update.push(this.children);

    this.pagesService.updateMany(update, 'updateMany').subscribe({
      next: (data) => (
        this.getAllPages,
        this.reset(),
        this.msg.add({
          severity: MessagesTst.SUCCESS,
          summary: MessagesTst.UPDATESUCCESS,
        })
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORTAGSMA,
        }),
    });
  }

  /**
   * export data to JSON
   */
  exportJSON() {
    let dataExport: Pages[];

    if (this.selectedRows.length > 0) {
      dataExport = this.selectedRows;
    } else {
      dataExport = this.pages;
    }

    this.exportService.exportJSON(
      JSON.stringify(dataExport),
      `Reporte de páginas`
    );
  }

  /**
   * export data to excel
   */
  exportExcel() {
    let dataExport: Pages[];
    let childrens = '';
    let blocks = '';

    if (this.selectedRows.length > 0) {
      dataExport = JSON.parse(JSON.stringify(this.selectedRows));
    } else {
      dataExport = JSON.parse(JSON.stringify(this.pages));
    }
    if (dataExport.length > 0) {
      let reportExcel: any[] = [];
      dataExport.forEach((data) => {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          childrens = '';
          blocks = '';
          let item = data[keys[i]];
          if (Array.isArray(item)) {
            if (keys[i] === 'children') {
              item.forEach((children) => {
                childrens += `${children.name},`;
              });
              data[keys[i]] = childrens;
            }
            if (keys[i] === 'wizardModel') {
              item.forEach((block) => {
                blocks += `${block.block.name},`;
              });
              data[keys[i]] = blocks;
            }
          }
          if (keys[i] === 'site') {
            data[keys[i]] = item.name;
          }
        }
        reportExcel.push(data);
      });
      this.exportService.exportExcel(reportExcel, `Reporte de páginas`);
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: 'export',
      });
    }
  }

  /**
   * export data to CSV
   */
  exportCSV() {
    let dataExport: Pages[];
    let blocks = '';
    let childrens = '';

    if (this.selectedRows.length > 0) {
      dataExport = JSON.parse(JSON.stringify(this.selectedRows));
    } else {
      dataExport = JSON.parse(JSON.stringify(this.pages));
    }

    if (dataExport.length > 0) {
      let reportExcel: any[] = [];
      dataExport.forEach((data) => {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          childrens = '';
          blocks = '';
          let item = data[keys[i]];
          if (Array.isArray(item)) {
            if (keys[i] === 'children') {
              item.forEach((children) => {
                childrens += `${children.name},`;
              });
              data[keys[i]] = childrens;
            }
            if (keys[i] === 'wizardModel') {
              item.forEach((block) => {
                blocks += `${block.block.name},`;
              });
              data[keys[i]] = blocks;
            }
          }
          if (keys[i] === 'site') {
            data[keys[i]] = item.name;
          }
        }
        reportExcel.push(data);
      });

      let colums = Object.keys(reportExcel[0]);
      colums.forEach((col) => {
        let object = {
          field: col,
          header: col,
        };
        this.cols.push(object);
      });

      this.dt.exportCSV(reportExcel);
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: 'export',
      });
    }
  }

  viewBlock(page) {
    this.viewBlockDialog = true;
    this.selectPageEditBlock = page;
    this.selectPageViewBlock = page.wizardModel;
  }

  editBlock(block) {
    this.pageWithBlock = new Pages();
    this.pageWithBlock = this.selectPageEditBlock;
    this.selectEditBlock = new WizardModel();
    this.selectEditBlock = block;
    this.viewBlockDialog = false;
    this.addBlock = true;
  }
}
