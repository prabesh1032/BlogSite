export const resolveImageUrl = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  if (value.startsWith("http") || value.startsWith("blob:") || value.startsWith("data:")) {
    return value;
  }

  return `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${value}`;
};