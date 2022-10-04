import { Injectable } from '@angular/core';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private utilitiesService: UtilitiesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.utilitiesService.isAuthenticated()) {
      this.router.navigate(['/authentication/login']);
    }

    return true;
  }
}
