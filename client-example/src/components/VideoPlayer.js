import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import videoProgressService from '../services/videoProgressService';

const VideoPlayer = ({ videoId }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // 업데이트 타이머
  const updateIntervalRef = useRef(null);
  
  // 마지막 업데이트 시간 기록
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    // 비디오 초기화
    const initVideo = async () => {
      if (!videoId) return;
      
      const video = videoRef.current;
      if (!video) return;
      
      // 기존 진행 상황 로드
      try {
        const progress = await videoProgressService.getVideoProgress(videoId);
        if (progress) {
          setCurrentTime(progress.lastPosition);
          setProgress(progress.progress);
          setIsCompleted(progress.completed);
          
          // 저장된 위치로 이동
          if (progress.lastPosition > 0) {
            video.currentTime = progress.lastPosition;
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
      
      // HLS 플레이어 설정
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        
        hls.loadSource(`/api/videos/${videoId}/stream`);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed');
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
        });
        
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // iOS 기기는 네이티브 HLS 지원
        video.src = `/api/videos/${videoId}/stream`;
      }
    };
    
    initVideo();
    
    return () => {
      // 정리
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [videoId]);
  
  // 비디오 이벤트 핸들러
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const onPlay = () => {
      setIsPlaying(true);
      
      // 주기적으로 진행 상황 업데이트 (10초마다)
      updateIntervalRef.current = setInterval(() => {
        updateProgress();
      }, 10000);
    };
    
    const onPause = () => {
      setIsPlaying(false);
      
      // 일시 정지 시 진행 상황 업데이트
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      updateProgress();
    };
    
    const onTimeUpdate = () => {
      const current = Math.floor(video.currentTime);
      setCurrentTime(current);
      
      if (duration > 0) {
        const progressValue = Math.floor((current / duration) * 100);
        setProgress(progressValue);
      }
    };
    
    const onDurationChange = () => {
      setDuration(Math.floor(video.duration));
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      setIsCompleted(true);
      
      // 완료 처리
      markAsCompleted();
    };
    
    // 이벤트 리스너 등록
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('ended', onEnded);
    
    return () => {
      // 이벤트 리스너 제거
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('ended', onEnded);
    };
  }, [videoId, duration]);
  
  // 진행 상황 업데이트 함수
  const updateProgress = async () => {
    const video = videoRef.current;
    if (!video || !videoId) return;
    
    const now = Date.now();
    // 너무 자주 업데이트하지 않도록 제한 (최소 3초 간격)
    if (now - lastUpdateRef.current < 3000) return;
    
    lastUpdateRef.current = now;
    
    const current = Math.floor(video.currentTime);
    const progressValue = duration > 0 ? Math.floor((current / duration) * 100) : 0;
    
    try {
      await videoProgressService.updateVideoProgress(videoId, {
        lastPosition: current,
        progress: progressValue,
        completed: isCompleted
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };
  
  // 완료 표시 함수
  const markAsCompleted = async () => {
    if (!videoId) return;
    
    try {
      const result = await videoProgressService.markVideoAsCompleted(videoId);
      setIsCompleted(true);
      console.log('Video marked as completed:', result);
    } catch (error) {
      console.error('Failed to mark video as completed:', error);
    }
  };

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        controls
        width="100%"
        height="auto"
        playsInline
        preload="auto"
      />
      
      {isCompleted && (
        <div className="completion-badge">
          <span>✓ 학습 완료</span>
        </div>
      )}
      
      <div className="progress-info">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="time-info">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

// 시간 포맷 함수 (초 -> MM:SS)
const formatTime = (seconds) => {
  if (!seconds) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default VideoPlayer;