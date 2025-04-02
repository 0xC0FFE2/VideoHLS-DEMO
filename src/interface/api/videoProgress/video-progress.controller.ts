import { Controller, Get, Post, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { VideoProgressService } from '../../../application/videoProgress/video-progress.service';
import { CreateVideoProgressDto, UpdateVideoProgressDto } from '../../../application/dto/video-progress.dto';
import { JwtAuthGuard } from '../../../application/auth/jwt-auth.guard';
import { Request } from 'express';

// 요청 사용자 정보를 위한 인터페이스 정의
interface RequestWithUser extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
}

@Controller('api/video-progress')
export class VideoProgressController {
  constructor(private readonly videoProgressService: VideoProgressService) {}

  // 현재 사용자의 특정 비디오 시청 진행상황 조회
  @UseGuards(JwtAuthGuard)
  @Get(':videoId')
  async getVideoProgress(
    @Req() req: RequestWithUser,
    @Param('videoId') videoId: string,
  ) {
    const userId = req.user.id;
    return this.videoProgressService.getProgress(userId, videoId);
  }

  // 현재 사용자의 모든 비디오 시청 진행상황 조회
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllVideoProgress(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.videoProgressService.getAllProgressByUser(userId);
  }

  // 비디오 시청 진행상황 업데이트
  @UseGuards(JwtAuthGuard)
  @Put(':videoId')
  async updateVideoProgress(
    @Req() req: RequestWithUser,
    @Param('videoId') videoId: string,
    @Body() updateDto: UpdateVideoProgressDto,
  ) {
    const userId = req.user.id;
    return this.videoProgressService.updateProgress(userId, videoId, updateDto);
  }

  // 비디오 시청 완료 표시
  @UseGuards(JwtAuthGuard)
  @Post(':videoId/complete')
  async markVideoAsCompleted(
    @Req() req: RequestWithUser,
    @Param('videoId') videoId: string,
  ) {
    const userId = req.user.id;
    return this.videoProgressService.markVideoAsCompleted(userId, videoId);
  }

  // 비디오 완료 통계 (관리자용)
  @UseGuards(JwtAuthGuard)
  @Get(':videoId/stats')
  async getVideoStats(@Param('videoId') videoId: string) {
    return this.videoProgressService.getVideoCompletionStats(videoId);
  }
}