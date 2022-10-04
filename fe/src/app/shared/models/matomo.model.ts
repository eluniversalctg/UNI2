export class MatomoTags {
  _id?: string;
  name: string;
  description: string;
  customParameters?: CustomParams[];
  module: string;
  tag: string;
  columns: Columns[];
}
export class Columns {
  header: string;
  field: string;
}

export class CustomParams {
  parameter: string;
  value: string;
}
