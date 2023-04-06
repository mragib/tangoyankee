import { IsOptional } from 'class-validator';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';

export class GetTypesDto {
  @IsOptional()
  orderBy?: QueryTypesOrderByOrderByClause[];

  @IsOptional()
  text?: string;

  @IsOptional()
  language?: string;

  @IsOptional()
  search?: string;
}

export class QueryTypesOrderByOrderByClause {
  column: QueryTypesOrderByColumn;
  order: SortOrder;
}

export enum QueryTypesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
