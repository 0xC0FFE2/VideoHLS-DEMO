import { IsUUID, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { VideoProgress } from '../../domain/videoProgress/videoProgress.entity';

export class VideoProgressDto {
  id: string;
  userId: string;
  videoId: string;
  progress: number;
  lastPosition: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(videoProgress: VideoProgress): VideoProgressDto {
    const dto = new VideoProgressDto();
    dto.id = videoProgress.id;
    dto.userId = videoProgress.user.id;
    dto.videoId = videoProgress.video.id;
    dto.progress = videoProgress.progress;
    dto.lastPosition = videoProgress.lastPosition;
    dto.completed = videoProgress.completed;
    dto.completedAt = videoProgress.completedAt;
    dto.createdAt = videoProgress.createdAt;
    dto.updatedAt = videoProgress.updatedAt;
    return dto;
  }
}

export class UpdateVideoProgressDto {
  @IsNumber()
  @IsOptional()
  lastPosition?: number;

  @IsNumber()
  @IsOptional()
  progress?: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class CreateVideoProgressDto {
  @IsUUID()
  videoId: string;

  @IsNumber()
  lastPosition: number;

  @IsNumber()
  progress: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}