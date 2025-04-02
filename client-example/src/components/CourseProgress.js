import React, { useEffect, useState } from 'react';
import videoProgressService from '../services/videoProgressService';

const CourseProgress = ({ courseId, videos }) => {
  const [progressData, setProgressData] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const allProgress = await videoProgressService.getAllVideoProgress();
        
        if (videos && videos.length > 0) {
          // 현재 코스의 비디오에 대한 진행 상황만 필터링
          const courseVideosIds = videos.map(video => video.id);
          const courseProgress = allProgress.filter(
            progress => courseVideosIds.includes(progress.videoId)
          );
          
          setProgressData(courseProgress);
          
          // 전체 진행률 계산
          if (courseProgress.length > 0) {
            const total = courseProgress.reduce((sum, item) => sum + item.progress, 0);
            const avgProgress = Math.floor(total / videos.length);
            setTotalProgress(avgProgress);
          }
        }
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId && videos) {
      fetchProgress();
    }
  }, [courseId, videos]);

  if (isLoading) {
    return <div className="loading">진행 상황을 불러오는 중...</div>;
  }

  return (
    <div className="course-progress">
      <h3>강의 진행 상황</h3>
      
      <div className="overall-progress">
        <div className="progress-label">
          전체 진행률: {totalProgress}%
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      <div className="videos-progress">
        <h4>강의별 진행 상황</h4>
        {videos && videos.map(video => {
          const videoProgress = progressData.find(p => p.videoId === video.id);
          const progress = videoProgress ? videoProgress.progress : 0;
          const completed = videoProgress ? videoProgress.completed : false;
          
          return (
            <div key={video.id} className="video-progress-item">
              <div className="video-title">
                {completed && <span className="completed-badge">✓</span>}
                {video.title}
              </div>
              <div className="video-progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-percentage">{progress}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseProgress;