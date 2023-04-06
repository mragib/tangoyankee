import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeSettingsDto } from './dto/create-type-settings.dto';
import { UpdateTypeSettings } from './dto/update-type-setting.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TypeSettings } from './entities/type-settings.entity';

@Injectable()
export class TypeSettingsService {
  constructor(
    @InjectRepository(TypeSettings)
    private readonly typeSettingRepo: Repository<TypeSettings>,
  ) {}

  async create(
    createTypeSettingsDto: CreateTypeSettingsDto,
  ): Promise<TypeSettings> {
    const typeSetting = await this.typeSettingRepo.save(createTypeSettingsDto);

    return typeSetting;
  }

  async update(id: number, data: UpdateTypeSettings) {
    const file = await this.typeSettingRepo.update(id, data);
    return file;
  }
}
