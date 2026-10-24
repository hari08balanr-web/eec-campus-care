import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatDate, truncateText, resolveMediaUrl } from '../utils/helpers';
import { FiChevronRight, FiCalendar, FiTag, FiTrash2, FiImage } from 'react-icons/fi';

const ComplaintCard = ({ complaint, isAdmin = false, onDelete = null }) => {
  const complaintId = complaint.id || complaint._id || complaint.ticketCode;
  const linkPath = isAdmin ? `/admin/complaints/${complaintId}` : `/track/${complaint.ticketCode}`;
  const photo = resolveMediaUrl(complaint.photoUrl);

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
        
        {/* Photo Evidence Preview */}
        {photo && (
          <div className="mb-3 rounded-xl overflow-hidden h-36 bg-slate-900/5 border border-slate-200/80 relative">
            <img 
              src={photo} 
              alt="Live Evidence" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
            />
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-sm">
              <FiImage /> Photo Evidence
            </span>
          </div>
        )}

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
