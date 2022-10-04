import { User } from '.';

export interface ActivityLogModel {
  user: User;
  date: Date;
  screen: string;
  log: LogModel[];
}

export class LogModel {
  label: string;
  newValue: string;
  previousValue: string;
  action: string;
}
