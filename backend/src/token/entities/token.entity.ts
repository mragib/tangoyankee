import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column('text')
  token: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expired_at: Date;
}
