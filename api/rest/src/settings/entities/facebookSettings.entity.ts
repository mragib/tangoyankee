import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FacebookSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isEnable: boolean;

  @Column()
  appId: string;

  @Column()
  pageId: string;
}
