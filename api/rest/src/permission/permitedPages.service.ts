import { Injectable } from '@nestjs/common';
import { CreatePermitedPagesDto } from './dto/create-permitedPages.dto';
import { UpdatepermitedPagesDto } from './dto/update-permitedPages.dto';

@Injectable()
export class PermitedPagesService {
  create(createPermissionDto: CreatePermitedPagesDto) {
    return 'This action adds a new permission';
  }

  findAll() {
    return `This action returns all permission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatepermitedPagesDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
