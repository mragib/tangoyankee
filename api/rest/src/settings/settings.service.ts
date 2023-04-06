import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
// import settingsJson from '@db/settings.json';

// const settings = plainToClass(Setting, settingsJson);

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto) {
    return await this.settingRepo.save(createSettingDto);
  }

  async findAll() {
    return this.settingRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    return this.settingRepo.update(id, updateSettingDto);
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
