import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../../domain/video/video.entity';
import { Course } from '../../domain/course/course.entity';
import { VideoService } from './video.service';
import { VideoRepository } from '../../infrastructure/repositories/video/video.repository';
import { CourseRepository } from '../../infrastructure/repositories/course/course.repository';
import { VideoController } from '../../interface/api/video/video.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Video, Course]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository, CourseRepository],
  exports: [VideoService],
})
export class VideoModule {}