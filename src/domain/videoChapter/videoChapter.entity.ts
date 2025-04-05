import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Video } from '../video/video.entity';
import { Course } from '../course/course.entity';

@Entity()
export class VideoChapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column({ default: 0 })
  sortOrder: number; // 목차 순서

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Course, course => course.chapters)
  @JoinColumn()
  course: Course;

  @OneToMany(() => Video, video => video.chapter)
  videos: Video[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}