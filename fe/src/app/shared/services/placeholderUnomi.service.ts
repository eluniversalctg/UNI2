import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlaceholderUnomi } from '../models/placeholderUnomi.model';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
export class PlaceholderUnomiService extends ResourceService<PlaceholderUnomi> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'placeholder-unomi';
  }
}
