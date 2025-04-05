import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoProgress } from '../../domain/videoProgress/videoProgress.entity';
import { Video } from '../../domain/video/video.entity';
import { User } from '../../domain/user/user.entity';
import { VideoProgressService } from './videoProgress.service';
import { VideoProgressRepository } from '../../infrastructure/repositories/videoProgress/videoProgress.repository';
import { VideoRepository } from '../../infrastructure/repositories/video/video.repository';
import { UserRepository } from '../../infrastructure/repositories/user/user.repository';
import { VideoProgressController } from '../../interface/api/videoProgress/videoProgress.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoProgress, Video, User]),
  ],
  controllers: [VideoProgressController],
  providers: [VideoProgressService, VideoProgressRepository, VideoRepository, UserRepository],
  exports: [VideoProgressService],
})
export class VideoProgressModule {}