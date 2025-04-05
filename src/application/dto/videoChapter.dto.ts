import { IsUUID, IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { VideoChapter } from '../../domain/videoChapter/videoChapter.entity';

export class VideoChapterDto {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  sortOrder: number;
  videoId: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(videoChapter: VideoChapter): VideoChapterDto {
    const dto = new VideoChapterDto();
    dto.id = videoChapter.id;
    dto.title = videoChapter.title;
    dto.description = videoChapter.description || undefined;
    dto.startTime = videoChapter.startTime;
    dto.sortOrder = videoChapter.sortOrder;
    dto.videoId = videoChapter.video.id;
    dto.createdAt = videoChapter.createdAt;
    dto.updatedAt = videoChapter.updatedAt;
    return dto;
  }
}

export class CreateVideoChapterDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  startTime: number;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsUUID()
  videoId: string;
}

export class UpdateVideoChapterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  startTime?: number;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}