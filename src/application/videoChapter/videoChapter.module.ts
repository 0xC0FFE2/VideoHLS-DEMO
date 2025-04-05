import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoChapter } from '../../domain/videoChapter/videoChapter.entity';
import { Video } from '../../domain/video/video.entity';
import { VideoChapterService } from './videoChapter.service';
import { VideoChapterRepository } from '../../infrastructure/repositories/videoChapter/videoChapter.repository';
import { VideoRepository } from '../../infrastructure/repositories/video/video.repository';
import { VideoChapterController } from '../../interface/api/videoChapter/videoChapter.controller';
import { CourseRepository } from '../../infrastructure/repositories/course/course.repository';
import { Course } from '../../domain/course/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoChapter, Video, Course]),
  ],
  controllers: [VideoChapterController],
  providers: [
    VideoChapterService, 
    VideoChapterRepository, 
    VideoRepository, 
    CourseRepository
  ],
  exports: [
    VideoChapterService, 
    VideoChapterRepository, 
    VideoRepository, 
    CourseRepository
  ]
})
export class VideoChapterModule {}