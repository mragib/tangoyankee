import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PermitedPages } from 'src/permission/entities/permitedPages.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@Entity()
export class Role extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.role)
  user: User[];

  @ManyToMany(() => PermitedPages, (permission) => permission.role, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  permitted_page: PermitedPages[];
}
