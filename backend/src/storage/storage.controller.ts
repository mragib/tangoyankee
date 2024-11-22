import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('storage')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @Roles('admin', 'owner', 'manager')
  create(@Body() createStorageDto: CreateStorageDto) {
    return this.storageService.create(createStorageDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.storageService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager', 'sales')
  findOne(@Param('id') id: string) {
    return this.storageService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  update(@Param('id') id: string, @Body() updateStorageDto: UpdateStorageDto) {
    return this.storageService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  remove(@Param('id') id: string) {
    return this.storageService.remove(+id);
  }
}
