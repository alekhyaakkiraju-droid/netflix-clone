import api from './apiClient';

export const subscriptionService = {
  get: () => api.get('/subscriptions'),
  create: (plan) => api.post('/subscriptions', { plan }),
  update: (plan) => api.put('/subscriptions', { plan }),
  cancel: () => api.delete('/subscriptions'),
};
