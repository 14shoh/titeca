import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exhibition } from './exhibition.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('exhibition_participants')
export class ExhibitionParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  exhibitionId: string;

  @ManyToOne(() => Exhibition, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exhibitionId' })
  exhibition: Exhibition;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
