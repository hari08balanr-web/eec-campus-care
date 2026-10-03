import React from 'react';
import { getStatusColor } from '../utils/helpers';
import { FiClock, FiEye, FiTool, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const color = getStatusColor(status);
  
  const getIcon = () => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FiClock />;
      case 'in review': return <FiEye />;
      case 'in progress': return <FiTool />;
      case 'resolved': return <FiCheckCircle />;
      case 'rejected': return <FiXCircle />;
      default: return null;
    }
  };

  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${color}20`, 
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      {getIcon()}
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
