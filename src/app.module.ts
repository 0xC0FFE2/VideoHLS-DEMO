import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';

// 도메인 엔티티
import { User } from './domain/user/user.entity';
import { Course } from './domain/course/course.entity';
import { Video } from './domain/video/video.entity';
import { Enrollment } from './domain/enrollment/enrollment.entity';
import { VideoProgress } from './domain/videoProgress/videoProgress.entity';

import { CourseModule } from './application/course/course.module';
import { AuthModule } from './application/auth/auth.module';
import { VideoModule } from './application/video/video.module';
import { VideoProgressModule } from './application/videoProgress/videoProgress.module';

@Module({
  imports: [
    // 환경 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 인증 모듈
    AuthModule,
    CourseModule,
    VideoModule,
    VideoProgressModule,

    // TypeORM 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Course, Video, Enrollment, VideoProgress],
          synchronize: true,
          driver: require('mysql2'),
          extra: {
            connectionLimit: 10, // 연결 제한 설정 (선택 사항)
          },
        };
      },
    }),

    // 엔티티 등록
    TypeOrmModule.forFeature([User, Course, Video, Enrollment, VideoProgress]),

    // 정적 파일 제공
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'build'),
    }),

    // 파일 업로드
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
