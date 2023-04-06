import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermitedPagesService } from './permitedPages.service';
import { CreatePermitedPagesDto } from './dto/create-permitedPages.dto';
import { UpdatepermitedPagesDto } from './dto/update-permitedPages.dto';

@Controller('permission')
export class PermitedPagesController {
  constructor(private readonly permitedPagesService: PermitedPagesService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermitedPagesDto) {
    return this.permitedPagesService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permitedPagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permitedPagesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatepermitedPagesDto,
  ) {
    return this.permitedPagesService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permitedPagesService.remove(+id);
  }
}
