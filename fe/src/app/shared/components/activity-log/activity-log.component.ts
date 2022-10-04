import { MessagesTst } from '../../enums';
import { MessageService } from 'primeng/api';
import { ActivityLogModel, LogModel } from '../../models';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivityLogService } from '../../services/activity-log.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
})
export class ActivityLogComponent {
  //#region Global Variables
  @ViewChild('dt') dt;
  logChange: LogModel[];
  @Input() screen: string;
  display: boolean = false;
  dataActivityLog: ActivityLogModel[];
  //#endregion

  constructor(
    private msg: MessageService,
    private activityLogService: ActivityLogService
  ) {}

  showDialog() {
    this.display = true;
    this.getActivityLog(this.screen);
  }

  getActivityLog(screen: string) {
    this.activityLogService.getList(`${screen}`).subscribe({
      next: (data) => (this.dataActivityLog = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.SAVEERROR,
        }),
    });
  }
}
