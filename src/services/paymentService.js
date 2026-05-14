import api from './apiClient';

export const paymentService = {
  saveCard: (paymentMethodToken, last4) =>
    api.post('/payments/card', { paymentMethodToken, last4 }),
  proceed: (plan, paymentMethodToken) =>
    api.post('/payments/proceed', { plan, paymentMethodToken }),
  history: () => api.get('/payments/history'),
};
