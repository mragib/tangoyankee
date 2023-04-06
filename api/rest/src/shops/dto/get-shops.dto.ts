import { IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { Paginator } from 'src/common/dto/paginator.dto';
import { Shop } from '../entities/shop.entity';

export class ShopPaginator extends Paginator<Shop> {
  data: Shop[];
}

export class GetShopsDto extends PaginationArgs {
  @IsOptional()
  orderBy?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  sortedBy?: string;

  @IsOptional()
  is_active?: boolean;
}
