import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataWeighing, Weighing } from 'src/app/shared/models';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { UtilitiesService, WeighingService } from 'src/app/shared/services';
@Component({
  selector: 'app-weighing',
  templateUrl: './weighing.component.html',
  styleUrls: ['./weighing.component.scss'],
})
export class WeighingComponent {
  weighing: Weighing;
  constructor(
    private msg: MessageService,
    private utilitiesSrv: UtilitiesService,
    private weighingService: WeighingService
  ) {
    this.reset();
    this.utilitiesSrv.changeSite.subscribe(() => {
      this.reset();
      this.getAllWeighing();
    });

    if (this.utilitiesSrv.decryptSite()) {
      this.getAllWeighing();
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.NOSITE,
      });
    }

  }

  reset() {
    this.weighing = {
      title: new DataWeighing(),
      summary: new DataWeighing(),
      body: new DataWeighing(),
      topic: new DataWeighing(),
      altPhoto: new DataWeighing(),
      url: new DataWeighing(),
      site: this.utilitiesSrv.decryptSite()
    };
  }
  getAllWeighing() {
    this.weighingService.getList().subscribe({
      next: (data) => {
        data = data.filter((x) => x.site.toString() === this.utilitiesSrv.decryptSite()._id.toString());
        this.weighing = data.length > 0 ? data[0] : this.weighing;
      },
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
      if (this.weighing._id){
        this.weighingService.update(this.weighing).subscribe({
          next: () =>
            (this.getAllWeighing(),
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.UPDATESUCCESS,
            })),
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.SAVEERROR,
            }),
        });
      } else {
        this.weighingService.add(this.weighing).subscribe({
          next: () => (
            this.getAllWeighing(),
            this.msg.add({
              severity: MessagesTst.SUCCESS,
              summary: MessagesTst.SAVESUCCESS,
            })
          ),
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.SAVEERROR,
            }),
        });
      }
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.ERROWEIGHING,
      });
    }
  }
}
