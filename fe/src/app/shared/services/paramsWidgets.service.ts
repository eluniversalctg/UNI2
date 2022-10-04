import { ParamsWidgets } from '../models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';

@Injectable()
export class ParamsWidgetsService extends ResourceService<ParamsWidgets> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'matomoParams';
  }
}
