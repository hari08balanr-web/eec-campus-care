import React, { useState, useEffect } from 'react';
import ComplaintCard from '../components/ComplaintCard';
import { FiSearch, FiFilter, FiInbox, FiRefreshCw } from 'react-icons/fi';
import api from '../services/api';

const CATEGORIES = [
  'All Categories', 'Infrastructure', 'Hostel', 'Health Centre', 'Transport', 'Library',
  'Canteen', 'Bank', 'Lift', 'Auditorium', 'Internet/Intranet',
  'Power Supply', 'Sports', 'Gym', 'Classroom', 'Lab', 'Others'
];

const STATUSES = ['All Status', 'Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'];

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchCode, setSearchCode] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const category = categoryFilter !== 'All Categories' ? categoryFilter : undefined;
      const status = statusFilter !== 'All Status' ? statusFilter : undefined;
      const res = await api.getAdminComplaints(category, status);
      setComplaints(res.data || []);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, statusFilter]);

  // Client-side search by ticket code or keyword
  const filtered = complaints.filter(c => {
    const q = searchCode.toLowerCase().trim();
    if (!q) return true;
    return (
      c.ticketCode?.toLowerCase().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.block?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Facility Complaints
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review live submitted grievances, verify photo/video evidence, and update student ticket statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Filed</span>
            <span className="text-xl font-extrabold text-primary">{complaints.length}</span>
          </div>
          <button 
            onClick={fetchComplaints} 
            className="p-3 rounded-xl glass-card hover:bg-white text-slate-600 hover:text-primary transition-all shadow-sm"
            title="Refresh Complaints"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="glass-card p-4 shadow-sm border border-white/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input 
              type="text" 
              placeholder="Search by Ticket Code (e.g. EEC-2026-0001), Block, Name..." 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="glass-input pl-10 text-sm !py-2.5"
            />
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-4 relative">
            <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="glass-input pl-10 text-sm !py-2.5 cursor-pointer appearance-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-3">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input text-sm !py-2.5 cursor-pointer"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading Complaints...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(complaint => (
            <ComplaintCard 
              key={complaint.id || complaint._id} 
              complaint={complaint} 
              isAdmin={true} 
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center space-y-4 max-w-lg mx-auto border border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FiInbox className="text-3xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No Complaints Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No complaint matches your search filter ({categoryFilter} / {statusFilter}).
            </p>
          </div>
          {(categoryFilter !== 'All Categories' || statusFilter !== 'All Status' || searchCode) && (
            <button 
              onClick={() => {
                setCategoryFilter('All Categories');
                setStatusFilter('All Status');
                setSearchCode('');
              }} 
              className="btn-outline text-xs !py-1.5 !px-3"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminComplaints;
