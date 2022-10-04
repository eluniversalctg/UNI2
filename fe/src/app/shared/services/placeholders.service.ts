import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Placeholders } from '../models/placeholders.model';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class PlaceholdersService extends ResourceService<Placeholders> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'placeholders';
  }
}
