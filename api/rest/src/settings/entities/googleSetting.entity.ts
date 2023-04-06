import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoogleSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: false })
  isEnable: boolean;

  @Column()
  tagManagerId: string;
}
