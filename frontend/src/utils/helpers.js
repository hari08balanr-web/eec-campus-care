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

export const resolveMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('https://') || url.startsWith('http://')) {
    if (url.includes('localhost:8080') && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      const path = url.split('localhost:8080')[1];
      if (window.location.hostname.includes('onrender.com')) {
        return path;
      }
      return 'https://eec-campus-care.onrender.com' + path;
    }
    return url;
  }
  return url;
};
