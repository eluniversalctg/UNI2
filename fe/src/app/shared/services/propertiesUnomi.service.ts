import { Injectable } from '@angular/core';
import { PropertiesUnomi } from '../models';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class PropertiesUnomiService extends ResourceService<PropertiesUnomi> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'properties-unomi';
  }
}
