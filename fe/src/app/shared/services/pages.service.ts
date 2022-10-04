import { Injectable } from '@angular/core';
import { Pages } from '../models/pages.model';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class PagesService extends ResourceService<Pages> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'pages';
  }
}
