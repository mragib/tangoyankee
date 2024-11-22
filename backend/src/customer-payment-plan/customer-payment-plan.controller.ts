import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerPaymentPlanService } from './customer-payment-plan.service';
import { CreateCustomerPaymentPlanDto } from './dto/create-customer-payment-plan.dto';
import { UpdateCustomerPaymentPlanDto } from './dto/update-customer-payment-plan.dto';

@Controller('customer-payment-plan')
// @UseInterceptors(ClassSerializerInterceptor)
export class CustomerPaymentPlanController {
  constructor(
    private readonly customerPaymentPlanService: CustomerPaymentPlanService,
  ) {}

  @Post()
  create(@Body() createCustomerPaymentPlanDto: CreateCustomerPaymentPlanDto) {
    return this.customerPaymentPlanService.create(createCustomerPaymentPlanDto);
  }

  @Get()
  findAll() {
    return this.customerPaymentPlanService.findAll();
  }

  @Get('customer-due-date')
  customerDueDate() {
    return this.customerPaymentPlanService.customersDueDate();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerPaymentPlanService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerPaymentPlanDto: UpdateCustomerPaymentPlanDto,
  ) {
    return this.customerPaymentPlanService.update(
      +id,
      updateCustomerPaymentPlanDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerPaymentPlanService.remove(+id);
  }
}
