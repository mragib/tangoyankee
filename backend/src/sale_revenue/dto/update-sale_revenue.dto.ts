import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleRevenueDto } from './create-sale_revenue.dto';
import { User } from 'src/user/entities/user.entity';
import { IsOptional } from 'class-validator';

export class UpdateSaleRevenueDto extends PartialType(CreateSaleRevenueDto) {
  @IsOptional()
  updated_by?: User;
}
