import { ActivityLogModel } from '../models';
import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';

@Injectable()
export class ActivityLogService extends ResourceService<ActivityLogModel> {
  getResourceUrl(): string {
    return 'activityLog';
  }
}
