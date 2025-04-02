import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../domain/course/course.entity';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({ 
      where: { isActive: true },
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({ 
      where: { id, isActive: true },
      relations: ['author', 'videos']
    });
  }

  async save(course: Partial<Course>): Promise<Course> {
    return this.courseRepository.save(course);
  }

  async update(id: string, course: Partial<Course>): Promise<Course> {
    await this.courseRepository.update(id, course);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Course with id ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.courseRepository.update(id, { isActive: false });
  }
}