import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { VideoChapterService } from '../../../application/videoChapter/videoChapter.service';
import { CreateVideoChapterDto, UpdateVideoChapterDto } from '../../../application/dto/videoChapter.dto';
import { JwtAuthGuard } from '../../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../../application/auth/roles.guard';
import { Roles } from '../../../application/auth/roles.decorator';
import { UserRole } from '../../../domain/user/user.entity';

@Controller('api/videoChapters')
export class VideoChapterController {
  constructor(private readonly videoChapterService: VideoChapterService) {}

  // 모든 챕터 조회
  @Get()
  async getAllChapters() {
    return this.videoChapterService.getAllChapters();
  }

  // 챕터 상세 조회
  @Get(':id')
  async getChapterById(@Param('id') id: string) {
    return this.videoChapterService.getChapterById(id);
  }

  // 비디오별 챕터 조회
  @Get('video/:videoId')
  async getChaptersByVideo(@Param('videoId') videoId: string) {
    return this.videoChapterService.getChaptersByVideo(videoId);
  }

  // 챕터 생성 (관리자/강사만 가능)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Post()
  async createChapter(@Body() createChapterDto: CreateVideoChapterDto) {
    return this.videoChapterService.createChapter(createChapterDto);
  }

  // 챕터 업데이트 (관리자/강사만 가능)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Put(':id')
  async updateChapter(
    @Param('id') id: string,
    @Body() updateChapterDto: UpdateVideoChapterDto,
  ) {
    return this.videoChapterService.updateChapter(id, updateChapterDto);
  }

  // 챕터 삭제 (관리자/강사만 가능)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Delete(':id')
  async deleteChapter(@Param('id') id: string) {
    await this.videoChapterService.deleteChapter(id);
    return { success: true };
  }
}