import * as _ from 'lodash';
import { Blocks } from 'src/app/shared/models';
import { MessagesTst } from 'src/app/shared/enums';
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BlockService,
  ExportService,
  UtilitiesService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss'],
})
export class BlockComponent {
  blocks: Blocks[];
  blocksDataSource: Blocks[];
  children: Blocks;
  pagesActive: Blocks[] = [];
  addNew: boolean = false;
  blocksUpdate: Blocks;
  isEditing: boolean = false;
  optionsSelected: boolean = true;
  options: any[];
  blocksForm: FormGroup;
  route: string;
  routeSons: string;
  items;
  @ViewChild('dt') dt;
  cols: any[] = [];
  selectedRows: any[] = [];

  constructor(
    private msg: MessageService,
    private blockService: BlockService,
    private exportService: ExportService,
    private utilitiesSrv: UtilitiesService,
    private confirmationService: ConfirmationService
  ) {
    this.utilitiesSrv.changeSite.subscribe(() => {
      this.getAllBlocks();
    });

    if (this.utilitiesSrv.decryptSite()) {
      this.getAllBlocks();
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.NOSITE,
      });
    }

    this.blocksForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      sizes: new FormControl('', [Validators.required]),
      isActive: new FormControl('', [Validators.required]),
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
   * description: open the modal to update block
   * @param block - the block selected
   */
  openUpdateBlock(block: Blocks) {
    this.reset();
    this.addNew = true;
    this.isEditing = true;
    this.blocksUpdate = block;

    this.blocksForm.patchValue({
      isActive: block.isActive,
      name: block.name,
      sizes: block.sizes,
    });
  }

  duplicateBlock(block: Blocks) {
    this.reset();
    this.addNew = true;
    this.isEditing = false;

    this.blocksForm.patchValue({
      name: '',
      isActive: block.isActive,
      sizes: block.sizes,
    });
  }

  /**
   * description: open modal with form pages
   */
  createBlock() {
    this.reset();
    this.addNew = true;
    this.isEditing = false;
    this.blocksUpdate = new Blocks();
  }

  /**
   * description: send request to backend, save a new block
   */
  register() {
    if (!this.utilitiesSrv.decryptSite()) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: MessagesTst.NOSITE,
      });
    }
    let control = this.blocksForm.controls;
    for (let i = 0; i < control.sizes.value.length; i++) {
      const element = control.sizes.value[i];
      const testx = /^[0-9999]{1,16}x[0-9999]{1,16}$/.test(element);
      const testX = /^[0-9999]{1,16}X[0-9999]{1,16}$/.test(element);
      let splitter = '';
      if (element.includes('x')) {
        splitter = 'x';
      } else {
        splitter = 'X';
      }
      const split = element.split(splitter);
      if (isNaN(Number(split[0])) || isNaN(Number(split[1]))) {
        return this.msg.add({
          severity: MessagesTst.WARNING,
          summary: 'Los valores deben ser números',
        });
      }
      if (
        (!testx || !testX) &&
        (Number(split[0]) < 1 || Number(split[1]) < 1)
      ) {
        return this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.SISESNOVALID,
        });
      }
    }

    let block: Blocks = {
      name: control.name.value,
      sizes: control.sizes.value,
      isActive: control.isActive.value,
      site: this.utilitiesSrv.decryptSite(),
    };
    if (!this.isEditing) {
      this.save(block);
    } else {
      if (this.blocksUpdate) {
        if (!this.blocksUpdate.inUse || block.isActive) {
          this.update(block);
        } else {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORINUSE,
          });
        }
      }
    }
  }

  /**
   * description: reset form
   */
  reset() {
    this.blocksForm.reset();
  }

  /**
   * description: get all pages
   */
  getAllBlocks() {
    this.blockService.getList().subscribe(
      (response) => {
        response = response.filter(
          (x) =>
            x.site._id.toString() ===
            this.utilitiesSrv.decryptSite()._id.toString()
        );
        this.blocks = response;
        this.pagesActive = _.filter(response, ['isActive', true]);
        this.pagesActive = _.filter(response, ['typeSection', 'Sección']);
        this.filterDataSource();
      },
      () => {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        });
      }
    );
  }

  filterDataSource() {
    this.blocksDataSource = this.blocks.filter(
      (x) => x.isActive === this.optionsSelected
    );
  }

  changeState(block: Blocks) {
    let message = `¿Está seguro que desea ${
      block.isActive ? 'inactivar' : 'activar'
    } el bloque <b>
      ${block.name}
      </b>? <br/>El bloque seleccionado quedará ${
        block.isActive ? 'sin' : 'con'
      } función en la plataforma.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        if (!block.inUse) {
          let update = new Blocks();

          update._id = block._id;
          update.isActive = !block.isActive;

          this.blockService.update(update).subscribe(
            (data) => {
              if (block.isActive) {
                this.msg.add({
                  severity: MessagesTst.SUCCESS,
                  summary: MessagesTst.BLOCKINACTIVATED,
                });
              } else {
                this.msg.add({
                  severity: MessagesTst.SUCCESS,
                  summary: MessagesTst.BLOCKACTIVATED,
                });
              }
              this.getAllBlocks();
            },
            (error) => {
              this.msg.add({
                severity: MessagesTst.ERROR,
                summary: MessagesTst.CHANGESTATE,
              });
            }
          );
        } else {
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORINUSE,
          });
        }
      },
    });
  }

  /**
   * description: save new block
   * @param block - the block
   */
  save(block: Blocks) {
    block.inUse = false;
    let found;
    if (this.blocks) {
      found = this.blocks.find((x) => x.name === block.name);
    }
    if (!found) {
      this.blockService.add(block).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.INSERTSUCCESS,
            });
            block = new Blocks();
            this.reset();
            this.getAllBlocks();
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
        summary: MessagesTst.BLOCKEXIST,
      });
    }
  }

  /**
   * description: update block selected
   * @param block - the block selected
   */
  update(block: Blocks) {
    block._id = this.blocksUpdate._id;
    let found = this.blocks.find((x) => x.name === block.name);
    if (!found || found.name === this.blocksUpdate.name) {
      this.blockService.update(block).subscribe(
        (data) => {
          if (data) {
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            });
            block = new Blocks();
            this.reset();
            this.addNew = false;
            this.getAllBlocks();
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
        summary: MessagesTst.BLOCKEXIST,
      });
    }
  }

  /**
   * export data to JSON
   */
  exportJSON() {
    let dataExport: Blocks[];

    if (this.selectedRows.length > 0) {
      dataExport = this.selectedRows;
    } else {
      dataExport = this.blocks;
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
    let dataExport: Blocks[];

    if (this.selectedRows.length > 0) {
      dataExport = JSON.parse(JSON.stringify(this.selectedRows));
    } else {
      dataExport = JSON.parse(JSON.stringify(this.blocks));
    }
    if (dataExport.length > 0) {
      let reportExcel: any[] = [];
      dataExport.forEach((data) => {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          let item = data[keys[i]];
          if (Array.isArray(item)) {
            data[keys[i]] = item.join(',');
          }
        }
        reportExcel.push(data);
      });
      this.exportService.exportExcel(reportExcel, `Reporte de bloques`);
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
    let dataExport: Blocks[];

    if (this.selectedRows.length > 0) {
      dataExport = JSON.parse(JSON.stringify(this.selectedRows));
    } else {
      dataExport = JSON.parse(JSON.stringify(this.blocks));
    }

    if (dataExport.length > 0) {
      let reportExcel: any[] = [];
      dataExport.forEach((data) => {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          let item = data[keys[i]];
          if (Array.isArray(item)) {
            data[keys[i]] = item.join(',');
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
}

/*
/^[1-9999]{1,16}X[1-9999]{1,16}$/
*/
