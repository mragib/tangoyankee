import { Controller, Get, Post, Body } from '@nestjs/common';
import { PurchaseItemsService } from './purchase_items.service';
import { CreatePurchaseItemDto } from './dto/create-purchase_item.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Purchase Items')
@Controller('purchase-items')
export class PurchaseItemsController {
  constructor(private readonly purchaseItemsService: PurchaseItemsService) {}

  @Post()
  create(@Body() createPurchaseItemDto: CreatePurchaseItemDto) {
    return this.purchaseItemsService.create(createPurchaseItemDto);
  }

  @Get()
  findAll() {
    return this.purchaseItemsService.findAll();
  }

  @Get('productBuyingPrice')
  findProductBuyingPrice() {
    return this.purchaseItemsService.findProductBuyingPrice();
  }
}
