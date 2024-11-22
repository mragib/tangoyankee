import { Controller, Get, Post, Body } from '@nestjs/common';
import { SalesItemsService } from './sales_items.service';
import { CreateSalesItemDto } from './dto/create-sales_item.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sales Items')
@Controller('sales-items')
export class SalesItemsController {
  constructor(private readonly salesItemsService: SalesItemsService) {}

  @Post()
  create(@Body() createSalesItemDto: CreateSalesItemDto) {
    return this.salesItemsService.create(createSalesItemDto);
  }

  @Get()
  findAll() {
    return this.salesItemsService.findAll();
  }

  // @Get('productSales')
  // productSales() {
  //   const startDate = new Date();
  //   return this.salesItemsService.datewiseProductSales(startDate);
  // }
}
