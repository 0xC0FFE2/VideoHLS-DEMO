import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseProgress from '../components/CourseProgress';

const CourseDetailsPage = ({ match }) => {
  const courseId = match.params.courseId;
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        
        // 코스 정보 가져오기 (API가 존재한다고 가정)
        const courseResponse = await axios.get(`/api/courses/${courseId}`);
        setCourse(courseResponse.data);
        
        // 해당 코스의 모든 비디오 가져오기
        const videosResponse = await axios.get(`/api/videos/course/${courseId}`);
        setVideos(videosResponse.data);
        
        setIsLoading(false);
      } catch (err) {
        setError('코스 정보를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
        console.error('Error fetching course data:', err);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (isLoading) {
    return <div className="loading">코스 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!course) {
    return <div className="not-found">코스를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="course-details-page">
      <div className="course-header">
        <h1>{course.title}</h1>
        <div className="course-info">
          <div className="course-thumbnail">
            <img src={course.imageUrl} alt={course.title} />
          </div>
          <div className="course-details">
            <p className="description">{course.description}</p>
            <div className="instructor">
              <span className="label">강사:</span> {course.author ? course.author.name : '정보 없음'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="course-progress-section">
        <CourseProgress 
          courseId={courseId} 
          videos={videos}
        />
      </div>
      
      <div className="course-content">
        <h2>강의 목록</h2>
        <div className="videos-list">
          {videos.length === 0 ? (
            <p>등록된 강의가 없습니다.</p>
          ) : (
            <ul>
              {videos.map((video, index) => (
                <li key={video.id} className="video-item">
                  <div className="video-number">{index + 1}</div>
                  <div className="video-info">
                    <a href={`/videos/${video.id}`} className="video-title">
                      {video.title}
                    </a>
                    <div className="video-meta">
                      <span className="duration">{formatDuration(video.duration)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// 시간 포맷 함수 (초 -> HH:MM:SS)
const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default CourseDetailsPage;