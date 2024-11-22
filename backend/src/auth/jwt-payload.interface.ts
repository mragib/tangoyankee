import { Role } from 'src/role/entities/role.entity';

export interface JwtPayload {
  username: string;
  userId: number;
  role: Role;
}
