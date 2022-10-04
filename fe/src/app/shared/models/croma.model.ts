export class Croma {
  _id: string;
  title: string;
  summary: string;
  text: string;
  publish_date: Date;
  url: string;
  author: Array<any[]>;
  keywords: Array<any[]>;
  categories: Array<any[]>;
  matomo?: Array<any[]>;
  publication: string;
  pub_art_id: string;
  related_articles?: any;
  similar_words?: any;
}
