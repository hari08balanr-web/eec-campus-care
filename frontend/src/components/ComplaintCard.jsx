import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatDate, truncateText } from '../utils/helpers';
import { FiChevronRight, FiCalendar, FiTag, FiTrash2 } from 'react-icons/fi';

const ComplaintCard = ({ complaint, isAdmin = false, onDelete = null }) => {
  const complaintId = complaint.id || complaint._id || complaint.ticketCode;
  const linkPath = isAdmin ? `/admin/complaints/${complaintId}` : `/track/${complaint.ticketCode}`;

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(complaintId, complaint.ticketCode);
    }
  };

  return (
    <Link to={linkPath} className="block group">
      <div className="glass-card p-5 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-bold text-lg mb-1">{complaint.ticketCode}</h4>
            <div className="flex items-center gap-3 text-sm opacity-70">
              <span className="flex items-center gap-1"><FiTag /> {complaint.category}</span>
              <span className="flex items-center gap-1"><FiCalendar /> {formatDate(complaint.complaintDate)}</span>
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
        
        <p className="text-sm mb-4 opacity-80">
          {truncateText(complaint.description, 80)}
        </p>
        
        <div className="flex justify-between items-center text-sm font-medium pt-2 border-t border-slate-100">
          {isAdmin && onDelete ? (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Delete Complaint"
            >
              <FiTrash2 /> Delete
            </button>
          ) : <span />}
          
          <div className="flex items-center text-primary gap-1">
            View Details <FiChevronRight />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ComplaintCard;
