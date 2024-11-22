import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { UpdateSupplierStatusDto } from './dto/update-supplier-status.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('supplier')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Roles('admin', 'owner', 'manager')
  create(@Body() createSupplierDto: CreateSupplierDto, @GetUser() user: User) {
    createSupplierDto.created_by = user;
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  async findOne(@Param('id') id: string) {
    const supplier = await this.supplierService.findOne(+id);
    if (!supplier) throw new NotFoundException('Supplier is not found');
    return supplier;
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @GetUser() user: User,
  ) {
    await this.findOne(id);

    updateSupplierDto.updated_by = user;

    return await this.supplierService.update(+id, updateSupplierDto);
  }

  @Patch('status/:id')
  @Roles('admin', 'owner', 'manager')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateSupplierStatusDto: UpdateSupplierStatusDto,
    @GetUser() user: User,
  ) {
    await this.findOne(id);
    updateSupplierStatusDto.updated_by = user;
    return await this.supplierService.updateStatus(
      +id,
      updateSupplierStatusDto,
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.supplierService.remove(+id);
  // }
}
