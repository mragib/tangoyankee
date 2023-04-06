import { CoreEntity } from 'src/common/entities/core.entity';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File extends CoreEntity {
  @PrimaryGeneratedColumn()
  attachment_id: number;

  @Column()
  url: string;

  @Column()
  fileable_id: number;
}
