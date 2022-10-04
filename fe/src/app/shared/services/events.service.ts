import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable()
//TODO cambiar tipo de datos de any a event
export class EventsService extends ResourceService<any> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'events';
  }
}
