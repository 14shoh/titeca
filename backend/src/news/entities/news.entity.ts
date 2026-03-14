import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  title: { tj: string; ru: string; en: string };

  @Column({ type: 'json' })
  content: { tj: string; ru: string; en: string };

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
