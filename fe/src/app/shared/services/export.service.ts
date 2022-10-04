import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable()
export class ExportService {
  exportExcel(data: any, filename: string) {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);

      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };

      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      this.saveAsExcelFile(excelBuffer, filename);
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    let EXCEL_EXTENSION = '.xlsx';

    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });

    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  exportJSON(buffer: any, fileName: string): void {
    let EXTENSION = '.json';

    const data: Blob = new Blob([buffer], {
      type: 'text/plain',
    });

    FileSaver.saveAs(data, fileName + EXTENSION);
  }
}
