import { UserFields } from '../models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class UserFieldsService extends ResourceService<UserFields> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'usersFields';
  }

  exportUnomiFields() {
    return [
      {
        name: 'firstName',
        type: 'string',
        isRequired: true,
        canModify: false,
      },
      {
        name: 'lastName',
        type: 'string',
        isRequired: true,
        canModify: false,
      },
      {
        name: 'email',
        type: 'email',
        isRequired: true,
        canModify: false,
      },
      {
        name: 'gender',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'city',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'countryName',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'address',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'company',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'jobTitle',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'phoneNumber',
        type: 'string',
        isRequired: true,
        canModify: false,
      },
      {
        name: 'facebookId',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'twitterId',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'linkedInId',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
      {
        name: 'instagramId',
        type: 'string',
        isRequired: false,
        canModify: false,
      },
    ];
  }
}
