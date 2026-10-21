import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/helpers';
import { 
  FiArrowLeft, FiUser, FiPhone, FiMail, FiCheckCircle, 
  FiMapPin, FiCalendar, FiClock, FiAlertCircle, FiVideo, FiImage
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';

const STATUSES = ['Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'];

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        // Support both ticketCode (starts with EEC-) and direct UUID
        if (id && id.toUpperCase().startsWith('EEC-')) {
          res = await api.trackComplaint(id);
        } else {
          res = await api.getAdminComplaintDetail(id);
        }
        
        if (res.data) {
          setComplaint(res.data);
          setStatusUpdate(res.data.status || 'Pending');
          setRemarks(res.data.adminRemarks || '');
        } else {
          setError("Complaint record not found.");
        }
      } catch (err) {
        console.error('Failed to fetch complaint:', err);
        setError("Could not load complaint details. Please check the ID or network connection.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchComplaint();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!complaint) return;
    
    setUpdating(true);
    setUpdateSuccess(false);
    try {
      const complaintId = complaint.id || id;
      const res = await api.updateComplaintStatus(complaintId, {
        status: statusUpdate,
        adminRemarks: remarks
      });
      setComplaint(res.data);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Retrieving Complaint Evidence & Data...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <FiAlertCircle className="text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Complaint Not Found</h3>
        <p className="text-sm text-slate-500">{error || "The requested grievance does not exist."}</p>
        <button onClick={() => navigate('/admin/complaints')} className="btn-primary mt-2">
          <FiArrowLeft /> Return to Manage Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/complaints')} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/60"
        >
          <FiArrowLeft /> Back to Complaints List
        </button>
        <div className="text-xs font-mono bg-white/70 px-3 py-1 rounded-full border border-slate-200 text-slate-600">
          ID: {complaint.id || id}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column (8 Cols): Details, Description & Evidence */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 sm:p-8 space-y-6 border border-white/80"
          >
            {/* Header: Ticket Code, Category & Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Ticket Reference
                </span>
                <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                  {complaint.ticketCode}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mt-2">
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md">{complaint.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FiCalendar /> {formatDate(complaint.complaintDate || complaint.createdAt)}</span>
                  {complaint.complaintTime && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1"><FiClock /> {complaint.complaintTime}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="sm:text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Current State</span>
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            {/* Location Grid */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Campus Block</span>
                <p className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FiMapPin className="text-primary" /> {complaint.block || 'Campus Premise'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Floor / Room No</span>
                <p className="text-base font-bold text-slate-800">
                  {complaint.floor || 'Not Specified'}
                </p>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Problem Description
              </span>
              <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed shadow-sm whitespace-pre-line">
                {complaint.description}
              </div>
            </div>

            {/* Attached Photo Evidence */}
            {complaint.photoUrl && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                  <FiImage className="text-primary" /> Live Captured Photo Evidence
                </span>
                <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-black max-w-xl">
                  <img 
                    src={complaint.photoUrl} 
                    alt="Complaint Evidence" 
                    className="w-full max-h-96 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Attached Video Evidence */}
            {complaint.videoUrl && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                  <FiVideo className="text-primary" /> Live Recorded Video Evidence
                </span>
                <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-black max-w-xl">
                  <video 
                    src={complaint.videoUrl} 
                    controls 
                    playsInline 
                    className="w-full max-h-96"
                  />
                </div>
              </div>
            )}

          </motion.div>
        </div>

        {/* Sidebar Column (4 Cols): Update Status & Student Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status Update Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 shadow-xl border border-white/80"
          >
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Update Status</h3>
            <p className="text-xs text-slate-500 mb-4">
              Change the status to notify the student via email with remarks.
            </p>
            
            {updateSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4 animate-in fade-in">
                <FiCheckCircle className="text-base" /> Status updated! Student notified.
              </div>
            )}
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resolution Status
                </label>
                <select 
                  value={statusUpdate} 
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="glass-input font-semibold"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Remarks
                </label>
                <textarea 
                  rows="4" 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Provide resolution notes, assigned technician, or reasoning (visible to student)..."
                  className="glass-input text-xs leading-relaxed resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full py-3 text-sm justify-center"
                disabled={updating}
              >
                {updating ? 'Saving Status...' : 'Save & Notify Student'}
              </button>
            </form>
          </motion.div>

          {/* Student Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 shadow-sm border border-white/80 space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Student Details
            </h3>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-200/70">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 text-primary flex items-center justify-center font-bold text-lg">
                <FiUser />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-base">{complaint.name || 'Anonymous'}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {complaint.className || 'General'} {complaint.year ? `• Year ${complaint.year}` : ''}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-medium">
              {complaint.email && (
                <a 
                  href={`mailto:${complaint.email}`} 
                  className="flex items-center gap-2.5 text-slate-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-50"
                >
                  <FiMail className="text-primary text-sm" /> 
                  <span className="truncate">{complaint.email}</span>
                </a>
              )}
              {complaint.mobile && (
                <a 
                  href={`tel:${complaint.mobile}`} 
                  className="flex items-center gap-2.5 text-slate-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-50"
                >
                  <FiPhone className="text-primary text-sm" /> 
                  <span>{complaint.mobile}</span>
                </a>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default AdminComplaintDetail;
