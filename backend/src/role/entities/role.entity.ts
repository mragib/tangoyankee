import { Permission } from 'src/permission/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => User, (item) => item.role)
  user: User[];

  @ManyToMany(() => Permission, (item) => item.role)
  @JoinTable({ name: 'role_permissions' })
  permission: Permission[];
}
