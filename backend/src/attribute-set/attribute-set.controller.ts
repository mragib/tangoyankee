import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AttributeSetService } from './attribute-set.service';
import { CreateAttributeSetDto } from './dto/create-attribute-set.dto';

import { ApiTags } from '@nestjs/swagger';
import { UpdateAttributeSetDto } from './dto/update-attribute-set.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Attribute set')
@Controller('attribute-set')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttributeSetController {
  constructor(private readonly attributeSetService: AttributeSetService) {}

  @Post()
  @Roles('admin', 'owner', 'manager')
  create(
    @Body() createAttributeSetDto: CreateAttributeSetDto,
    @GetUser() user: User,
  ) {
    createAttributeSetDto.created_by = user;
    return this.attributeSetService.create(createAttributeSetDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.attributeSetService.findAll();
  }
  @Get()
  findAllNotUsed() {
    return this.attributeSetService.notUsed();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const found = await this.attributeSetService.findOne({ id });
    if (!found) throw new NotFoundException('Not Found');
    return found;
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  update(
    @Param('id') id: string,
    @Body() updateAttributeSetDto: UpdateAttributeSetDto,
    @GetUser() user: User,
  ) {
    updateAttributeSetDto.updated_by = user;
    return this.attributeSetService.update(+id, updateAttributeSetDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  remove(@Param('id') id: string) {
    return this.attributeSetService.remove(+id);
  }
}
