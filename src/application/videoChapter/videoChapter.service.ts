import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoChapterRepository } from '../../infrastructure/repositories/videoChapter/videoChapter.repository';
import { VideoRepository } from '../../infrastructure/repositories/video/video.repository';
import { CreateVideoChapterDto, UpdateVideoChapterDto, VideoChapterDto } from '../dto/videoChapter.dto';
import { VideoChapter } from '../../domain/videoChapter/videoChapter.entity';

@Injectable()
export class VideoChapterService {
  constructor(
    private readonly videoChapterRepository: VideoChapterRepository,
    private readonly videoRepository: VideoRepository,
  ) {}

  async getAllChapters(): Promise<VideoChapterDto[]> {
    const chapters = await this.videoChapterRepository.findAll();
    return chapters.map(chapter => VideoChapterDto.fromEntity(chapter));
  }

  async getChapterById(id: string): Promise<VideoChapterDto> {
    const chapter = await this.videoChapterRepository.findById(id);
    
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID "${id}" not found`);
    }
    
    return VideoChapterDto.fromEntity(chapter);
  }

  async getChaptersByVideo(videoId: string): Promise<VideoChapterDto[]> {
    const chapters = await this.videoChapterRepository.findByVideo(videoId);
    return chapters.map(chapter => VideoChapterDto.fromEntity(chapter));
  }

  async createChapter(createChapterDto: CreateVideoChapterDto): Promise<VideoChapterDto> {
    const video = await this.videoRepository.findById(createChapterDto.videoId);
    if (!video) {
      throw new NotFoundException(`Video with ID "${createChapterDto.videoId}" not found`);
    }
    
    const chapter = new VideoChapter();
    chapter.title = createChapterDto.title;
    chapter.description = createChapterDto.description || null;
    chapter.startTime = createChapterDto.startTime;
    chapter.sortOrder = createChapterDto.sortOrder || 0;
    chapter.video = video;
    
    const savedChapter = await this.videoChapterRepository.save(chapter);
    return VideoChapterDto.fromEntity(savedChapter);
  }

  async updateChapter(id: string, updateChapterDto: UpdateVideoChapterDto): Promise<VideoChapterDto> {
    const chapter = await this.videoChapterRepository.findById(id);
    
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID "${id}" not found`);
    }
    
    if (updateChapterDto.title) chapter.title = updateChapterDto.title;
    if (updateChapterDto.description !== undefined) chapter.description = updateChapterDto.description || null;
    if (updateChapterDto.startTime !== undefined) chapter.startTime = updateChapterDto.startTime;
    if (updateChapterDto.sortOrder !== undefined) chapter.sortOrder = updateChapterDto.sortOrder;
    if (updateChapterDto.isActive !== undefined) chapter.isActive = updateChapterDto.isActive;
    
    const updatedChapter = await this.videoChapterRepository.save(chapter);
    return VideoChapterDto.fromEntity(updatedChapter);
  }

  async deleteChapter(id: string): Promise<void> {
    // 삭제 전에 존재 여부 확인
    const chapter = await this.videoChapterRepository.findById(id);
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID "${id}" not found`);
    }
    
    await this.videoChapterRepository.delete(id);
  }
}