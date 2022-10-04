import { Injectable } from '@angular/core';
import { Roles } from 'src/app/shared/models';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class RolesService extends ResourceService<Roles> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'roles';
  }
}
