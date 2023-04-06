import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}
  async create(createRoleDto: CreateRoleDto, user: User) {
    createRoleDto.created_by = user;
    return await this.roleRepo.save(createRoleDto);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepo.find();
  }

  async findOne(id: number) {
    return await this.roleRepo.findOneBy({ id });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, user: User) {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException('Role is not found');
    }
    updateRoleDto.updated_by = user;
    await this.roleRepo.update(id, updateRoleDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.roleRepo.delete(id);
  }
}
