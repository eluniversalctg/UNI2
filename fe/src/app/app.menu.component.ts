import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { MenuService } from './core/services';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[];

  constructor(public app: AppMainComponent, private menuService: MenuService) {}
  ngOnInit() {
    this.model = this.menuService.getMenu();
  }
}
