import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.enrollments)
  user: User;

  @ManyToOne(() => Course)
  course: Course;

  @Column({ default: false })
  isCompleted: boolean;
  
  @Column({ default: 0 })
  progressPercentage: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}