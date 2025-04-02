import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VideoRepository } from '../../infrastructure/repositories/video.repository';
import { CourseRepository } from '../../infrastructure/repositories/course.repository';
import { VideoDto, CreateVideoDto, UpdateVideoDto } from '../dto/video.dto';
import { VideoStatus } from '../../domain/video/video.entity';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class VideoService {
  private readonly uploadPath: string;
  private readonly hlsPath: string;

  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly courseRepository: CourseRepository,
    private readonly configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get('FILE_UPLOAD_PATH') || './uploads';
    this.hlsPath = this.configService.get('VIDEO_HLS_PATH') || './hls';
    
    // 디렉토리 생성
    fs.ensureDirSync(this.uploadPath);
    fs.ensureDirSync(this.hlsPath);
  }

  // 비디오 생성 및 HLS 변환
  async createVideo(file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<VideoDto> {
    const course = await this.courseRepository.findById(createVideoDto.courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${createVideoDto.courseId} not found`);
    }
    
    // 파일 저장
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, fileName);
    await fs.outputFile(filePath, file.buffer);
    
    // 영상 길이 확인
    const duration = await this.getVideoDuration(filePath);
    
    // 썸네일 생성
    const thumbnailName = `thumbnail-${Date.now()}.jpg`;
    const thumbnailPath = path.join(this.uploadPath, thumbnailName);
    const thumbnailUrl = `/uploads/${thumbnailName}`;
    await this.generateThumbnail(filePath, thumbnailPath);
    
    // 비디오 레코드 생성
    const video = await this.videoRepository.save({
      title: createVideoDto.title,
      description: createVideoDto.description,
      duration,
      originalFilename: file.originalname,
      fileUrl: filePath,
      thumbnailUrl: thumbnailUrl,
      status: VideoStatus.PROCESSING,
      sortOrder: createVideoDto.sortOrder || 0,
      course
    });
    
    // HLS 변환 (비동기)
    this.processVideoToHLS(video.id, filePath);
    
    return VideoDto.fromEntity(video);
  }

  // 영상 길이 확인 메서드
  private getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error('Error getting video duration:', err);
          return resolve(0); // 기본값
        }
        
        const durationInSeconds = metadata.format.duration || 0;
        resolve(Math.round(durationInSeconds));
      });
    });
  }

  // 썸네일 생성 메서드
  private generateThumbnail(videoPath: string, thumbnailPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['10%'], // 영상의 10% 지점에서 썸네일 추출
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '320x240'
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          console.error('Error generating thumbnail:', err);
          reject(err);
        });
    });
  }

  // HLS 스트리밍용 영상 변환
  private async processVideoToHLS(videoId: string, inputPath: string): Promise<void> {
    const outputPath = path.join(this.hlsPath, videoId);
    
    try {
      await fs.ensureDir(outputPath);
      
      return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls'
          ])
          .output(path.join(outputPath, 'playlist.m3u8'))
          .on('end', async () => {
            await this.videoRepository.update(videoId, {
              hlsPath: outputPath,
              status: VideoStatus.READY
            });
            resolve();
          })
          .on('error', async (err) => {
            console.error('Error processing video:', err);
            await this.videoRepository.update(videoId, {
              status: VideoStatus.ERROR
            });
            reject(err);
          })
          .run();
      });
    } catch (error) {
      console.error('Error in HLS processing:', error);
      await this.videoRepository.update(videoId, {
        status: VideoStatus.ERROR
      });
    }
  }

  // 스트리밍을 위한 재생목록 조회
  async getHLSPlaylist(videoId: string): Promise<{ playlistPath: string }> {
    const video = await this.videoRepository.findById(videoId);
    
    if (!video) {
      throw new NotFoundException(`Video with ID ${videoId} not found`);
    }
    
    if (video.status !== VideoStatus.READY) {
      throw new NotFoundException(`Video is not ready for streaming`);
    }
    
    return { playlistPath: path.join(video.hlsPath, 'playlist.m3u8') };
  }

  // 모든 비디오 조회
  async getAllVideos(): Promise<VideoDto[]> {
    const videos = await this.videoRepository.findAll();
    return videos.map(video => VideoDto.fromEntity(video));
  }

  // 코스별 비디오 조회
  async getVideosByCourse(courseId: string): Promise<VideoDto[]> {
    const videos = await this.videoRepository.findByCourse(courseId);
    return videos.map(video => VideoDto.fromEntity(video));
  }

  // 비디오 상세 조회
  async getVideoById(id: string): Promise<VideoDto> {
    const video = await this.videoRepository.findById(id);
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return VideoDto.fromEntity(video);
  }

  // 비디오 업데이트
  async updateVideo(id: string, updateVideoDto: UpdateVideoDto): Promise<VideoDto> {
    const video = await this.videoRepository.findById(id);
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    
    const updatedVideo = await this.videoRepository.update(id, updateVideoDto);
    return VideoDto.fromEntity(updatedVideo);
  }

  // 비디오 삭제
  async deleteVideo(id: string): Promise<void> {
    const video = await this.videoRepository.findById(id);
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    
    await this.videoRepository.delete(id);
  }
}