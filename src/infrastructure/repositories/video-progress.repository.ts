import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoProgress } from '../../domain/videoProgress/video-progress.entity';
import { User } from '../../domain/user/user.entity';
import { Video } from '../../domain/video/video.entity';

@Injectable()
export class VideoProgressRepository {
  constructor(
    @InjectRepository(VideoProgress)
    private readonly videoProgressRepository: Repository<VideoProgress>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async findByUserAndVideo(userId: string, videoId: string): Promise<VideoProgress | null> {
    return this.videoProgressRepository.findOne({
      where: { 
        user: { id: userId },
        video: { id: videoId }
      },
      relations: ['user', 'video']
    });
  }

  async findAllByUser(userId: string): Promise<VideoProgress[]> {
    return this.videoProgressRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'video']
    });
  }

  async findAllByVideo(videoId: string): Promise<VideoProgress[]> {
    return this.videoProgressRepository.find({
      where: { video: { id: videoId } },
      relations: ['user', 'video']
    });
  }

  async findById(id: string): Promise<VideoProgress | null> {
    return this.videoProgressRepository.findOne({
      where: { id },
      relations: ['user', 'video']
    });
  }

  async create(userId: string, videoId: string, data: Partial<VideoProgress>): Promise<VideoProgress> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const video = await this.videoRepository.findOne({ where: { id: videoId } });
    
    if (!user || !video) {
      throw new Error('User or Video not found');
    }
    
    const videoProgress = this.videoProgressRepository.create({
      ...data,
      user,
      video
    });
    
    return this.videoProgressRepository.save(videoProgress);
  }

  async update(id: string, data: Partial<VideoProgress>): Promise<VideoProgress> {
    await this.videoProgressRepository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`VideoProgress with ID ${id} not found after update`);
    }
    return updated;
  }

  async upsert(userId: string, videoId: string, data: Partial<VideoProgress>): Promise<VideoProgress> {
    const existing = await this.findByUserAndVideo(userId, videoId);
    
    if (existing) {
      return this.update(existing.id, data);
    } else {
      return this.create(userId, videoId, data);
    }
  }

  async delete(id: string): Promise<void> {
    await this.videoProgressRepository.delete(id);
  }
}