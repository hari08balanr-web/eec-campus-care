import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiCheck, FiCopy, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';
import api from '../services/api';

const STEPS = ['Pending', 'In Review', 'In Progress', 'Resolved'];

const TrackComplaint = () => {
  const { ticketCode } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(ticketCode || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchComplaint = async (code) => {
    if (!code) return;
    setLoading(true);
    setError('');
    setComplaint(null);
    try {
      const response = await api.trackComplaint(code.trim().toUpperCase());
      setComplaint(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No complaint found for this ticket code. Please check and try again.');
      } else {
        setError('Error fetching complaint details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketCode) {
      fetchComplaint(ticketCode);
    }
  }, [ticketCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim().toUpperCase()}`);
    }
  };

  const copyTicketCode = () => {
    if (complaint?.ticketCode) {
      navigator.clipboard.writeText(complaint.ticketCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCurrentStepIndex = (status) => {
    if (status === 'Rejected') return -1;
    return STEPS.indexOf(status);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          🔍 Track Your Complaint
        </h2>
        <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto 2rem' }}>
          Enter your ticket code below to check the real-time status of your complaint.
        </p>

        <form onSubmit={handleSearch} style={{
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1.2rem'
            }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              placeholder="e.g. EEC-2026-0001"
              className="glass-input"
              style={{
                paddingLeft: '2.8rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
            Track
          </button>
        </form>
      </motion.div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '4px solid var(--primary)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          {error}
        </motion.div>
      )}

      {complaint && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: '2rem' }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            flexWrap: 'wrap', gap: '1rem',
            borderBottom: '1px solid rgba(128,128,128,0.15)', paddingBottom: '1.5rem', marginBottom: '2rem'
          }}>
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.25rem' }}>Ticket Code</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {complaint.ticketCode}
                </h3>
                <button
                  onClick={copyTicketCode}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: copied ? 'var(--success, #22c55e)' : 'var(--text-secondary)',
                    fontSize: '1rem'
                  }}
                  title="Copy ticket code"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.25rem' }}>Current Status</p>
              <StatusBadge status={complaint.status} />
            </div>
          </div>

          {/* Status Timeline */}
          {complaint.status !== 'Rejected' ? (
            <div style={{ marginBottom: '2.5rem', position: 'relative', padding: '0 1rem' }}>
              {/* Progress bar background */}
              <div style={{
                position: 'absolute', left: '1rem', right: '1rem',
                top: '16px', height: '4px',
                background: 'rgba(128,128,128,0.15)', borderRadius: '2px'
              }} />
              {/* Progress bar filled */}
              <div style={{
                position: 'absolute', left: '1rem',
                top: '16px', height: '4px',
                width: `${(getCurrentStepIndex(complaint.status) / (STEPS.length - 1)) * 100}%`,
                background: 'var(--primary)', borderRadius: '2px',
                transition: 'width 0.5s ease'
              }} />

              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                {STEPS.map((step, idx) => {
                  const currentIdx = getCurrentStepIndex(complaint.status);
                  const isCompleted = idx <= currentIdx;
                  const isActive = idx === currentIdx;

                  return (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isCompleted ? 'var(--primary)' : 'rgba(128,128,128,0.15)',
                        color: isCompleted ? '#fff' : 'rgba(128,128,128,0.5)',
                        fontWeight: 600, fontSize: '0.8rem',
                        boxShadow: isActive ? '0 0 0 4px rgba(var(--primary-rgb, 59,130,246), 0.2)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        {isCompleted ? <FiCheck /> : <span>{idx + 1}</span>}
                      </div>
                      <span style={{
                        marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        textAlign: 'center'
                      }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{
              marginBottom: '2rem', padding: '1rem',
              background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444',
              borderRadius: '12px', textAlign: 'center', fontWeight: 500,
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              ❌ This complaint has been rejected. See admin remarks below.
            </div>
          )}

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Complaint Info */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Category
                </h4>
                <p style={{ fontWeight: 500 }}>{complaint.category}</p>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  <FiMapPin /> {complaint.block}{complaint.floor ? `, ${complaint.floor}` : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  <FiCalendar /> {formatDate(complaint.complaintDate || complaint.createdAt)}
                </div>
                {complaint.complaintTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', opacity: 0.8 }}>
                    <FiClock /> {complaint.complaintTime}
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Description
                </h4>
                <p style={{
                  background: 'rgba(255,255,255,0.5)', padding: '0.75rem 1rem',
                  borderRadius: '10px', fontSize: '0.9rem', lineHeight: 1.6,
                  border: '1px solid rgba(128,128,128,0.1)'
                }}>
                  {complaint.description}
                </p>
              </div>

              {complaint.adminRemarks && (
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                    Admin Remarks
                  </h4>
                  <p style={{
                    background: 'rgba(var(--primary-rgb, 59,130,246), 0.05)',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px', fontSize: '0.9rem', lineHeight: 1.6,
                    border: '1px solid rgba(var(--primary-rgb, 59,130,246), 0.15)',
                    color: 'var(--primary)', fontWeight: 500
                  }}>
                    {complaint.adminRemarks}
                  </p>
                </div>
              )}
            </div>

            {/* Media */}
            {(complaint.photoUrl || complaint.videoUrl) && (
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Attached Media
                </h4>
                {complaint.photoUrl && (
                  <img
                    src={complaint.photoUrl}
                    alt="Complaint"
                    style={{
                      width: '100%', borderRadius: '12px',
                      border: '1px solid rgba(128,128,128,0.15)',
                      marginBottom: complaint.videoUrl ? '1rem' : 0
                    }}
                  />
                )}
                {complaint.videoUrl && (
                  <video
                    src={complaint.videoUrl}
                    controls
                    style={{
                      width: '100%', borderRadius: '12px',
                      border: '1px solid rgba(128,128,128,0.15)'
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Help text at bottom */}
      {!complaint && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5 }}
        >
          <p style={{ fontSize: '0.9rem' }}>
            Your ticket code was sent to your email when the complaint was registered.
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Format: <strong>EEC-YYYY-NNNN</strong> (e.g., EEC-2026-0001)
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TrackComplaint;
