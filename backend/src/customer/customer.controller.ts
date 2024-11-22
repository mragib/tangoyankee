import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerStatus } from './dto/update-customer-status.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Customers')
@Controller('customer')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Roles('admin', 'owner', 'manager', 'sales')
  create(@Body() createCustomerDto: CreateCustomerDto, @GetUser() user: User) {
    createCustomerDto.created_by = user;
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  findOne(@Param('id') id: string) {
    return this.customerService.findOneById(+id);
  }

  @Get('phone/:id')
  @Roles('admin', 'owner', 'manager', 'sales')
  findOneByPhone(@Param('id') id: string) {
    return this.customerService.findAllByPhone(id);
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @GetUser() user: User,
  ) {
    updateCustomerDto.updated_by = user;
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Patch('status/:id')
  @Roles('admin', 'owner', 'manager', 'sales')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateCustomerStatus: UpdateCustomerStatus,
  ) {
    await this.findOne(id);

    return await this.customerService.updateStatus(+id, updateCustomerStatus);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  async remove(@Param('id') id: string) {
    const customer = await this.findOne(id);
    if (!customer) throw new NotFoundException('Customer is not found');
    return this.customerService.remove(+id);
  }
}
