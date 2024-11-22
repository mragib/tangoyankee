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
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Attribute')
@Controller('attribute')
@UseInterceptors(ClassSerializerInterceptor)
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('admin', 'owner', 'manager')
  create(
    @Body() createAttributeDto: CreateAttributeDto,
    @GetUser() user: User,
  ) {
    createAttributeDto.created_by = user;
    createAttributeDto.storage.created_by = user;
    return this.attributeService.create(createAttributeDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.attributeService.findAll();
    // return this.attributeService.findAllForSearch();
  }

  @Get('productWithLastPurchasePrice')
  @Roles('admin', 'owner', 'manager', 'sales')
  attributesWithLastPurchasePrice() {
    return this.attributeService.getAllAttributesWithLastPurchasePrice();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  async findOne(@Param('id') id: string) {
    const found = await this.attributeService.findOne({ id });
    if (!found) throw new NotFoundException('Product is not found');
    return found;
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
    @GetUser() user: User,
  ) {
    updateAttributeDto.updated_by = user;
    return this.attributeService.update(+id, updateAttributeDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner', 'manager')
  remove(@Param('id') id: string) {
    return this.attributeService.remove(+id);
  }
}
