import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdatePurchaseItemsLotQuantity {
  @ApiProperty()
  @IsNumber()
  lot_quantity?: number;
}
