import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../course/course.entity';
import { VideoChapter } from '../videoChapter/videoChapter.entity';

export enum VideoStatus {
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
}

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  duration: number;

  @Column()
  originalFilename: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  hlsPath: string;

  @Column({
    type: 'enum',
    enum: VideoStatus,
    default: VideoStatus.PROCESSING,
  })
  status: VideoStatus;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Course, course => course.videos)
  course: Course;

  @ManyToOne(() => VideoChapter, chapter => chapter.videos)
  @JoinColumn()
  chapter: VideoChapter;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}