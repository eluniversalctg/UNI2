import { Injectable } from '@angular/core';
import { Domains } from '../models/domain.model';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class DomainsService extends ResourceService<Domains> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'domains';
  }
}
