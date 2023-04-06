import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Variation } from './variation.entity';

@Entity()
export class VariationOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne((type) => Variation, (variation) => variation.options)
  variation: Variation;
}
