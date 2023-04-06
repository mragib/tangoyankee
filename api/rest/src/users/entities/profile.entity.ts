import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Attachment, {
    nullable: true,
    cascade: true,
  })
  avatar?: Attachment;

  @Column({
    nullable: true,
  })
  bio?: string;

  @OneToOne((type) => User, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: User;

  @Column({
    nullable: true,
  })
  contact?: string;

  @OneToMany((type) => Social, (social) => social.profile, {
    cascade: true,
    nullable: true,
  })
  socials?: Social[];
}

@Entity()
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  link: string;

  @OneToOne((type) => Profile, (profile) => profile.socials)
  profile?: Profile;
}
