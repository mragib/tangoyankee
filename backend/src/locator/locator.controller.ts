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
import { LocatorService } from './locator.service';
import { CreateLocatorDto } from './dto/create-locator.dto';
import { UpdateLocatorDto } from './dto/update-locator.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('locator')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Locator')
export class LocatorController {
  constructor(private readonly locatorService: LocatorService) {}

  @Post()
  @Roles('admin', 'owner', 'manager')
  create(@Body() createLocatorDto: CreateLocatorDto, @GetUser() user: User) {
    createLocatorDto.created_by = user;
    return this.locatorService.create(createLocatorDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.locatorService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  findOne(@Param('id') id: string) {
    return this.locatorService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  update(
    @Param('id') id: string,
    @Body() updateLocatorDto: UpdateLocatorDto,
    @GetUser() user: User,
  ) {
    updateLocatorDto.updated_by = user;
    return this.locatorService.update(+id, updateLocatorDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  remove(@Param('id') id: string) {
    return this.locatorService.remove(+id);
  }
}
