import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class UserService extends ResourceService<User> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'users';
  }
}
