import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import ComplaintCard from '../components/ComplaintCard';
import { FiUsers, FiFileText, FiClock, FiCheckCircle, FiTool, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          api.getAdminStats(),
          api.getAdminComplaints()
        ]);
        setStats(statsRes.data);
        setRecentComplaints((complaintsRes.data || []).slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid var(--primary)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-primary">Admin Dashboard</h1>
          <p className="opacity-70">Overview of all college complaints</p>
        </div>
        <button onClick={() => navigate('/admin/complaints')} className="btn-primary">
          View All Complaints
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard title="Total" value={stats.totalComplaints || 0} icon={<FiFileText size={20}/>} color="#6366f1" delay={0.1} />
          <StatsCard title="Pending" value={stats.pending || 0} icon={<FiClock size={20}/>} color="#f59e0b" delay={0.2} />
          <StatsCard title="In Review" value={stats.inReview || 0} icon={<FiUsers size={20}/>} color="#3b82f6" delay={0.3} />
          <StatsCard title="In Progress" value={stats.inProgress || 0} icon={<FiTool size={20}/>} color="#8b5cf6" delay={0.4} />
          <StatsCard title="Resolved" value={stats.resolved || 0} icon={<FiCheckCircle size={20}/>} color="#10b981" delay={0.5} />
          <StatsCard title="Rejected" value={stats.rejected || 0} icon={<FiXCircle size={20}/>} color="#ef4444" delay={0.6} />
        </div>
      )}

      {/* Category Breakdown */}
      {stats?.categoryBreakdown && Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Complaints by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
              <div
                key={cat}
                onClick={() => navigate(`/admin/complaints?category=${cat}`)}
                style={{
                  padding: '0.75rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(128,128,128,0.1)',
                  transition: 'all 0.2s ease'
                }}
                className="hover:shadow-md"
              >
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{count}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{cat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4">Recent Complaints</h3>
        {recentComplaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentComplaints.map(complaint => (
              <ComplaintCard key={complaint.id || complaint._id} complaint={complaint} isAdmin={true} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center opacity-70">
            No complaints yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
