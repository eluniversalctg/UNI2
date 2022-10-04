import { Widgets } from '../models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';

@Injectable()
export class WidgetsService extends ResourceService<Widgets> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'widgets';
  }
}
