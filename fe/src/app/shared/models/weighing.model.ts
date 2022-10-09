import { Domains } from "./domain.model";

export class Weighing {
  _id?: string;
  title: DataWeighing;
  summary: DataWeighing;
  body: DataWeighing;
  topic: DataWeighing;
  altPhoto: DataWeighing;
  url: DataWeighing;
  site: Domains
}

export class DataWeighing {
  jsonLD: string;
  grapgQL: string;
  luck: string;
}
