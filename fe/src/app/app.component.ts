import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { SpinnerService } from './shared/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  showSpinner: boolean = false;
  title = 'uni2_fe';

  inputStyle = 'outlined';

  ripple: boolean;

  theme = 'indigo';

  layoutColor = 'white';

  colorScheme = 'light';

  menuMode = 'slim';
  constructor(
    private spinnerService: SpinnerService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.ripple = true;
    this.spinnerService.showSpinner.subscribe((value) => {
      this.showSpinner = value;
    });
  }

  ngOnDestroy() {
    this.spinnerService.showSpinner.unsubscribe();
  }
}
