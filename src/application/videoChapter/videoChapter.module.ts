import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoChapter } from '../../domain/videoChapter/videoChapter.entity';
import { Video } from '../../domain/video/video.entity';
import { VideoChapterService } from './videoChapter.service';
import { VideoChapterRepository } from '../../infrastructure/repositories/videoChapter/videoChapter.repository';
import { VideoRepository } from '../../infrastructure/repositories/video/video.repository';
import { VideoChapterController } from '../../interface/api/videoChapter/videoChapter.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoChapter, Video]),
  ],
  controllers: [VideoChapterController],
  providers: [VideoChapterService, VideoChapterRepository, VideoRepository],
  exports: [VideoChapterService],
})
export class VideoChapterModule {}