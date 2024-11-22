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
import { SaleRevenueService } from './sale_revenue.service';
import { CreateSaleRevenueDto } from './dto/create-sale_revenue.dto';
import { UpdateSaleRevenueDto } from './dto/update-sale_revenue.dto';
import { CreatePaymentFromCustomerDto } from './dto/create-payment-from-customer.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Sale Revenue')
@Controller('sale-revenue')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SaleRevenueController {
  constructor(private readonly saleRevenueService: SaleRevenueService) {}

  @Post()
  @Roles('admin', 'owner', 'manager', 'sales')
  create(
    @Body() createSaleRevenueDto: CreateSaleRevenueDto,
    @GetUser() user: User,
  ) {
    createSaleRevenueDto.created_by = user;
    return this.saleRevenueService.create(createSaleRevenueDto);
  }

  @Post('pay-bills')
  @Roles('admin', 'owner', 'manager', 'sales')
  payBills(
    @Body() createPaymentFromCustomerDto: CreatePaymentFromCustomerDto,
    @GetUser() user: User,
  ) {
    createPaymentFromCustomerDto.created_by = user;
    return this.saleRevenueService.payFromCustomer(
      createPaymentFromCustomerDto,
    );
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.saleRevenueService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  findOne(@Param('id') id: string) {
    return this.saleRevenueService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  update(
    @Param('id') id: string,
    @Body() updateSaleRevenueDto: UpdateSaleRevenueDto,
    @GetUser() user: User,
  ) {
    updateSaleRevenueDto.updated_by = user;
    return this.saleRevenueService.update(+id, updateSaleRevenueDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  remove(@Param('id') id: string) {
    return this.saleRevenueService.remove(+id);
  }
}
