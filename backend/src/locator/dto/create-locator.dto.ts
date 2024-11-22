import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateLocatorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsEmpty()
  created_by: User;
}
