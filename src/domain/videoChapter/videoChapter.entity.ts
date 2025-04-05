import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Video } from '../video/video.entity';

@Entity()
export class VideoChapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column()
  startTime: number; // 챕터 시작 시간 (초 단위)

  @Column({ default: 0 })
  sortOrder: number; // 목차 순서

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Video, video => video.chapters)
  @JoinColumn()
  video: Video;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}