import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  bank: string;
}
