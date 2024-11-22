import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupplierPaymentPlanService } from './supplier-payment-plan.service';
import { CreateSupplierPaymentPlanDto } from './dto/create-supplier-payment-plan.dto';
import { UpdateSupplierPaymentPlanDto } from './dto/update-supplier-payment-plan.dto';

@Controller('supplier-payment-plan')
export class SupplierPaymentPlanController {
  constructor(
    private readonly supplierPaymentPlanService: SupplierPaymentPlanService,
  ) {}

  @Post()
  create(@Body() createSupplierPaymentPlanDto: CreateSupplierPaymentPlanDto) {
    return this.supplierPaymentPlanService.create(createSupplierPaymentPlanDto);
  }

  @Get()
  findAll() {
    return this.supplierPaymentPlanService.findAll();
  }

  @Get('supplier-due-date')
  supplierDueDate() {
    return this.supplierPaymentPlanService.suppliersDueDate();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierPaymentPlanService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierPaymentPlanDto: UpdateSupplierPaymentPlanDto,
  ) {
    return this.supplierPaymentPlanService.update(
      +id,
      updateSupplierPaymentPlanDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierPaymentPlanService.remove(+id);
  }
}
