import api from './api';

export const providerService = {
  // Get provider earnings summary
  getEarningsSummary: async (providerId) => {
    const response = await api.get(`/api/providers/${providerId}/earnings/summary`);
    return response.data;
  },

  // Get provider transactions
  getTransactions: async (providerId) => {
    const response = await api.get(`/api/providers/${providerId}/earnings/transactions`);
    return response.data;
  },

  // Get provider payouts
  getPayouts: async (providerId) => {
    const response = await api.get(`/api/providers/${providerId}/earnings/payouts`);
    return response.data;
  },

  // Get monthly earnings data
  getMonthlyEarnings: async (providerId, months = 6) => {
    const response = await api.get(`/api/providers/${providerId}/earnings/monthly?months=${months}`);
    return response.data;
  },
};
