import { IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { Product } from '../entities/product.entity';

export class ProductPaginator extends Paginator<Product> {
  data: Product[];
}

export class GetProductsDto extends PaginationArgs {
  @IsOptional()
  orderBy?: string;

  @IsOptional()
  sortedBy?: string;

  @IsOptional()
  searchJoin?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  date_range?: string;

  @IsOptional()
  language?: string;
}

export enum QueryProductsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
