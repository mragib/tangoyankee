import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { GetTypesDto } from './dto/get-types.dto';
import { ApiTags } from '@nestjs/swagger';
import { HasPermission } from 'src/auth/has-permission.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UrlGuard } from 'src/auth/url.guard';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('Types')
@UseGuards(JwtAuthGuard, UrlGuard)
@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @HasPermission('create_type')
  @Post()
  create(@Body() createTypeDto: CreateTypeDto, @GetUser() user: User) {
    const { name } = createTypeDto;

    createTypeDto.slug = name.toLowerCase();

    return this.typesService.create(createTypeDto, user);
  }

  @HasPermission('view_type')
  @Get()
  findAll(@Query() query: GetTypesDto) {
    return this.typesService.getTypes(query);
  }

  @HasPermission('view_type')
  @Get(':slug')
  getTypeBySlug(@Param('slug') slug: string) {
    return this.typesService.getTypeBySlug(slug);
  }

  @HasPermission('update_type')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTypeDto: UpdateTypeDto,
    @GetUser() user: User,
  ) {
    const { name } = updateTypeDto;

    updateTypeDto.slug = name.toLowerCase();
    return this.typesService.update(+id, updateTypeDto, user);
  }

  @HasPermission('delete_type')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typesService.remove(+id);
  }
}
