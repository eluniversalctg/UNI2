import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Personalization } from '../models/personalization.model';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class PersonalizationService extends ResourceService<Personalization> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'personalization';
  }
}
