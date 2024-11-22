import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesItemDto } from './create-sales_item.dto';

export class UpdateSalesItemDto extends PartialType(CreateSalesItemDto) {}
