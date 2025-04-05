import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoChapterRepository } from '../../infrastructure/repositories/videoChapter/videoChapter.repository';
import { CourseRepository } from '../../infrastructure/repositories/course/course.repository';
import { CreateVideoChapterDto, UpdateVideoChapterDto, VideoChapterDto } from '../dto/videoChapter.dto';
import { VideoChapter } from '../../domain/videoChapter/videoChapter.entity';

@Injectable()
export class VideoChapterService {
  constructor(
    private readonly videoChapterRepository: VideoChapterRepository,
    private readonly courseRepository: CourseRepository,
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

  async getChaptersByCourse(courseId: string): Promise<VideoChapterDto[]> {
    const chapters = await this.videoChapterRepository.findByCourse(courseId);
    return chapters.map(chapter => VideoChapterDto.fromEntity(chapter));
  }

  async createChapter(createChapterDto: CreateVideoChapterDto): Promise<VideoChapterDto> {
    const course = await this.courseRepository.findById(createChapterDto.courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID "${createChapterDto.courseId}" not found`);
    }
    
    const chapter = new VideoChapter();
    chapter.title = createChapterDto.title;
    chapter.description = createChapterDto.description || null;
    chapter.sortOrder = createChapterDto.sortOrder || 0;
    chapter.course = course;
    
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