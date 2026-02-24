import api from './api';

export const providerService = {
  async parseResponse(response, fallbackMessage) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || fallbackMessage);
    }
    return data;
  },

  // Get provider earnings summary
  getEarningsSummary: async (providerId) => {
    const response = await api.get(`/providers/${providerId}/earnings/summary`);
    return providerService.parseResponse(response, 'Failed to fetch earnings summary');
  },

  // Get provider transactions
  getTransactions: async (providerId) => {
    const response = await api.get(`/providers/${providerId}/earnings/transactions`);
    return providerService.parseResponse(response, 'Failed to fetch transactions');
  },

  // Get provider payouts
  getPayouts: async (providerId) => {
    const response = await api.get(`/providers/${providerId}/earnings/payouts`);
    return providerService.parseResponse(response, 'Failed to fetch payouts');
  },

  // Get monthly earnings data
  getMonthlyEarnings: async (providerId, months = 6) => {
    const response = await api.get(`/providers/${providerId}/earnings/monthly?months=${months}`);
    return providerService.parseResponse(response, 'Failed to fetch monthly earnings');
  },
};
