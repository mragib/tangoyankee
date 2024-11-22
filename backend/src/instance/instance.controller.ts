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
import { InstanceService } from './instance.service';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceDto } from './dto/update-instance.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('instance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Instance')
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}

  @Post()
  @Roles('admin', 'owner', 'manager')
  create(@Body() createInstanceDto: CreateInstanceDto, @GetUser() user: User) {
    createInstanceDto.created_by = user;
    return this.instanceService.create(createInstanceDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.instanceService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager')
  findOne(@Param('id') id: string) {
    return this.instanceService.findOne({ id });
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  update(
    @Param('id') id: string,
    @Body() updateInstanceDto: UpdateInstanceDto,
    @GetUser() user: User,
  ) {
    updateInstanceDto.updated_by = user;
    return this.instanceService.update(+id, updateInstanceDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner', 'manager')
  remove(@Param('id') id: string) {
    return this.instanceService.remove(+id);
  }
}
