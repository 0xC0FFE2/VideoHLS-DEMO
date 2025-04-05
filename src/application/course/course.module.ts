import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../domain/course/course.entity';
import { User } from '../../domain/user/user.entity';
import { CourseService } from './course.service';
import { CourseRepository } from '../../infrastructure/repositories/course/course.repository';
import { UserRepository } from '../../infrastructure/repositories/user/user.repository';
import { CourseController } from '../../interface/api/course/course.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, User]),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository, UserRepository],
  exports: [CourseService],
})
export class CourseModule {}