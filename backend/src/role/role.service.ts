import { Injectable } from '@nestjs/common';

import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService extends AbstractService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }
}
