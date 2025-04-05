import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoChapter } from '../../../domain/videoChapter/videoChapter.entity';

@Injectable()
export class VideoChapterRepository {
  constructor(
    @InjectRepository(VideoChapter)
    private videoChapterRepository: Repository<VideoChapter>
  ) {}

  async findAll(): Promise<VideoChapter[]> {
    return this.videoChapterRepository.find({ 
      where: { isActive: true },
      relations: ['video'],
      order: { sortOrder: 'ASC' }
    });
  }

  async findById(id: string): Promise<VideoChapter | null> {
    return this.videoChapterRepository.findOne({ 
      where: { id, isActive: true },
      relations: ['video']
    });
  }

  async findByVideo(videoId: string): Promise<VideoChapter[]> {
    return this.videoChapterRepository.find({
      where: { video: { id: videoId }, isActive: true },
      order: { sortOrder: 'ASC' }
    });
  }

  async save(videoChapter: Partial<VideoChapter>): Promise<VideoChapter> {
    return this.videoChapterRepository.save(videoChapter);
  }

  async update(id: string, videoChapter: Partial<VideoChapter>): Promise<VideoChapter> {
    await this.videoChapterRepository.update(id, videoChapter);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`VideoChapter with id ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.videoChapterRepository.update(id, { isActive: false });
  }
}