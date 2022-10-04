import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';
import { TemplatePersonalization } from '../models/templatePersonalization.model';

@Injectable()
export class TemplatePersonalizationService extends ResourceService<TemplatePersonalization> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'template-personalization';
  }
}
