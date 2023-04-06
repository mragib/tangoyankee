import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lng: number;

  @Column({ nullable: true })
  city?: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  zip?: string;

  @Column()
  formattedAddress: string;
}
