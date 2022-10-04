import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class SpinnerService {
  @Output() showSpinner: EventEmitter<boolean> = new EventEmitter(false);

  setStatus(status: boolean): void {
    this.showSpinner.emit(status);
  }
}
