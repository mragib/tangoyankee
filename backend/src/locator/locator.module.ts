import { Module } from '@nestjs/common';
import { LocatorService } from './locator.service';
import { LocatorController } from './locator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locator } from './entities/locator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Locator])],
  controllers: [LocatorController],
  providers: [LocatorService],
})
export class LocatorModule {}
