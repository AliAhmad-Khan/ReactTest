// Utility functions for date parsing and formatting

export function parseDateString(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split(/[\/-]/);
  if (parts.length !== 3) return new Date(dateStr);
  let day = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);
  if (day > 12) {
    return new Date(year, month - 1, day);
  } else if (month > 12) {
    return new Date(year, day - 1, month);
  } else {
    return new Date(year, month - 1, day);
  }
}
