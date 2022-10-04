import { Variable } from '../models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';

@Injectable()
export class VariableService extends ResourceService<Variable> {
  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'variable';
  }

  systemTags() {
    return [
      { header: 'allowMultipleInstances', field: 'allowMultipleInstances' },
      { header: 'availableToEndUser', field: 'availableToEndUser' },
      { header: 'condition', field: 'condition' },
      { header: 'contactProfileProperties', field: 'contactProfileProperties' },
      { header: 'demograpchic', field: 'demograpchic' },
      { header: 'event', field: 'event' },
      { header: 'eventCondition', field: 'eventCondition' },
      { header: 'logical', field: 'logical' },
      { header: 'profileCondition', field: 'profileCondition' },
      { header: 'profileProperties', field: 'profileProperties' },
      { header: 'profileTags', field: 'profileTags' },
      { header: 'properties', field: 'properties' },
      { header: 'sessionCondition', field: 'sessionCondition' },
      { header: 'sourceEventCondition', field: 'sourceEventCondition' },
    ];
  }
}
