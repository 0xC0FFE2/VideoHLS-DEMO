import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../../infrastructure/repositories/course/course.repository';
import { CreateCourseDto, UpdateCourseDto, CourseDto } from '../dto/course.dto';
import { Course } from '../../domain/course/course.entity';
import { UserRepository } from '../../infrastructure/repositories/user/user.repository';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getAllCourses(): Promise<CourseDto[]> {
    const courses = await this.courseRepository.findAll();

    
    return courses.map(course => CourseDto.fromEntity(course));
  }

  async getCourseById(id: string): Promise<CourseDto> {
    const course = await this.courseRepository.findById(id);

    
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    
    return CourseDto.fromEntity(course);
  }

  async createCourse(createCourseDto: CreateCourseDto): Promise<CourseDto> {
    const course = new Course();
    course.title = createCourseDto.title;
    course.description = createCourseDto.description;
    course.imageUrl = createCourseDto.imageUrl;
    
    if (createCourseDto.isNew !== undefined) course.isNew = createCourseDto.isNew;
    if (createCourseDto.price !== undefined) course.price = createCourseDto.price;
    if (createCourseDto.discountPrice !== undefined) course.discountPrice = createCourseDto.discountPrice;
    if (createCourseDto.isFeatured !== undefined) course.isFeatured = createCourseDto.isFeatured;
    if (createCourseDto.isActive !== undefined) course.isActive = createCourseDto.isActive;
    
    if (createCourseDto.authorId) {
      const author = await this.userRepository.findOneById(createCourseDto.authorId);
      if (author) {
        course.author = author;
      }
    }
    
    const savedCourse = await this.courseRepository.save(course);
    return CourseDto.fromEntity(savedCourse);
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<CourseDto> {
    const course = await this.courseRepository.findById(id);
    
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    
    if (updateCourseDto.title) course.title = updateCourseDto.title;
    if (updateCourseDto.description) course.description = updateCourseDto.description;
    if (updateCourseDto.imageUrl) course.imageUrl = updateCourseDto.imageUrl;
    if (updateCourseDto.isNew !== undefined) course.isNew = updateCourseDto.isNew;
    if (updateCourseDto.price !== undefined) course.price = updateCourseDto.price;
    if (updateCourseDto.discountPrice !== undefined) course.discountPrice = updateCourseDto.discountPrice;
    if (updateCourseDto.isFeatured !== undefined) course.isFeatured = updateCourseDto.isFeatured;
    if (updateCourseDto.isActive !== undefined) course.isActive = updateCourseDto.isActive;
    
    if (updateCourseDto.authorId) {
      const author = await this.userRepository.findOneById(updateCourseDto.authorId);
      if (author) {
        course.author = author;
      }
    }
    
    const updatedCourse = await this.courseRepository.save(course);
    return CourseDto.fromEntity(updatedCourse);
  }

  async deleteCourse(id: string): Promise<void> {
    // 삭제하기 전에 과정이 존재하는지 확인
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    
    await this.courseRepository.delete(id);
  }
}