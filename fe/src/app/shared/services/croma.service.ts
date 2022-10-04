import { Croma } from '../models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
@Injectable()
export class CromaService extends ResourceService<Croma[]> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'croma';
  }
}
