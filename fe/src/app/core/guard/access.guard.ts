import {
  Router,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { PermissionsService } from 'src/app/shared/services/permissions.service';

@Injectable()
export class AccesGuard implements CanActivate {
  constructor(
    private router: Router,
    private permissionsService: PermissionsService
  ) {}

  /**
   * validate permission of access
   * @param route - get param in the path
   * @param state - get path
   * @returns true, if you have permission
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url = state.url;
    let param = Object.values(route.params)[0];

    //if the route has parameters it deletes them
    if (param) url = url.replace(`/${param}`, '');

    //get the permission
    let permissions = this.permissionsService.setPermissions(url);

    if (permissions) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
