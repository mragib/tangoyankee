import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderStatus extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  color: string;

  @Column()
  serial: number;

  @Column({ length: 100 })
  slug: string;

  @Column({ nullable: true })
  language?: string;

  @Column({ type: 'simple-array', nullable: true })
  translated_languages?: string[];
}
