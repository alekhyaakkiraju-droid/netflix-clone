import api from './apiClient';

export const profileService = {
  list: () => api.get('/profiles'),
  get: (profileId) => api.get(`/profiles/${profileId}`),
  create: (profileName, avatarUrl, gameHandle) =>
    api.post('/profiles', { profileName, avatarUrl, gameHandle }),
  update: (profileId, data) => api.put(`/profiles/${profileId}`, data),
  delete: (profileId) => api.delete(`/profiles/${profileId}`),
  validateName: (profileName) =>
    api.get(`/profiles/validate/name/${encodeURIComponent(profileName)}`),
  validateHandle: (gameHandle) =>
    api.get(`/profiles/validate/handle/${encodeURIComponent(gameHandle)}`),
};
