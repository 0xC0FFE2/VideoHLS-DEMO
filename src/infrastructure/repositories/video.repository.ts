import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../../domain/video/video.entity';

@Injectable()
export class VideoRepository {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>
  ) {}

  async findAll(): Promise<Video[]> {
    return this.videoRepository.find({ 
      where: { isActive: true },
      relations: ['course'],
      order: { sortOrder: 'ASC' }
    });
  }

  async findById(id: string): Promise<Video | null> {
    return this.videoRepository.findOne({ 
      where: { id, isActive: true },
      relations: ['course']
    });
  }

  async findByCourse(courseId: string): Promise<Video[]> {
    return this.videoRepository.find({
      where: { course: { id: courseId }, isActive: true },
      order: { sortOrder: 'ASC' }
    });
  }

  async save(video: Partial<Video>): Promise<Video> {
    return this.videoRepository.save(video);
  }

  async update(id: string, video: Partial<Video>): Promise<Video> {
    await this.videoRepository.update(id, video);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Video with id ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.videoRepository.update(id, { isActive: false });
  }
}