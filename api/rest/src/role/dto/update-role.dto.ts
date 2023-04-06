import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsString, MaxLength, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  updated_by: User;
}
