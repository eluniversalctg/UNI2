import { AppComponent } from './app.component';
import { UtilitiesService } from './shared/services';
import { AppMainComponent } from './app.main.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
  open: boolean = false;
  menu: any[];

  @ViewChild('input1') inputElement1: ElementRef;

  @ViewChild('input2') inputElement2: ElementRef;
  constructor(
    public app: AppComponent,
    public appMain: AppMainComponent,
    private utilities: UtilitiesService
  ) {}

  ngOnInit() {
    this.menu = [
      {
        label: 'Menu',
        items: [
          {
            label: 'UI Kit',
            icon: 'pi pi-align-left',
            items: [
              {
                label: 'Form Layout',
                icon: 'pi pi-id-card',
                routerLink: ['/uikit/formlayout'],
              },
              {
                label: 'Input',
                icon: 'pi pi-check-square',
                routerLink: ['/uikit/input'],
              },
            ],
          },
          {
            label: 'Hierarchy',
            icon: 'pi pi-align-left',
            items: [
              {
                label: 'Submenu 1',
                icon: 'pi pi-align-left',
                items: [
                  { label: 'Submenu 1.1', icon: 'pi pi-align-left' },
                  { label: 'Submenu 1.2', icon: 'pi pi-align-left' },
                ],
              },
              {
                label: 'Submenu 2',
                icon: 'pi pi-align-left',
                items: [{ label: 'Submenu 2.1', icon: 'pi pi-align-left' }],
              },
            ],
          },
        ],
      },
    ];
  }

  searchFocus(event) {
    if (this.appMain.search) {
      setTimeout(() => {
        this.inputElement1.nativeElement.focus();
        this.inputElement2.nativeElement.focus();
      }, 100);
    }
  }

  openLi(open: boolean) {
    this.open = open;
  }

  signOut() {
    this.utilities.logOut();
  }
}
