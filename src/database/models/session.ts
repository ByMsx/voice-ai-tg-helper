import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISession } from '@grammyjs/storage-typeorm';

@Entity()
export class Session extends BaseEntity implements ISession {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('varchar')
  key!: string;

  @Column('text')
  value!: string;
}
