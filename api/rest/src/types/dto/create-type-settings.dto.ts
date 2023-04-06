import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Type } from '../entities/type.entity';

export class CreateTypeSettingsDto {
  @IsBoolean()
  isHome: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  layoutType: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  productCard: string;

  @IsNotEmpty()
  type: Type;
}
