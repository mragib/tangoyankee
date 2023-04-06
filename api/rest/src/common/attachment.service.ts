import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { Attachment } from './entities/attachment.entity';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
  ) {}

  async find() {
    return await this.attachmentRepo.find();
  }
  async findone(id: number) {
    return await this.attachmentRepo.findOneBy({ id });
  }
  async create(createAttachmentDto: CreateAttachmentDto) {
    const attachment = plainToClass(Attachment, createAttachmentDto);
    return await this.attachmentRepo.save(attachment);
  }

  async update(id: number, data: any): Promise<Attachment> {
    try {
      const file = await this.attachmentRepo.update(id, data);
      return await this.findone(id);
    } catch (e) {
      throw new InternalServerErrorException('update falied');
    }
  }

  async remove(id: number) {
    return await this.attachmentRepo.delete(id);
  }
}
