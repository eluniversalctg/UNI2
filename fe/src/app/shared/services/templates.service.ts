import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../models/template.model';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class TemplateService extends ResourceService<Template> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'templates';
  }
}
