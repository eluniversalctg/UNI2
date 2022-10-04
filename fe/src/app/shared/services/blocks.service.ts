import { Blocks } from '../models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';
@Injectable()
export class BlockService extends ResourceService<Blocks> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'blocks';
  }
}
