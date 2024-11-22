import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Product')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @Roles('admin', 'owner', 'manager')
  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    createProductDto.created_by = user;
    return this.productService.create(createProductDto);
  }

  @Roles('admin', 'owner', 'manager', 'sales')
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Roles('admin', 'owner', 'manager', 'sales')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const found = await this.productService.findOne({ id });
    if (!found) throw new NotFoundException('Product is not found');
    return found;
  }

  @Roles('admin', 'owner', 'manager')
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    updateProductDto.updated_by = user;
    return this.productService.update(+id, updateProductDto);
  }

  @Roles('admin', 'owner', 'manager')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
