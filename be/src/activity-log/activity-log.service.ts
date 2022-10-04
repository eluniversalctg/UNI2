import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { ActivityLogRepository } from './activity-log.repository';
import { CreateActivityLogDto, LogModel } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(private readonly activityLogRep: ActivityLogRepository) {}

  async getActivityLog(screen: string) {
    try {
      return await this.activityLogRep.find({ screen: screen }, '');
    } catch (error) {
      return undefined;
    }
  }

  async createActivityLog(createActivityLogDto: CreateActivityLogDto) {
    try {
      return await this.activityLogRep.create(createActivityLogDto);
    } catch (error) {
      return undefined;
    }
  }

  /**
   * is used when edit a record
   * @param newObject
   * @param lastObject
   * @param screen
   * @returns
   */
  public registerLog(newObject, lastObject) {
    try {
      const idUser = newObject.log ? newObject.log.userId : newObject.userId;
      const screen = newObject.log ? newObject.log.screen : newObject.screen;
      const action = newObject.log ? newObject.log.action : newObject.action;
      const idObject = newObject.log
        ? newObject.log.objectModified
        : newObject.objectModified;
      delete newObject.userId;
      delete newObject.screen;
      delete newObject.action;
      delete newObject.Condition;
      delete newObject.objectModified;
      delete newObject.conditionString;
      delete newObject.secConditionString;
      delete newObject.firstCondition;
      delete newObject.log;
      let changes: any[] = [];

      const oldColumns = this.getColumns(lastObject, newObject);
      const newColumns = this.getColumns(newObject, lastObject);
      const columns = _.union(oldColumns, newColumns);

      changes = this.findChanges(columns, lastObject, newObject, action);

      return this.createActivityLog({
        user: idUser,
        screen: screen,
        objectModified: idObject,
        log: changes,
        date: Date.now(),
      });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * extract columns of profiles
   * @returns array of columns to export
   */
  getColumns(lastObject, newObject) {
    try {
      const obj = [this.filter(newObject, lastObject)];
      const columns: any[] = [];
      for (let i = 0; i < obj.length; i++) {
        const element = obj[i];
        const headers = this.propertiesToArray(element);
        columns.push(headers);
      }
      const indexOfLongestArray = columns.reduce((acc, arr, idx) => {
        return arr.length > columns[acc].length ? idx : acc;
      }, 0);
      return columns[indexOfLongestArray];
    } catch (error) {
      return error;
    }
  }

  /**
   * filter properties of object to find differences
   * @param obj1 object to compare
   * @param obj2 object2 to compare
   * @returns object with differences
   */
  filter(obj1, obj2) {
    try {
      const result = {};
      for (const key in obj1) {
        if (obj2[key] != obj1[key]) {
          result[key] = obj1[key];
        }
        if (Array.isArray(obj2[key]) && Array.isArray(obj1[key])) {
          result[key] = this.filter(obj1[key], obj2[key]);
        }
        if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
          result[key] = this.filter(obj1[key], obj2[key]);
        }
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  /**
   * get paths of properties
   * @param obj object to extract  properties
   * @returns paths of properties
   */
  propertiesToArray(obj) {
    try {
      const isObject = (val) =>
        val && typeof val === 'object' && !Array.isArray(val);

      const addDelimiter = (a, b) => (a ? `${a}.${b}` : b);

      const paths = (obj = {}, head = '') => {
        return Object.entries(obj).reduce((product, [key, value]) => {
          const fullPath = addDelimiter(head, key);
          return isObject(value)
            ? product.concat(paths(value, fullPath))
            : product.concat(fullPath);
        }, []);
      };

      return paths(obj);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * find differences between objects to create log
   * @param columns the different columns that have the objectscolumns
   * @param lastObject object to compare
   * @param newObject object to compare
   * @param action action to register as created, updated
   * @returns array of changes
   */
  findChanges(columns, lastObject, newObject, action) {
    try {
      const changes: LogModel[] = [];
      columns.forEach((element: string) => {
        const newValue = _.get(newObject, element);
        const lastValue = _.get(lastObject, element);
        if (newValue !== lastValue) {
          changes.push({
            label: element,
            previousValue: lastValue ? lastValue : '',
            newValue: newValue ? newValue : '',
            action: action,
          });
        }
      });
      return changes;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
