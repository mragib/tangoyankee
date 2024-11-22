import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeSet } from './entities/attribute-set.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';

@Injectable()
export class AttributeSetService extends AbstractService {
  constructor(
    @InjectRepository(AttributeSet)
    private readonly attributeSetRepo: Repository<AttributeSet>,
  ) {
    super(attributeSetRepo);
  }
  async notUsed() {
    const data = await this.attributeSetRepo
      .createQueryBuilder('as')
      .leftJoinAndSelect('as.instance', 'ai')
      .where('ai.id IS NULL') // Check for no associated instances
      .getMany();
    return data;
  }
}
