import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { DeliveryAction, DeliveryStatus } from 'src/common/common.enums';

export class CreateDeliveryDto {
  @IsDateString()
  @IsNotEmpty()
  deliveryDate: string;

  @IsNotEmpty()
  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;

  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;

  @IsNotEmpty()
  @IsEnum(DeliveryAction)
  action: DeliveryAction;

  @IsNotEmpty()
  @IsNumberString()
  deliveryCharge: number;
}
