import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FiShield, FiCamera, FiCheckCircle, FiSearch, FiArrowRight } from 'react-icons/fi';

const DEPARTMENTS = [
  'Automobile Engineering', 'Bio Medical Engineering', 'Civil Engineering',
  'Computer Science and Engineering', 'CSE (AI & ML)', 'CSE (Cyber Security)',
  'Computer Science and Design', 'Electrical and Electronics Engineering',
  'Electronics and Communication Engineering', 'Mechanical Engineering',
  'Robotics and Automation Engineering', 'Artificial Intelligence and Data Science',
  'Biotechnology', 'Computer Science and Business Systems (TCS)', 'Information Technology',
  'MBA', 'MCA'
];

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { register, googleAuth } = useAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginRollNo, setLoginRollNo] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', rollNo: '', mobile: '', department: '',
    className: '', year: '1', email: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    const email = prompt("Enter your official college email ID (@eec.srmrmp.edu.in):");
    if (!email) return;
    
    if (!email.toLowerCase().endsWith('@eec.srmrmp.edu.in')) {
      alert("Access Denied: Only official college email addresses ending in @eec.srmrmp.edu.in are allowed.");
      return;
    }

    try {
      const studentName = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      await googleAuth({
        email: email.toLowerCase(),
        name: studentName,
        googleId: 'google-oauth-' + Date.now()
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Google login session failed. Please try again.");
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.toLowerCase().endsWith('@eec.srmrmp.edu.in')) {
      alert("Please use your official college email ending in @eec.srmrmp.edu.in");
      return;
    }

    try {
      await googleAuth({
        email: loginEmail.toLowerCase(),
        name: loginEmail.split('@')[0].replace('.', ' '),
        rollNo: loginRollNo,
        googleId: 'manual-' + Date.now()
      });
      navigate('/dashboard');
    } catch (err) {
      alert("Login failed. Please verify your details.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.email.toLowerCase().endsWith('@eec.srmrmp.edu.in')) {
      alert("Only @eec.srmrmp.edu.in college email IDs are permitted for registration!");
      return;
    }
    
    try {
      await register({ ...formData, email: formData.email.toLowerCase(), googleId: 'manual-' + Date.now() });
      navigate('/dashboard');
    } catch (error) {
      alert("Registration failed. Please check if this email/roll number is already registered.");
    }
  };

  return (
    <div className="py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Branding & Presentation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-8 text-center lg:text-left"
        >
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border border-white/70 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 tracking-wide">
              Official Campus Facility Grievance Redressal
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Eswari Engineering College <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                EEC Care Portal
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Empowering students and faculty to maintain world-class campus facilities. Report issues with real-time camera verification, track resolution progress via ticket codes, and receive direct email updates.
            </p>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-2 max-w-lg mx-auto lg:mx-0">
            <div className="glass-card p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <FiCamera className="text-lg" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Live Media</h4>
              <p className="text-[11px] text-slate-500">Camera verified</p>
            </div>

            <div className="glass-card p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <FiShield className="text-lg" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Unique Ticket</h4>
              <p className="text-[11px] text-slate-500">Instant tracking</p>
            </div>

            <div className="glass-card p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <FiCheckCircle className="text-lg" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">4 Ambience</h4>
              <p className="text-[11px] text-slate-500">Themes enabled</p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
            <Link to="/track" className="btn-primary">
              <FiSearch /> Track Existing Ticket
            </Link>
            <Link to="/facilities" className="btn-outline">
              Explore Campus Facilities <FiArrowRight />
            </Link>
          </div>
        </motion.div>

        {/* Right Column: High-End Glassmorphism Auth Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 w-full max-w-md mx-auto"
        >
          <div className="glass-card p-8 shadow-2xl border border-white/70 relative overflow-hidden">
            
            {/* Ambient decorative glow inside card */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Student Portal</h3>
              <p className="text-xs text-slate-500">
                Log in with your official <span className="font-semibold text-primary">@eec.srmrmp.edu.in</span> ID
              </p>
            </div>

            {/* Segmented Tab Control */}
            <div className="flex bg-slate-200/60 p-1.5 rounded-xl mb-6 shadow-inner">
              <button 
                type="button"
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'login' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'signup' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Register
              </button>
            </div>

            {/* Google OAuth Button */}
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 py-3 px-4 rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all border border-slate-200 mb-5 group"
            >
              <FcGoogle className="text-xl group-hover:scale-110 transition-transform" /> 
              <span>Continue with College Google ID</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white/80 text-slate-400 rounded-full font-medium">Or continue with credentials</span>
              </div>
            </div>

            {/* Forms */}
            {activeTab === 'login' ? (
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                    placeholder="student@eec.srmrmp.edu.in" 
                    className="glass-input" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
                  <input 
                    required 
                    type="text" 
                    value={loginRollNo} 
                    onChange={(e) => setLoginRollNo(e.target.value)} 
                    placeholder="e.g. 310621104001" 
                    className="glass-input" 
                  />
                </div>

                <button type="submit" className="w-full btn-primary py-3 text-sm mt-2">
                  Sign In to Dashboard
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                    <input required name="name" placeholder="John Doe" onChange={handleInputChange} className="glass-input !py-2 !text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Roll Number</label>
                    <input required name="rollNo" placeholder="Roll No" onChange={handleInputChange} className="glass-input !py-2 !text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">College Email</label>
                  <input required type="email" name="email" placeholder="name@eec.srmrmp.edu.in" onChange={handleInputChange} className="glass-input !py-2 !text-xs" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mobile No</label>
                    <input required name="mobile" placeholder="Mobile" onChange={handleInputChange} className="glass-input !py-2 !text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Class</label>
                    <input required name="className" placeholder="e.g. CSE-A" onChange={handleInputChange} className="glass-input !py-2 !text-xs" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                    <select required name="department" onChange={handleInputChange} className="glass-input !py-2 !text-xs">
                      <option value="">Select Dept</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Study Year</label>
                    <select required name="year" onChange={handleInputChange} className="glass-input !py-2 !text-xs">
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary py-3 text-sm mt-3">
                  Create Student Account
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <Link to="/admin/login" className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                Authorized Faculty & Admin Portal ➔
              </Link>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;
