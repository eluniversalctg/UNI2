import { Metadata, Variable } from './index';

export class Actions {
  actionExecutor?: string;
  parameters: Variable[];
  metadata?: Metadata = new Metadata();
  id?: string;
  name?: string;
  description?: string;
  tags?: string[];
  systemTags?: string[];
  version?: number;
}
