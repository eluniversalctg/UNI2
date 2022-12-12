import { Domains } from './shared/models';
import { AppComponent } from './app.component';
import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { DomainsService, UtilitiesService } from './shared/services';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit{
  sites: Domains[] = []
  site: Domains = new Domains();
  menu: any[];

  constructor(
    public app: AppComponent,
    public appMain: AppMainComponent,
    private utilities: UtilitiesService,
    private domainsService: DomainsService
  ) {
    this.getDomains();
    this.utilities.domainsChanged.subscribe(()=> {
      this.getDomains();
      this.site = new Domains();
      this.site.name = 'Seleccione un sitio';
    });
    this.getSite();
  }

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

  getDomains() {
    this.domainsService.getList().subscribe({
      next: (data) => { this.sites = data; }
    });
  }
  /**
   * Gets site info from local storage
   */
  getSite() {
    this.site = this.utilities.decryptSite() ? this.utilities.decryptSite() : new Domains();
    this.site.name = !this.site.name ? 'Seleccione un sitio' : this.site.name;
  }

  /**
   * Set selected site lo local storage
   * @param site site to set into local storage
   */
  setSite(site) {
    this.utilities.setSite(site);
    this.getSite();
  }

  /* A function that is called when the user clicks on the logout button. */
  signOut() {
    this.utilities.logOut();
  }
}
