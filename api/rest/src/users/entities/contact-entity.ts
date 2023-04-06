import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ConnectBelongsTo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  connect: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
