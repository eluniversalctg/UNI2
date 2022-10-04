export class Roles {
  _id?: string;
  name: string;
  pages: PagesRol[];
  isActive: boolean;
}

export class PagesRol {
  key: string;
  hasAccess: boolean;
  routerLink: string;
}
