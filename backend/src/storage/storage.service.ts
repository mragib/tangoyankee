import { UpdateAttributeDto } from './../attribute/dto/update-attribute.dto';
import { Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './entities/storage.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UpdateStoke } from './dto/update-stoke.dto';

@Injectable()
export class StorageService extends AbstractService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {
    super(storageRepository);
  }

  async findAll(): Promise<any[]> {
    const storage: Storage[] = await this.storageRepository.find({
      relations: ['p_attribute'],
    });
    return this.transformToDto(storage);
  }

  async create(createStorageDto: CreateStorageDto): Promise<any> {
    return await this.storageRepository.save(createStorageDto);
  }

  async update(id: number, updateAttributeDto: UpdateStorageDto): Promise<any> {
    return await this.storageRepository.save({ id, ...updateAttributeDto });
  }

  async updateStoke(
    id: number,
    updateStoke: UpdateStoke,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      // Use queryRunner's manager to update if it's provided
      return await queryRunner.manager.update(Storage, id, updateStoke);
    } else {
      // Fallback to normal repository update if no QueryRunner is passed
      return await this.storageRepository.update(id, updateStoke);
    }
  }

  private transformToDto(storage: Storage[]) {
    const transforData = storage.map((item) => {
      return {
        ...item,
        name: `${item.p_attribute.product.name}-${item.p_attribute.instance.map((i) => i.name).join('-')}`,
        p_attribute: {
          name: `${item.p_attribute.product.name}-${item.p_attribute.instance.map((i) => i.name).join('-')}`,
          unit: item.p_attribute.product.unit,
        },
      };
    });

    return transforData;
  }
}
