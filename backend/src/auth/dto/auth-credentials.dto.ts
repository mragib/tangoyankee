import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  old_password: string;

  @IsString()
  new_password: string;
}
