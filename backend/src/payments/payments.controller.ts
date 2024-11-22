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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentFromSupplier } from './dto/create-payment-from-supplier.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('admin', 'owner', 'manager')
  create(@Body() createPaymentDto: CreatePaymentDto, @GetUser() user: User) {
    createPaymentDto.created_by = user;
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('make-payment')
  @Roles('admin', 'owner', 'manager')
  makePaymentFromSupplier(
    @Body() paymentFromSupplierDto: CreatePaymentFromSupplier,
    @GetUser() user: User,
  ) {
    paymentFromSupplierDto.created_by = user;
    return this.paymentsService.makePaymentFromSupplier(paymentFromSupplierDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @GetUser() user: User,
  ) {
    updatePaymentDto.updated_by = user;
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
