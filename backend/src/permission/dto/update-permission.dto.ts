import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
