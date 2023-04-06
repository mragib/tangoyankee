import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { HasPermission } from 'src/auth/has-permission.decorator';
import { UrlGuard } from 'src/auth/url.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(JwtAuthGuard, UrlGuard)
  @Post()
  @HasPermission('create_role')
  create(@Body() createRoleDto: CreateRoleDto, @GetUser() user: User) {
    return this.roleService.create(createRoleDto, user);
  }

  @UseGuards(JwtAuthGuard, UrlGuard)
  @HasPermission('view_role')
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, UrlGuard)
  @HasPermission('update_role')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @GetUser() user: User,
  ) {
    return this.roleService.update(+id, updateRoleDto, user);
  }

  @UseGuards(JwtAuthGuard, UrlGuard)
  @HasPermission('delete_role')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
