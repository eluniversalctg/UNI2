import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { WeighingService } from 'src/app/shared/services';
import { DataWeighing, Weighing } from 'src/app/shared/models';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
@Component({
  selector: 'app-weighing',
  templateUrl: './weighing.component.html',
  styleUrls: ['./weighing.component.scss'],
})
export class WeighingComponent {
  weighing: Weighing;
  constructor(
    private msg: MessageService,
    private weighingService: WeighingService
  ) {
    this.weighing = {
      title: new DataWeighing(),
      summary: new DataWeighing(),
      body: new DataWeighing(),
      topic: new DataWeighing(),
      altPhoto: new DataWeighing(),
      url: new DataWeighing(),
    };
    this.getAllWeighing();
  }

  getAllWeighing() {
    this.weighingService.getList().subscribe({
      next: (data) =>
        (this.weighing = data.length > 0 ? data[0] : this.weighing),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }

  save() {
    let total =
      Number(this.weighing.altPhoto.luck) +
      Number(this.weighing.body.luck) +
      Number(this.weighing.summary.luck) +
      Number(this.weighing.title.luck) +
      Number(this.weighing.topic.luck) +
      Number(this.weighing.url.luck);
    if (total === 100) {
      this.weighingService.update(this.weighing).subscribe({
        next: () =>
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.UPDATESUCCESS,
          }),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.SAVEERROR,
          }),
      });
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERROWEIGHING,
      });
    }
  }
}
