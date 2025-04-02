import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import CourseProgress from '../components/CourseProgress';

const VideoPlayerPage = ({ match }) => {
  const videoId = match.params.videoId;
  const [video, setVideo] = useState(null);
  const [courseVideos, setCourseVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setIsLoading(true);
        
        // 비디오 정보 가져오기
        const videoResponse = await axios.get(`/api/videos/${videoId}`);
        setVideo(videoResponse.data);
        
        if (videoResponse.data.courseId) {
          // 해당 코스의 모든 비디오 가져오기
          const courseVideosResponse = await axios.get(`/api/videos/course/${videoResponse.data.courseId}`);
          setCourseVideos(courseVideosResponse.data);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('비디오를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
        console.error('Error fetching video data:', err);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  if (isLoading) {
    return <div className="loading">비디오를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!video) {
    return <div className="not-found">비디오를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="video-player-page">
      <h1>{video.title}</h1>
      <div className="video-container">
        <VideoPlayer videoId={videoId} />
      </div>
      
      <div className="video-details">
        <p className="description">{video.description}</p>
        
        {video.courseId && courseVideos.length > 0 && (
          <div className="course-container">
            <h2>{video.courseTitle}</h2>
            <CourseProgress 
              courseId={video.courseId} 
              videos={courseVideos}
            />
            
            <div className="course-videos">
              <h3>강의 목록</h3>
              <ul>
                {courseVideos.map(courseVideo => (
                  <li 
                    key={courseVideo.id} 
                    className={courseVideo.id === videoId ? 'active' : ''}
                  >
                    <a href={`/videos/${courseVideo.id}`}>
                      {courseVideo.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPage;