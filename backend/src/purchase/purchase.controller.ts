import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('purchase')
@ApiTags('Purchase')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @Roles('admin', 'owner', 'manager')
  create(@Body() createPurchaseDto: CreatePurchaseDto, @GetUser() user: User) {
    createPurchaseDto.created_by = user;
    return this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.purchaseService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(+id, updatePurchaseDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.purchaseService.removePurchase(+id, user);
  }
}
