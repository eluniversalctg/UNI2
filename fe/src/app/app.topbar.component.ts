import { Component } from '@angular/core';
import { Domains } from './shared/models';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { DomainsService, UtilitiesService } from './shared/services';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  sites: Domains[] = []
  site: Domains = new Domains();

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
