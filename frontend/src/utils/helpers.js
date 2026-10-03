export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString; // Assumes HH:mm format
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return '#f59e0b';
    case 'in review': return '#3b82f6';
    case 'in progress': return '#8b5cf6';
    case 'resolved': return '#10b981';
    case 'rejected': return '#ef4444';
    default: return '#6b7280';
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateTicketDisplay = (code) => {
  return code || 'N/A';
};
