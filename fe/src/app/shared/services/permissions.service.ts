import { Injectable } from '@angular/core';
import { UtilitiesService } from './utilities.service';

@Injectable()
export class PermissionsService {
  constructor(private utilities: UtilitiesService) {}

  /**
   * description: validate if the user have permissions
   * @param route - path
   * @returns Boolean: true, if you have permission
   */
  setPermissions(route: any) {
    let acces = false;
    // get user information.
    let user: any = this.utilities.getCurrentUser();
    let userRoles: any = user.roles.pages;

    // search if role pages match with the route
    userRoles.forEach((role: any) => {
      if (route === role.routerLink) {
        acces = true;
      }
    });

    return acces;
  }
}
