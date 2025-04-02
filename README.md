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
- `client/`: React 프론트엔드 코드

## API 엔드포인트

- `GET /api/videos`: 모든 비디오 조회
- `GET /api/videos/:id`: 비디오 상세 조회
- `GET /api/videos/course/:courseId`: 코스별 비디오 조회
- `GET /api/videos/:id/stream`: HLS 스트리밍 엔드포인트
- `GET /api/videos/:id/segment/:segmentName`: HLS 세그먼트 제공
- `POST /api/videos`: 비디오 업로드 (인증 필요)
- `PUT /api/videos/:id`: 비디오 업데이트 (인증 필요)
- `DELETE /api/videos/:id`: 비디오 삭제 (인증 필요)

## 라이센스

이 프로젝트는 MIT 라이센스 하에 제공됩니다.