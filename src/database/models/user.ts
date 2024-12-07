import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'bigint', nullable: false })
  telegramUserId!: string;

  @Column({ type: 'text', nullable: true })
  username!: string | null;

  @Column({ type: 'text' })
  firstName!: string;

  @Column({ type: 'integer', default: 0 })
  requestsCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
