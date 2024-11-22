import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryDto } from './create-delivery.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsNumberString,
} from 'class-validator';
import { DeliveryStatus } from 'src/common/common.enums';

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {
  @IsDateString()
  @IsNotEmpty()
  deliveryDate?: string;

  @IsNotEmpty()
  @IsEnum(DeliveryStatus)
  deliveryStatus?: DeliveryStatus;

  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsNumberString()
  deliveryCharge?: number;
}
