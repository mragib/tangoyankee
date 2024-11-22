import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Permission } from 'src/permission/entities/permission.entity';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  permission: Permission[];

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
