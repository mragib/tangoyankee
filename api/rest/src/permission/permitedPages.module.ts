import { Module } from '@nestjs/common';
import { PermitedPagesController } from './permitedPages.controller';
import { PermitedPagesService } from './permitedPages.service';

@Module({
  controllers: [PermitedPagesController],
  providers: [PermitedPagesService],
})
export class PermitedPagesModule {}
