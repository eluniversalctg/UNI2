import { Roles } from "./roles.model";

export class User {
  _id?: string;
  roles: Roles;
  jwt?: string;
  name?: string;
  phone?: string;
  email?: string;
  image?: string;
  state?: boolean;
  isActive?: boolean;
  username?: string;
  password: string;
  firtSurname: string;
  secondSurname: string;
}
