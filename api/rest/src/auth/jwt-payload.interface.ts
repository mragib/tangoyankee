import { Role } from 'src/role/entities/role.entity';

export interface JwtPayload {
  email: string;
  is_active: boolean;
  role: any;
}
