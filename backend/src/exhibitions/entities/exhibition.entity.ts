import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExhibitionStatus } from '../../common/enums/exhibition-status.enum';
import { Industry } from '../../common/enums/industry.enum';

@Entity('exhibitions')
export class Exhibition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  title: { tj: string; ru: string; en: string };

  @Column({ type: 'json', nullable: true })
  description: { tj: string; ru: string; en: string };

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true, default: 'Tajikistan' })
  country: string;

  @Column({ type: 'enum', enum: Industry, nullable: true })
  industry: Industry;

  @Column({ type: 'enum', enum: ExhibitionStatus, default: ExhibitionStatus.DRAFT })
  status: ExhibitionStatus;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  mapImage: string;

  @Column({ type: 'json', nullable: true })
  gallery: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
