import { Entity, Column, ManyToOne } from 'typeorm';
import { UsersModel } from './users.entity';
import { Price } from 'src/posts/entity/price.entity';
import { IsEmail, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class Subscription extends BaseModel {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column({
    unique: true,
  })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: stringValidationMessage })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  status: string | null;

  @Column({ type: 'timestamp', nullable: true })
  cancel_at: Date | null;

  @Column({ type: 'boolean', nullable: true })
  cancel_at_period_end: boolean | null;

  @Column({ type: 'timestamp', nullable: true })
  canceled_at: Date | null;

  @Column({ type: 'timestamp' })
  created: Date;

  @Column({ type: 'timestamp' })
  current_period_end: Date;

  @Column({ type: 'timestamp' })
  current_period_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  ended_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any | null;

  @Column({ type: 'integer', nullable: true })
  quantity: number | null;

  @Column({ type: 'timestamp', nullable: true })
  trial_end: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  trial_start: Date | null;

  @ManyToOne(() => UsersModel, (user) => user.subscriptions)
  user: UsersModel;

  @ManyToOne(() => Price, (price) => price.subscriptions)
  price: Price;
}
