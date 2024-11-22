import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateStoke {
  @ApiProperty()
  @IsNumber()
  quantity?: number;

  @ApiProperty()
  @IsNumber()
  lot_quantity?: number;
}
