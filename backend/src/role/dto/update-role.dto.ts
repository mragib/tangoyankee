import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
