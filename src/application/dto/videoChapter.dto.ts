import { IsUUID, IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { VideoChapter } from '../../domain/videoChapter/videoChapter.entity';

export class VideoChapterDto {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  courseId: string;
  videos?: VideoDto[];
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(videoChapter: VideoChapter): VideoChapterDto {
    const dto = new VideoChapterDto();
    dto.id = videoChapter.id;
    dto.title = videoChapter.title;
    dto.description = videoChapter.description || undefined;
    dto.sortOrder = videoChapter.sortOrder;
    dto.courseId = videoChapter.course.id;
    if (videoChapter.videos) {
      dto.videos = videoChapter.videos.map(video => VideoDto.fromEntity(video));
    }
    dto.createdAt = videoChapter.createdAt;
    dto.updatedAt = videoChapter.updatedAt;
    return dto;
  }
}

export class VideoDto {
  id: string;
  title: string;
  duration: number;
  thumbnailUrl?: string;
  
  static fromEntity(video: any): VideoDto {
    const dto = new VideoDto();
    dto.id = video.id;
    dto.title = video.title;
    dto.duration = video.duration;
    dto.thumbnailUrl = video.thumbnailUrl;
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
  @IsOptional()
  sortOrder?: number;

  @IsUUID()
  courseId: string;
}

export class UpdateVideoChapterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}