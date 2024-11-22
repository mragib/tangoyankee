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
  NotFoundException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Sales')
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('admin', 'owner', 'manager', 'sales')
  create(@Body() createSaleDto: CreateSaleDto, @GetUser() user: User) {
    createSaleDto.created_by = user;
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.salesService.findAll();
  }

  @Get('soldByUser')
  @Roles('admin', 'owner', 'manager', 'sales')
  findAllSoldByUser(@GetUser() user: User) {
    return this.salesService.findAllSoldByUser(user);
  }

  @Get('delivery')
  findAllDelivery() {
    return this.salesService.findAllDelivery();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  async findOne(@Param('id') id: string) {
    const found = await this.salesService.findOne(+id);
    if (!found) throw new NotFoundException('Sale is not found');
    return found;
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @GetUser() user: User,
  ) {
    updateSaleDto.updated_by = user;

    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner', 'manager')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.salesService.removeSale(+id, user);
  }
}
