import { Component } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
  currentDate = new Date().getFullYear();
  constructor(public app: AppComponent) {}
}
