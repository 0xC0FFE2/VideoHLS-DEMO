import axios from 'axios';

const API_URL = '/api/video-progress';

class VideoProgressService {
  // 비디오 진행 상황 가져오기
  async getVideoProgress(videoId) {
    try {
      const response = await axios.get(`${API_URL}/${videoId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get video progress:', error);
      return null;
    }
  }

  // 비디오 진행 상황 업데이트
  async updateVideoProgress(videoId, progressData) {
    try {
      const response = await axios.put(`${API_URL}/${videoId}`, progressData);
      return response.data;
    } catch (error) {
      console.error('Failed to update video progress:', error);
      return null;
    }
  }

  // 비디오 시청 완료 표시
  async markVideoAsCompleted(videoId) {
    try {
      const response = await axios.post(`${API_URL}/${videoId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Failed to mark video as completed:', error);
      return null;
    }
  }

  // 모든 비디오 진행 상황 가져오기
  async getAllVideoProgress() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Failed to get all video progress:', error);
      return [];
    }
  }
}

export default new VideoProgressService();