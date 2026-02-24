import api from "./api";

export const savedServiceService = {
  async getSaved() {
    const response = await api.get("/saved-services");
    if (!response.ok) throw new Error("Failed to fetch saved services");
    return await response.json();
  },

  async save(serviceId) {
    const response = await api.post(`/saved-services/${serviceId}`);
    if (!response.ok) throw new Error("Failed to save service");
    return await response.json();
  },

  async unsave(serviceId) {
    const response = await api.delete(`/saved-services/${serviceId}`);
    if (!response.ok) throw new Error("Failed to unsave service");
    return await response.json();
  },
};