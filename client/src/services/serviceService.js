import api from "./api";

export const serviceService = {
  async getServices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/services?${queryString}` : "/services";
    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch services");
    return await response.json();
  },

  async getServiceById(id) {
    const response = await api.get(`/services/${id}`);
    if (!response.ok) throw new Error("Failed to fetch service");
    return await response.json();
  },

  async getServiceReviews(id) {
    const response = await api.get(`/services/${id}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return await response.json();
  },

  async getMyServices() {
    const response = await api.get("/services/mine");
    if (!response.ok) throw new Error("Failed to fetch my services");
    return await response.json();
  },

  async createService(serviceData) {
    const response = await api.post("/services/create", serviceData);
    if (!response.ok) throw new Error("Failed to create service");
    return await response.json();
  },

  async updateService(id, serviceData) {
    const response = await api.put(`/services/edit/${id}`, serviceData);
    if (!response.ok) throw new Error("Failed to update service");
    return await response.json();
  },

  async deleteService(id) {
    const response = await api.delete(`/services/${id}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorDetails = [data.message, data.error].filter(Boolean).join(" - ");
      throw new Error(errorDetails || "Failed to delete service");
    }

    return data;
  },

  async updateServiceStatus(id, is_active) {
    const response = await api.patch(`/services/${id}/status`, { is_active });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update service status");
    }
    return await response.json();
  },
};
