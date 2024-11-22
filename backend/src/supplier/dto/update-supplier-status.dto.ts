import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateSupplierStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  status: boolean;

  @IsOptional()
  updated_by?: User;
}
