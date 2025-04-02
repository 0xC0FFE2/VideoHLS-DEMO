import { Video, VideoStatus } from '../../domain/video/video.entity';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class VideoDto {
  id: string;
  title: string;
  description?: string;
  duration: number;
  originalFilename: string;
  fileUrl: string;
  thumbnailUrl?: string;
  hlsPath?: string;
  status: VideoStatus;
  sortOrder: number;
  courseId: string;
  courseTitle?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(video: Video): VideoDto {
    const dto = new VideoDto();
    dto.id = video.id;
    dto.title = video.title;
    dto.description = video.description;
    dto.duration = video.duration;
    dto.originalFilename = video.originalFilename;
    dto.fileUrl = video.fileUrl;
    dto.thumbnailUrl = video.thumbnailUrl;
    dto.hlsPath = video.hlsPath;
    dto.status = video.status;
    dto.sortOrder = video.sortOrder;
    dto.createdAt = video.createdAt;
    dto.updatedAt = video.updatedAt;
    
    if (video.course) {
      dto.courseId = video.course.id;
      dto.courseTitle = video.course.title;
    }
    
    return dto;
  }
}

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateVideoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}