import { Injectable } from '@nestjs/common';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceDto } from './dto/update-instance.dto';
import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Instance } from './entities/instance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstanceService extends AbstractService {
  constructor(
    @InjectRepository(Instance)
    private readonly instanceRepository: Repository<Instance>,
  ) {
    super(instanceRepository);
  }
}
