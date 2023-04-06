import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength } from 'class-validator';
import { Type } from '../entities/type.entity';
import { CreateTypeSettingsDto } from './create-type-settings.dto';

export class UpdateTypeSettings extends PartialType(CreateTypeSettingsDto) {
  @IsBoolean()
  isHome?: boolean;

  @IsString()
  @MaxLength(100)
  layoutType?: string;

  @IsString()
  @MaxLength(100)
  productCard?: string;

  type?: Type;
}
