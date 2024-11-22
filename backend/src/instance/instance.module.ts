import { Module } from '@nestjs/common';
import { InstanceService } from './instance.service';
import { InstanceController } from './instance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instance } from './entities/instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instance])],
  controllers: [InstanceController],
  providers: [InstanceService],
})
export class InstanceModule {}
