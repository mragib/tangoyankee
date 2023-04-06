import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  created_by: User;

  @IsOptional()
  updated_by: User;
}
