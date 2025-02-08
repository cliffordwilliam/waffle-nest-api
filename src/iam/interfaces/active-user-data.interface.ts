import { Role } from 'src/users/enums/role.enum';

export interface ActiveUserData {
  sub: number; // user ID
  email: string;
  role: Role;
}
