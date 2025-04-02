import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { VideoService } from '../../../application/video/video.service';
import { CreateVideoDto, UpdateVideoDto } from '../../../application/dto/video.dto';
import { JwtAuthGuard } from '../../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../../application/auth/roles.guard';
import { Roles } from '../../../application/auth/roles.decorator';
import { UserRole } from '../../../domain/user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // 비디오 HLS 스트리밍 엔드포인트
  @Get(':id/stream')
  async streamVideo(@Param('id') id: string, @Res() res: Response) {
    try {
      const { playlistPath } = await this.videoService.getHLSPlaylist(id);
      const playlistContent = fs.readFileSync(playlistPath, 'utf8');
      
      res.header('Content-Type', 'application/vnd.apple.mpegurl');
      return res.send(playlistContent);
    } catch (error) {
      return res.status(404).send({
        message: error.message || 'Video not found or not ready for streaming'
      });
    }
  }

  // 비디오 세그먼트 제공 엔드포인트
  @Get(':id/segment/:segmentName')
  async getVideoSegment(
    @Param('id') id: string,
    @Param('segmentName') segmentName: string,
    @Res() res: Response
  ) {
    try {
      const { playlistPath } = await this.videoService.getHLSPlaylist(id);
      const segmentPath = path.join(path.dirname(playlistPath), segmentName);
      
      if (!fs.existsSync(segmentPath)) {
        return res.status(404).send({
          message: 'Segment not found'
        });
      }
      
      res.header('Content-Type', 'video/MP2T');
      fs.createReadStream(segmentPath).pipe(res);
    } catch (error) {
      return res.status(404).send({
        message: error.message || 'Segment not found'
      });
    }
  }

  // 비디오 목록 조회
  @Get()
  async getAllVideos() {
    return this.videoService.getAllVideos();
  }

  // 코스별 비디오 목록 조회
  @Get('course/:courseId')
  async getVideosByCourse(@Param('courseId') courseId: string) {
    return this.videoService.getVideosByCourse(courseId);
  }

  // 비디오 상세 조회
  @Get(':id')
  async getVideoById(@Param('id') id: string) {
    return this.videoService.getVideoById(id);
  }

  // 비디오 업로드 엔드포인트
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    return this.videoService.createVideo(file, createVideoDto);
  }

  // 비디오 업데이트
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Put(':id')
  async updateVideo(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videoService.updateVideo(id, updateVideoDto);
  }

  // 비디오 삭제
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Delete(':id')
  async deleteVideo(@Param('id') id: string) {
    await this.videoService.deleteVideo(id);
    return { success: true };
  }
}