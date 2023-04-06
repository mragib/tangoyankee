import { IsNumber, IsOptional } from 'class-validator';

export class GetPopularProductsDto {
  @IsOptional()
  type_slug?: string;

  @IsNumber()
  limit: number;

  @IsOptional()
  shop_id?: number;
}
