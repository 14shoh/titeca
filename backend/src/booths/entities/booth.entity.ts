import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exhibition } from '../../exhibitions/entities/exhibition.entity';
import { BoothStatus } from '../../common/enums/booth-status.enum';

@Entity('booths')
export class Booth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  exhibitionId: string;

  @ManyToOne(() => Exhibition, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exhibitionId' })
  exhibition: Exhibition;

  @Column()
  number: string;

  @Column({ nullable: true })
  size: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'float', nullable: true })
  posX: number;

  @Column({ type: 'float', nullable: true })
  posY: number;

  @Column({ type: 'enum', enum: BoothStatus, default: BoothStatus.AVAILABLE })
  status: BoothStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
