export class Weighing {
  _id?: string;
  title: DataWeighing;
  summary: DataWeighing;
  body: DataWeighing;
  topic: DataWeighing;
  altPhoto: DataWeighing;
  url: DataWeighing;
}

export class DataWeighing {
  jsonLD: string;
  grapgQL: string;
  luck: string;
}
