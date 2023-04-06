import { IsOptional } from 'class-validator';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { Category } from '../entities/category.entity';

export class CategoryPaginator extends Paginator<Category> {
  data: Category[];
}

export class GetCategoriesDto extends PaginationArgs {
  @IsOptional()
  orderBy?: QueryCategoriesOrderByColumn;
  @IsOptional()
  sortedBy?: SortOrder;
  @IsOptional()
  search?: string;
  @IsOptional()
  parent?: number | string = 'null';
  @IsOptional()
  language?: string;
}

export enum QueryCategoriesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
