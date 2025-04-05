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
import { VideoChapterModule } from '../videoChapter/videoChapter.module';
import { VideoChapterService } from '../videoChapter/videoChapter.service';
import { VideoChapterRepository } from '../../infrastructure/repositories/videoChapter/videoChapter.repository';
import { VideoChapter } from 'src/domain/videoChapter/videoChapter.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Video, Course, VideoChapter]),
    MulterModule.register({
      dest: './uploads',
    }),
    VideoChapterModule,
  ],
  controllers: [VideoController],
  providers: [
    VideoService,
    VideoRepository,
    CourseRepository,
    VideoChapterService,
    VideoChapterRepository,
  ],
  exports: [
    VideoService,
    VideoRepository,
    CourseRepository,
    VideoChapterService,
    VideoChapterRepository,
  ],
})
export class VideoModule {}
