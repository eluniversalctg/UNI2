import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
@Injectable()
export class RuleService extends ResourceService<any> {

  getResourceUrl(): string {
    return 'rule';
  }

  getOperators() {
    return [
      {
        id: 'equals',
        value: 'equals',
        posible: ['string', 'integer', 'email'],
      },
      {
        id: 'notEquals',
        value: 'notEquals',
        posible: ['string', 'integer', 'email'],
      },
      {
        id: 'lessThan',
        value: 'lessThan',
        posible: ['integer', 'date'],
      },
      {
        id: 'greaterThan',
        value: 'greaterThan',
        posible: ['integer', 'date'],
      },
      {
        id: 'lessThanOrEqualTo',
        value: 'lessThanOrEqualTo',
        posible: ['integer', 'date'],
      },
      {
        id: 'greaterThanOrEqualTo',
        value: 'greaterThanOrEqualTo',
        posible: ['integer', 'date'],
      },
      {
        id: 'between',
        value: 'between',
        posible: ['integer', 'date'],
      },
      {
        id: 'startsWith',
        value: 'startsWith',
        posible: ['string', 'email'],
      },
      {
        id: 'endsWith',
        value: 'endsWith',
        posible: ['string', 'email'],
      },
      {
        id: 'matchesRegex',
        value: 'matchesRegex',
        posible: ['string', 'email'],
      },
      {
        id: 'contains',
        value: 'contains',
        posible: ['string', 'email'],
      },
      {
        id: 'exists',
        value: 'exists',
        posible: [
          'Condition',
          'date',
          'integer',
          'string',
          'char',
          'booleano',
          'double',
          'float',
        ],
      },
      {
        id: 'missing',
        value: 'missing',
        posible: [
          'Condition',
          'date',
          'integer',
          'string',
          'char',
          'booleano',
          'double',
          'float',
        ],
      },
      {
        id: 'all',
        value: 'all',
        posible: [
          'Condition',
          'date',
          'integer',
          'string',
          'char',
          'booleano',
          'double',
          'float',
        ],
      },
      {
        id: 'in',
        value: 'in',
        posible: ['string', 'integer', 'email'],
      },
      {
        id: 'notIn',
        value: 'notIn',
        posible: ['string', 'integer', 'email'],
      },
      {
        id: 'isDay',
        value: 'isDay',
        posible: ['date'],
      },
      {
        id: 'isNotDay',
        value: 'isNotDay',
        posible: ['date'],
      },
    ];
  }

  getOperatorsBoolean() {
    return [
      { value: 'and', id: 'and' },
      { value: 'or', id: 'or' },
    ];
  }
}
