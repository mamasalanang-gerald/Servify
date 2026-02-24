import api from "./api";

export const reviewService = {
  async createReview(reviewData) {
    const response = await api.post("/reviews", reviewData);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Failed to create review");
    }

    return data;
  },

  async getProviderReviews(providerId) {
    const response = await api.get(`/reviews/provider/${providerId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch provider reviews");
    }
    return await response.json();
  },
};

