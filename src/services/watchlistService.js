import api from './apiClient';

export const watchlistService = {
  get: (profileId) => api.get(`/watchlist/${profileId}`),
  add: (profileId, videoTitle) => api.post('/watchlist', { profileId, videoTitle }),
  remove: (profileId, videoTitle) =>
    api.delete(`/watchlist/${profileId}/${encodeURIComponent(videoTitle)}`),
  check: (profileId, videoTitle) =>
    api.get(`/watchlist/${profileId}/check/${encodeURIComponent(videoTitle)}`),
};
