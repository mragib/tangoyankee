import { Injectable } from '@nestjs/common';
import { CreateLocatorDto } from './dto/create-locator.dto';
import { UpdateLocatorDto } from './dto/update-locator.dto';
import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Locator } from './entities/locator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocatorService extends AbstractService {
  constructor(
    @InjectRepository(Locator)
    private readonly locatorRepository: Repository<Locator>,
  ) {
    super(locatorRepository);
  }
}
