import api from './apiClient';

export const videoService = {
  suggestions: (limit = 20) => api.get(`/videos/suggestions?limit=${limit}`),
  search: (query) => api.get(`/videos?q=${encodeURIComponent(query)}`),
  byGenre: (genre) => api.get(`/videos/genre/${encodeURIComponent(genre)}`),
  getByTitle: (title) => api.get(`/videos/${encodeURIComponent(title)}`),
};
