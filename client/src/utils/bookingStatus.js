export const normalizeBookingStatus = (status) => {
  const current = String(status || 'pending').toLowerCase();
  if (current === 'accepted') return 'confirmed';
  if (current === 'rejected') return 'cancelled';
  return current;
};

export const toApiBookingStatus = (uiStatus) => (
  uiStatus === 'confirmed' ? 'accepted' : uiStatus
);

export const formatBookingStatus = (status) => {
  const normalized = normalizeBookingStatus(status);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};
