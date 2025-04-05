import { Course } from '../../domain/course/course.entity';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsNumber } from 'class-validator';
import { VideoDto } from './video.dto';

export class CourseDto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isNew: boolean;
  price: number;
  discountPrice: number;
  isFeatured: boolean;
  isActive: boolean;
  author?: any;
  videos?: VideoDto[];
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(course: Course): CourseDto {
    const dto = new CourseDto();
    dto.id = course.id;
    dto.title = course.title;
    dto.description = course.description;
    dto.imageUrl = course.imageUrl;
    dto.isNew = course.isNew;
    dto.price = course.price;
    dto.discountPrice = course.discountPrice;
    dto.isFeatured = course.isFeatured;
    dto.isActive = course.isActive;
    dto.createdAt = course.createdAt;
    dto.updatedAt = course.updatedAt;
    
    if (course.author) {
      dto.author = {
        id: course.author.id,
        name: course.author.name,
        email: course.author.email
      };
    }
    
    if (course.videos) {
      dto.videos = course.videos.map(video => VideoDto.fromEntity(video));
    }
    
    return dto;
  }
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  
  @IsUUID()
  @IsOptional()
  authorId?: string;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  
  @IsUUID()
  @IsOptional()
  authorId?: string;
}