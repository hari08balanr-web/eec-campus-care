import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiSearch, FiFileText, FiClock, FiTool, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ComplaintCard from '../components/ComplaintCard';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.getMyComplaints(user.email);
        setComplaints(res.data || []);
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchComplaints();
  }, [user]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending' || c.status === 'In Review').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
          <p className="opacity-70">Track and manage your college complaints.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/track')} className="btn-outline bg-white/50">
            <FiSearch /> Track
          </button>
          <button onClick={() => navigate('/new-complaint')} className="btn-primary">
            <FiPlus /> New Complaint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Complaints" value={stats.total} icon={<FiFileText size={24}/>} color="#6366f1" delay={0.1} />
        <StatsCard title="Pending" value={stats.pending} icon={<FiClock size={24}/>} color="#f59e0b" delay={0.2} />
        <StatsCard title="In Progress" value={stats.inProgress} icon={<FiTool size={24}/>} color="#8b5cf6" delay={0.3} />
        <StatsCard title="Resolved" value={stats.resolved} icon={<FiCheckCircle size={24}/>} color="#10b981" delay={0.4} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Recent Complaints</h3>
          <button onClick={() => navigate('/my-complaints')} className="text-primary text-sm font-medium hover:underline">
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-white/30 rounded-xl"></div>)}
          </div>
        ) : complaints.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {complaints.slice(0, 4).map(complaint => (
              <motion.div key={complaint._id} variants={{ hidden: { opacity:0, y:20 }, show: { opacity:1, y:0 } }}>
                <ComplaintCard complaint={complaint} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass-card p-10 text-center">
            <div className="inline-block p-4 rounded-full bg-primary/10 text-primary mb-4">
              <FiFileText size={32} />
            </div>
            <h4 className="text-lg font-medium mb-2">No Complaints Yet</h4>
            <p className="opacity-70 mb-4">You haven't filed any complaints. Everything looks good!</p>
            <button onClick={() => navigate('/new-complaint')} className="btn-primary">
              <FiPlus /> File a Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
