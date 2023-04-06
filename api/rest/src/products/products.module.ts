import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ProductsController,
  PopularProductsController,
} from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { File } from './entities/file.entity';
import { Variation } from './entities/variation.entity';
import { VariationOption } from './entities/variation-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, File, Variation, VariationOption]),
  ],
  controllers: [ProductsController, PopularProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
