import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';
import { QueryUsersOrderByColumn } from 'src/common/enums/common.enum';

import { User } from '../entities/user.entity';

export class UserPaginator extends Paginator<User> {
  data: User[];
}

export class GetUsersDto extends PaginationArgs {
  @IsOptional()
  @IsEnum(QueryUsersOrderByColumn)
  orderBy?: QueryUsersOrderByColumn;

  @IsOptional()
  @IsEnum(SortOrder)
  sortedBy?: SortOrder;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
