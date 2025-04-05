# VideoHLS-DEMO

HLS(HTTP Live Streaming) 기능을 갖춘 NestJS 기반 동영상 스트리밍 서버 데모입니다.

## 기능

- HLS 비디오 스트리밍
- 비디오 업로드 및 자동 HLS 변환
- 강의 플랫폼 기반 (강의, 비디오, 사용자)
- 시청 진행 상태 저장
- TypeORM을 사용한 PostgreSQL 연동

## 기술 스택

### 백엔드
- NestJS
- TypeORM
- PostgreSQL
- Fluent-FFMPEG
- JWT 인증

### 프론트엔드
- React
- HLS.js
- TypeScript
- TailwindCSS

## 시작하기

### 필수 조건
- Node.js (v14 이상)
- PostgreSQL
- FFMPEG (시스템에 설치되어 있어야 함)

### 설치

1. 백엔드 의존성 설치
```bash
npm install
```

2. 프론트엔드 의존성 설치
```bash
cd client
npm install
```

3. 환경 변수 설정
`.env` 파일을 프로젝트 루트에 생성하고 다음과 같이 설정합니다:
```
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=education_platform

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d

FILE_UPLOAD_PATH=./uploads
VIDEO_HLS_PATH=./hls
```

4. 데이터베이스 생성
PostgreSQL에서 `education_platform` 데이터베이스를 생성합니다.

### 실행

1. 백엔드 서버 실행
```bash
npm run start:dev
```

2. 프론트엔드 개발 서버 실행
```bash
cd client
npm start
```

## 프로젝트 구조

프로젝트는 DDD(Domain-Driven Design) 패턴을 따릅니다:

- `src/domain/`: 도메인 엔티티 및 비즈니스 규칙
- `src/application/`: 애플리케이션 서비스 레이어
- `src/infrastructure/`: 인프라스트럭처 코드 (리포지토리 등)
- `src/interface/`: 컨트롤러 및 API 엔드포인트

## API 명세

### 인증 API
- `POST /api/auth/register`: 사용자 등록
  - Request Body: `{ email, password, name, role? }`
  - Response: `{ id, email, name, role }`

- `POST /api/auth/login`: 로그인
  - Request Body: `{ email, password }`
  - Response: `{ access_token, user: { id, email, name, role } }`

- `GET /api/auth/profile`: 현재 사용자 프로필 조회 (인증 필요)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ id, email, name, role }`

### 강의(Course) API
- `GET /api/courses`: 모든 강의 조회
  - Response: `[{ id, title, description, imageUrl, ... }]`

- `GET /api/courses/:id`: 강의 상세 조회
  - Response: `{ id, title, description, imageUrl, author, videos, ... }`

- `POST /api/courses`: 강의 생성 (인증 필요, 관리자/강사 권한)
  - Headers: `Authorization: Bearer {token}`
  - Request Body: `{ title, description, imageUrl, authorId?, isNew?, price?, discountPrice?, isFeatured?, isActive? }`
  - Response: 생성된 강의 객체

- `PUT /api/courses/:id`: 강의 업데이트 (인증 필요, 관리자/강사 권한)
  - Headers: `Authorization: Bearer {token}`
  - Request Body: `{ title?, description?, imageUrl?, authorId?, isNew?, price?, discountPrice?, isFeatured?, isActive? }`
  - Response: 업데이트된 강의 객체

- `DELETE /api/courses/:id`: 강의 삭제 (인증 필요, 관리자/강사 권한)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ success: true }`

### 비디오(Video) API
- `GET /api/videos`: 모든 비디오 조회
  - Response: `[{ id, title, description, duration, courseId, ... }]`

- `GET /api/videos/:id`: 비디오 상세 조회
  - Response: `{ id, title, description, duration, courseId, ... }`

- `GET /api/videos/course/:courseId`: 코스별 비디오 조회
  - Response: `[{ id, title, description, duration, courseId, ... }]`

- `GET /api/videos/:id/stream`: HLS 스트리밍 엔드포인트
  - Response: HLS 재생목록 파일 (.m3u8)

- `GET /api/videos/:id/segment/:segmentName`: HLS 세그먼트 제공
  - Response: MPEG-TS 세그먼트 파일 (.ts)

- `POST /api/videos`: 비디오 업로드 (인증 필요, 관리자/강사 권한)
  - Headers: `Authorization: Bearer {token}`
  - Request Body (multipart/form-data): `{ file, title, description, order, courseId, isPublic? }`
  - Response: 생성된 비디오 객체

- `PUT /api/videos/:id`: 비디오 업데이트 (인증 필요, 관리자/강사 권한)
  - Headers: `Authorization: Bearer {token}`
  - Request Body: `{ title?, description?, order?, courseId?, isPublic? }`
  - Response: 업데이트된 비디오 객체

- `DELETE /api/videos/:id`: 비디오 삭제 (인증 필요, 관리자/강사 권한)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ success: true }`

### 비디오 진행상태(Video Progress) API
- `GET /api/videoProgress`: 현재 사용자의 모든 비디오 진행상태 조회 (인증 필요)
  - Headers: `Authorization: Bearer {token}`
  - Response: `[{ videoId, userId, currentTime, isCompleted, ... }]`

- `GET /api/videoProgress/:videoId`: 현재 사용자의 특정 비디오 진행상태 조회 (인증 필요)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ videoId, userId, currentTime, isCompleted, ... }`

- `PUT /api/videoProgress/:videoId`: 비디오 진행상태 업데이트 (인증 필요)
  - Headers: `Authorization: Bearer {token}`
  - Request Body: `{ currentTime, isCompleted? }`
  - Response: 업데이트된 진행상태 객체

- `POST /api/videoProgress/:videoId/complete`: 비디오 시청 완료 표시 (인증 필요)
  - Headers: `Authorization: Bearer {token}`
  - Response: 업데이트된 진행상태 객체

- `GET /api/videoProgress/:videoId/stats`: 비디오 완료 통계 조회 (인증 필요)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ completedCount, totalViews, ... }`

## 라이센스

이 프로젝트는 MIT 라이센스 하에 제공됩니다.