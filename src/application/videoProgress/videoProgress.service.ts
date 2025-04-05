import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { VideoProgressRepository } from '../../infrastructure/repositories/videoProgress/videoProgress.repository';
import { VideoRepository } from '../../infrastructure/repositories/video/video.repository';
import { UpdateVideoProgressDto, CreateVideoProgressDto, VideoProgressDto } from '../dto/videoProgress.dto';

@Injectable()
export class VideoProgressService {
  constructor(
    private readonly videoProgressRepository: VideoProgressRepository,
    private readonly videoRepository: VideoRepository,
  ) {}

  async updateProgress(userId: string, videoId: string, dto: UpdateVideoProgressDto): Promise<VideoProgressDto> {
    // 비디오 존재 여부 확인
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new NotFoundException(`Video with ID ${videoId} not found`);
    }

    // 비디오 길이와 현재 위치 비교하여 완료 여부 계산
    const isCompleted = dto.completed || 
      (dto.progress && dto.progress >= 95) ||  // 95% 이상 시청 시 완료로 간주
      (dto.lastPosition && video.duration > 0 && dto.lastPosition >= video.duration * 0.95);
    
    // 완료 처리
    const updateData: Partial<UpdateVideoProgressDto> = {
      ...dto,
      completed: isCompleted ? true : undefined,
    };
    
    // 처음 완료된 경우 completedAt 설정
    if (isCompleted) {
      const existingProgress = await this.videoProgressRepository.findByUserAndVideo(userId, videoId);
      if (!existingProgress || !existingProgress.completed) {
        updateData['completedAt'] = new Date();
      }
    }

    // 진행 상황 저장 (upsert)
    const videoProgress = await this.videoProgressRepository.upsert(userId, videoId, updateData);
    return VideoProgressDto.fromEntity(videoProgress);
  }

  async getProgress(userId: string, videoId: string): Promise<VideoProgressDto> {
    const progress = await this.videoProgressRepository.findByUserAndVideo(userId, videoId);
    if (!progress) {
      // 없을 경우 기본값 생성
      const video = await this.videoRepository.findById(videoId);
      if (!video) {
        throw new NotFoundException(`Video with ID ${videoId} not found`);
      }
      
      const newProgress = await this.videoProgressRepository.create(userId, videoId, {
        progress: 0,
        lastPosition: 0,
        completed: false
      });
      
      return VideoProgressDto.fromEntity(newProgress);
    }
    
    return VideoProgressDto.fromEntity(progress);
  }

  async getAllProgressByUser(userId: string): Promise<VideoProgressDto[]> {
    const progressList = await this.videoProgressRepository.findAllByUser(userId);
    return progressList.map(progress => VideoProgressDto.fromEntity(progress));
  }

  async markVideoAsCompleted(userId: string, videoId: string): Promise<VideoProgressDto> {
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new NotFoundException(`Video with ID ${videoId} not found`);
    }
    
    const updateData = {
      progress: 100,
      lastPosition: video.duration,
      completed: true,
      completedAt: new Date()
    };
    
    const videoProgress = await this.videoProgressRepository.upsert(userId, videoId, updateData);
    return VideoProgressDto.fromEntity(videoProgress);
  }

  async getVideoCompletionStats(videoId: string): Promise<{
    totalViews: number;
    completedViews: number;
    completionRate: number;
  }> {
    const allProgress = await this.videoProgressRepository.findAllByVideo(videoId);
    const totalViews = allProgress.length;
    const completedViews = allProgress.filter(p => p.completed).length;
    
    return {
      totalViews,
      completedViews,
      completionRate: totalViews > 0 ? (completedViews / totalViews) * 100 : 0
    };
  }
}