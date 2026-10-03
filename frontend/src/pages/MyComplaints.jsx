import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
import api from '../services/api';

const TABS = ['All', 'Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'];

const MyComplaints = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
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

  const filtered = activeTab === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === activeTab || (activeTab === 'Pending' && c.status === 'In Review'));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>My Complaints</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: activeTab === tab ? '1px solid var(--primary)' : '1px solid rgba(128,128,128,0.2)',
              background: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
              color: activeTab === tab ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '4px solid var(--primary)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : filtered.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
        >
          {filtered.map(complaint => (
            <ComplaintCard key={complaint.id || complaint._id} complaint={complaint} />
          ))}
        </motion.div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(var(--primary-rgb, 59,130,246), 0.1)', color: 'var(--primary)', marginBottom: '1rem' }}>
            <FiFileText size={32} />
          </div>
          <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>No complaints found for <strong>{activeTab}</strong></p>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
