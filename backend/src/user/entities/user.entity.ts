import * as bcrypt from 'bcrypt';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/role/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  first_name: string;

  @Column()
  @Exclude()
  last_name: string;

  @Exclude()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  phone: string;

  @Exclude()
  @Column()
  address: string;

  @Exclude()
  @Column({ default: false })
  isBlocked: boolean;

  @Column()
  @Exclude()
  salt: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  page_name: string;

  @Column({ nullable: true })
  business_address: string;

  @Exclude()
  @CreateDateColumn()
  createdat: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedat: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  @Expose()
  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  @ManyToOne(() => Role, (item) => item.user, { eager: true })
  role: Role;
}
