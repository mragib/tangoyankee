import { Attachment } from 'src/common/entities/attachment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from './type.entity';

@Entity()
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title?: string;

  @Column({ length: 100 })
  description?: string;

  @OneToOne(() => Attachment, (item) => item.banner, {
    eager: true,
    onDelete: 'CASCADE',
  })
  image: Attachment;

  @ManyToOne(() => Type, (item) => item.banners, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: Type;
}
