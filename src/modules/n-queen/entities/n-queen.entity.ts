import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProcessStatus } from '../../../shared/enums/process-status.enum';

@Entity()
export class NQueen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'number_of_queens',
    type: 'int',
  })
  numberOfQueens: number;

  @Column({
    name: 'total_time_to_process',
    type: 'float',
    nullable: true,
  })
  totalTimeToProcess?: number;

  @Column({
    type: 'enum',
    enum: ProcessStatus,
    default: ProcessStatus.PENDING,
  })
  status: ProcessStatus;

  @Column({
    type: 'json',
    nullable: true,
  })
  result: JSON;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}
