import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { Tag } from '../entities/tag.entity';
import { IsOptional } from 'class-validator';

export class TagPaginator extends Paginator<Tag> {
  data: Tag[];
}

export class GetTagsDto extends PaginationArgs {
  @IsOptional()
  orderBy?: QueryTagsOrderByColumn;
  @IsOptional()
  sortedBy?: SortOrder;
  @IsOptional()
  text?: string;
  @IsOptional()
  name?: string;
  @IsOptional()
  hasType?: string;
  @IsOptional()
  language?: string;
  @IsOptional()
  search?: string;
}

export enum QueryTagsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
