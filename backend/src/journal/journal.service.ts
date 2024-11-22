import { Injectable } from '@nestjs/common';

import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JournalService extends AbstractService {
  constructor(
    @InjectRepository(Journal)
    private readonly journalRepository: Repository<Journal>,
  ) {
    super(journalRepository);
  }
}
