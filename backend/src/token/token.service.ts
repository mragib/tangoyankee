import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async save(body) {
    return this.tokenRepository.save(body);
  }

  async findOne(condition) {
    return this.tokenRepository.findOneBy(condition);
  }

  async delete(condition) {
    return await this.tokenRepository.delete(condition);
  }
}
