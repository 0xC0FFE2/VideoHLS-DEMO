import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CourseService } from '../../../application/course/course.service';
import { CreateCourseDto, UpdateCourseDto } from '../../../application/dto/course.dto';
import { JwtAuthGuard } from '../../../application/auth/jwt-auth.guard';
import { RolesGuard } from '../../../application/auth/roles.guard';
import { Roles } from '../../../application/auth/roles.decorator';
import { UserRole } from '../../../domain/user/user.entity';

@Controller('api/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // 모든 코스 조회
  @Get()
  async getAllCourses() {
    return this.courseService.getAllCourses();
  }

  // 코스 상세 조회
  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  // 코스 생성
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  // 코스 업데이트
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Put(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  // 코스 삭제
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    await this.courseService.deleteCourse(id);
    return { success: true };
  }
}