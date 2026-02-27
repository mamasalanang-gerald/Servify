const pad = (value) => String(value).padStart(2, '0');

export const formatBookingTime = (timeValue) => {
  if (!timeValue) return '—';

  const raw = String(timeValue).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return raw;

  const hours24 = Number(match[1]);
  const minutes = match[2];
  if (!Number.isFinite(hours24) || hours24 < 0 || hours24 > 23) return raw;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${pad(hours12)}:${minutes} ${period}`;
};

export const BOOKING_TIME_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const hour = index + 7;
  const value = `${pad(hour)}:00`;
  return {
    value,
    label: formatBookingTime(`${value}:00`),
  };
});
