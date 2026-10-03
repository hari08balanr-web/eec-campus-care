import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CameraCapture from '../components/CameraCapture';
import { FiCopy, FiCheckCircle, FiAlertCircle, FiArrowRight, FiCheck } from 'react-icons/fi';
import api from '../services/api';

const CATEGORIES = [
  'Infrastructure', 'Hostel', 'Health Centre', 'Transport', 'Library',
  'Canteen', 'Bank', 'Lift', 'Auditorium', 'Internet/Intranet',
  'Power Supply', 'Sports', 'Gym', 'Classroom', 'Lab', 'Others'
];

const NewComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    className: user?.className || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    year: user?.year || '1',
    category: '',
    block: '',
    floor: '',
    description: '',
    complaintDate: new Date().toISOString().split('T')[0],
    complaintTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
  });

  const [photoBlob, setPhotoBlob] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.mobile.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.category.trim() !== '' &&
      formData.block.trim() !== '' &&
      formData.description.trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fill in all mandatory fields (Block, Category, Description, and Contact info).");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      
      if (photoBlob) data.append('photo', photoBlob, 'captured_photo.jpg');
      if (videoBlob) data.append('video', videoBlob, 'captured_video.webm');
      
      const res = await api.createComplaint(data);
      setSuccessTicket(res.data.ticketCode);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit complaint. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (successTicket) {
      navigator.clipboard.writeText(successTicket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (successTicket) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="glass-card p-8 sm:p-12 shadow-2xl border border-white/80 space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <FiCheckCircle size={44} />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Complaint Registered!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your grievance has been submitted to campus facility administrators. An email confirmation with tracking details has been queued.
            </p>
          </div>
          
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm inline-block min-w-[320px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Official Ticket Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-black text-primary font-mono tracking-wider">{successTicket}</span>
              <button 
                type="button"
                onClick={copyToClipboard}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-600"
                title="Copy Ticket Code"
              >
                {copied ? <FiCheck className="text-emerald-600" size={18} /> : <FiCopy size={18} />}
              </button>
            </div>
            {copied && <span className="text-xs font-semibold text-emerald-600 mt-1 block">Copied to clipboard!</span>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button onClick={() => navigate('/dashboard')} className="btn-outline">
              Back to Dashboard
            </button>
            <button onClick={() => navigate(`/track/${successTicket}`)} className="btn-primary">
              Track Complaint Status <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20 space-y-8">
      
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
          <span>Student Service</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Register New Facility Complaint</h1>
        <p className="text-sm text-slate-500 mt-1">
          Please provide accurate location details and live camera evidence for fast resolution by EEC maintenance teams.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Student Information Section */}
        <div className="glass-card p-6 sm:p-8 space-y-4 border border-white/80">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200/70 pb-3 flex items-center justify-between">
            <span>Student Verification Details</span>
            <span className="text-xs font-medium text-slate-400">Prefilled from Account</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Student Name</label>
              <input required name="name" value={formData.name} onChange={handleInputChange} className="glass-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">College Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="glass-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Mobile *</label>
              <input required name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className="glass-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Class</label>
                <input required name="className" value={formData.className} onChange={handleInputChange} placeholder="e.g. CSE-B" className="glass-input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Year</label>
                <select required name="year" value={formData.year} onChange={handleInputChange} className="glass-input">
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grievance Details Section */}
        <div className="glass-card p-6 sm:p-8 space-y-6 border border-white/80">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200/70 pb-3">
            Facility & Location Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facility Category *
              </label>
              <select required name="category" value={formData.category} onChange={handleInputChange} className="glass-input font-medium">
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Date</label>
                <input required type="date" name="complaintDate" value={formData.complaintDate} onChange={handleInputChange} className="glass-input text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Time</label>
                <input required type="time" name="complaintTime" value={formData.complaintTime} onChange={handleInputChange} className="glass-input text-xs" />
              </div>
            </div>
          </div>

          {/* Mandatory Block Location Field with Prominent Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-rose-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>Campus Block (Mandatory) *</span>
              </label>
              <input 
                required 
                name="block" 
                value={formData.block} 
                onChange={handleInputChange} 
                placeholder="Type Block Name (e.g., Mechanical Block, Main Block, Hostel Block B)" 
                className="glass-input border-rose-300 focus:border-rose-500 bg-rose-50/20 font-semibold" 
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Please specify the exact campus block building.</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Floor / Room No</label>
              <input 
                name="floor" 
                value={formData.floor} 
                onChange={handleInputChange} 
                placeholder="e.g. 2nd Floor, Room 204 or Lab 3" 
                className="glass-input" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Issue Description *
            </label>
            <textarea 
              required 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows="4" 
              placeholder="Explain what is faulty, damaged, or requires immediate maintenance..." 
              className="glass-input resize-none text-sm"
            />
          </div>
        </div>

        {/* Live Camera/Video Evidence Component */}
        <CameraCapture 
          onPhotoCapture={(blob) => setPhotoBlob(blob)} 
          onVideoCapture={(blob) => setVideoBlob(blob)} 
        />

        {/* Submission Button */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={!isFormValid() || loading}
            className={`btn-primary px-10 py-4 text-base font-bold shadow-xl ${
              (!isFormValid() || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting Grievance...' : 'Submit & Generate Ticket'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default NewComplaint;
