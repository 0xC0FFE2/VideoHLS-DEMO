import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Video } from '../video/video.entity';

@Entity()
export class VideoProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Video)
  @JoinColumn()
  video: Video;

  @Column('float', { default: 0 })
  progress: number; // 0-100 사이의 비율 (%)

  @Column('int', { default: 0 })
  lastPosition: number; // 초 단위로 마지막 시청 위치

  @Column({ default: false })
  completed: boolean; // 시청 완료 여부

  @Column({ nullable: true })
  completedAt: Date; // 시청 완료 시간

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}