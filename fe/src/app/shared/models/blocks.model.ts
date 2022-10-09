import { Domains } from "./domain.model";

export class Blocks {
  _id?: string;
  name: string;
  sizes: string[];
  isActive?: boolean;
  inUse?: boolean;
  site: Domains
}
