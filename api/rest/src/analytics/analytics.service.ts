import { Injectable } from '@nestjs/common';
import analyticsJson from '@db/analytics.json';
import { plainToClass } from 'class-transformer';
import { Analytics } from './entities/analytics.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const analytics = plainToClass(Analytics, analyticsJson);

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private readonly analyticesRepo: Repository<Analytics>,
  ) {}

  async findAll() {
    return await this.analyticesRepo.find();
  }
}
