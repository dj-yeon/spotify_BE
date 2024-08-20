import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { Subscription } from 'src/users/entity/subscription.entity';

@Entity('prices')
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: true })
  active: boolean | null;

  @Column({ type: 'varchar', nullable: true })
  currency: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  interval: string | null;

  @Column({ type: 'integer', nullable: true })
  interval_count: number | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any | null;

  @Column({ type: 'integer', nullable: true })
  trial_period_days: number | null;

  @Column({ type: 'varchar', nullable: true })
  type: string | null;

  @Column({ type: 'integer', nullable: true })
  unit_amount: number | null;

  @ManyToOne(() => Product, (product) => product.prices)
  product: Product;

  @OneToMany(() => Subscription, (subscription) => subscription.price)
  subscriptions: Subscription[];
}
