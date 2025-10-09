export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString('en-EN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDetailDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString('en-EN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
