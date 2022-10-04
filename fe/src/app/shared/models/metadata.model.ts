export class Metadata {
  id?: string;
  name: string;
  description: string;
  tags?: string[];
  systemTags?: string[];
  scope?: string;
  enabled?: boolean;
  missingPlugins?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
}
