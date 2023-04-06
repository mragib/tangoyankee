import { Body, Controller, Get, Post } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Controller('Attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}
  @Post()
  create(@Body() createAttachmentDto: CreateAttachmentDto) {
    return this.attachmentService.create(createAttachmentDto);
  }
  @Get()
  findAll() {
    return this.attachmentService.find();
  }
}
