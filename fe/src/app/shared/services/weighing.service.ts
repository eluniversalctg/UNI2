import { Weighing } from '../models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class WeighingService extends ResourceService<Weighing> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'weighing';
  }
}
