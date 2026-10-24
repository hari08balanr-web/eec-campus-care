import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { 
  FiShield, FiCamera, FiCheckCircle, FiSearch, FiArrowRight, 
  FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiHash, FiPhone, FiCheck, FiX, FiInfo
} from 'react-icons/fi';
import IdCardCameraCapture from '../components/IdCardCameraCapture';

const DEPARTMENTS = [
  'Artificial Intelligence and Data Science',
  'Computer Science and Engineering', 
  'CSE (AI & ML)', 
  'CSE (Cyber Security)',
  'Information Technology',
  'Electronics and Communication Engineering', 
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Robotics and Automation Engineering', 
  'Bio Medical Engineering', 
  'Civil Engineering',
  'Automobile Engineering', 
  'Biotechnology', 
  'Computer Science and Business Systems (TCS)', 
  'MBA', 
  'MCA'
];

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const { studentLogin, register, googleAuth } = useAuth();
  const navigate = useNavigate();

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form States
  const [formData, setFormData] = useState({
    collegeName: 'Eswari Engineering College',
    name: '',
    rollNo: '',
    mobile: '',
    department: 'Artificial Intelligence and Data Science',
    className: '',
    year: '1',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [idCardBlob, setIdCardBlob] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Password Validation Checklist Helper
  const passwordCriteria = {
    length: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[^A-Za-z0-9]/.test(formData.password)
  };
  const isPasswordSecure = Object.values(passwordCriteria).every(Boolean);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Student Sign In with Email & Password
  const handleStudentSignIn = async (e) => {
    e.preventDefault();
    const email = loginEmail.toLowerCase().trim();

    if (!email.endsWith('@eec.srmrmp.edu.in')) {
      alert('Access Denied: Please enter your official college email ending in @eec.srmrmp.edu.in');
      return;
    }

    if (!loginPassword) {
      alert('Please enter your password.');
      return;
    }

    setLoginLoading(true);
    try {
      await studentLogin(email, loginPassword);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      if (!err.response) {
        alert('Cannot reach server backend. Please ensure backend is running or check network.');
      } else {
        alert(msg || 'Invalid email or password. Please verify your credentials.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Student Registration with College Name, Roll No, Live ID Card, Password
  const handleStudentRegister = async (e) => {
    e.preventDefault();
    const email = formData.email.toLowerCase().trim();

    if (!email.endsWith('@eec.srmrmp.edu.in')) {
      alert('Registration Restricted: Only official @eec.srmrmp.edu.in college email IDs are permitted!');
      return;
    }

    if (!isPasswordSecure) {
      alert('Password Error: Your password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special symbols.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match! Please check your password confirmation.');
      return;
    }

    if (!idCardBlob) {
      alert('Mandatory Verification: Please capture a live photo of your Student ID card using your camera to prevent unauthorized registrations.');
      return;
    }

    setRegisterLoading(true);
    try {
      // Build multipart request
      const data = new FormData();
      data.append('collegeName', formData.collegeName);
      data.append('name', formData.name.trim());
      data.append('rollNo', formData.rollNo.trim());
      data.append('email', email);
      data.append('mobile', formData.mobile.trim());
      data.append('department', formData.department);
      data.append('className', formData.className.trim());
      data.append('year', formData.year);
      data.append('password', formData.password);
      data.append('idCard', idCardBlob, 'student_id_' + formData.rollNo.trim() + '.jpg');

      await register(data);
      alert('Account registered successfully! Welcome to EEC Care.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      if (!err.response) {
        alert('Cannot reach server backend. Please check your internet connection.');
      } else {
        alert(msg || 'Registration failed. Please check if this email or roll number is already registered.');
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  // Quick Google Auth Fallback
  const handleGoogleLogin = async () => {
    const email = prompt('Enter your official college email ID (@eec.srmrmp.edu.in):');
    if (!email) return;
    
    if (!email.toLowerCase().endsWith('@eec.srmrmp.edu.in')) {
      alert('Access Denied: Only official college email addresses ending in @eec.srmrmp.edu.in are allowed.');
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
      alert(error.response?.data?.message || 'Google login session failed. Please try again.');
    }
  };

  return (
    <div className="py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Institutional Branding */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-6 text-center lg:text-left lg:sticky lg:top-24"
        >
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border border-white/70 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 tracking-wide">
              Official Campus Facility Grievance Redressal
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
              Eswari Engineering College <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                EEC Care Portal
              </span>
            </h1>

            <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Empowering students and faculty to maintain world-class campus facilities. Report issues with real-time camera verification, track resolution progress via ticket codes, and receive direct email alerts.
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
            <div className="glass-card p-3.5 text-center">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-1.5">
                <FiCamera className="text-base" />
              </div>
              <div className="text-xs font-bold text-slate-800">Live Camera</div>
              <div className="text-[10px] text-slate-500">ID &amp; Evidence proof</div>
            </div>

            <div className="glass-card p-3.5 text-center">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-1.5">
                <FiShield className="text-base" />
              </div>
              <div className="text-xs font-bold text-slate-800">Direct Alert</div>
              <div className="text-[10px] text-slate-500">Instant admin Gmail</div>
            </div>

            <div className="glass-card p-3.5 text-center">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-1.5">
                <FiCheckCircle className="text-base" />
              </div>
              <div className="text-xs font-bold text-slate-800">Live Tracking</div>
              <div className="text-[10px] text-slate-500">Fast ticket redressal</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left">
            <div className="flex items-start gap-2.5">
              <FiInfo className="text-amber-600 text-lg mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Campus Security Notice:</strong> All student accounts require live student ID card verification to eliminate fake complaints. Live evidence is dispatched directly to EEC administrators.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Student Portal Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-6 w-full max-w-lg mx-auto"
        >
          <div className="glass-card p-6 sm:p-8 shadow-2xl border border-white/80 relative overflow-hidden">
            
            <div className="text-center mb-5">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Student Portal</h3>
              <p className="text-xs text-slate-500">
                Log in with your official <span className="font-semibold text-primary">@eec.srmrmp.edu.in</span> ID
              </p>
            </div>

            {/* Segmented Tab Control */}
            <div className="flex bg-slate-200/60 p-1.5 rounded-xl mb-5 shadow-inner">
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
                New Student Register
              </button>
            </div>

            {/* ========================================================= */}
            {/* TAB 1: STUDENT SIGN IN                                    */}
            {/* ========================================================= */}
            {activeTab === 'login' && (
              <form onSubmit={handleStudentSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input 
                      required 
                      type="email" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)} 
                      placeholder="e.g. student@eec.srmrmp.edu.in" 
                      className="glass-input pl-9" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input 
                      required 
                      type={showLoginPassword ? 'text' : 'password'} 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)} 
                      placeholder="Enter your student password" 
                      className="glass-input pl-9 pr-10" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 text-base transition-colors"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loginLoading}
                  className="w-full btn-primary py-3 text-sm mt-3 flex items-center justify-center gap-2 shadow-md"
                >
                  {loginLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Sign In to Dashboard &rarr;</span>
                  )}
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white/90 text-slate-400 rounded-full font-medium">Alternative Options</span>
                  </div>
                </div>

                {/* Google OAuth Secondary Fallback */}
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 py-2.5 px-4 rounded-xl font-semibold text-xs shadow-xs hover:shadow transition-all border border-slate-200"
                >
                  <FcGoogle className="text-lg" /> 
                  <span>Quick Sign In with College Google ID</span>
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    New student at EEC?{' '}
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('signup')} 
                      className="text-primary font-bold hover:underline"
                    >
                      Register with Student ID
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ========================================================= */}
            {/* TAB 2: STUDENT REGISTRATION (WITH LIVE ID CARD CAPTURE)   */}
            {/* ========================================================= */}
            {activeTab === 'signup' && (
              <form onSubmit={handleStudentRegister} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
                
                {/* College Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">College Institution</label>
                  <input 
                    type="text" 
                    readOnly 
                    name="collegeName" 
                    value={formData.collegeName} 
                    className="glass-input !py-2 !text-xs bg-slate-100/80 font-bold text-slate-700 cursor-not-allowed" 
                  />
                </div>

                {/* Name & Roll No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      placeholder="e.g. Student Full Name" 
                      onChange={handleInputChange} 
                      className="glass-input !py-2 !text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Roll Number / Reg No <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="rollNo" 
                      value={formData.rollNo} 
                      placeholder="e.g. 3106XXXXXXXX" 
                      onChange={handleInputChange} 
                      className="glass-input !py-2 !text-xs" 
                    />
                  </div>
                </div>

                {/* College Email */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    College Email Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    placeholder="e.g. student@eec.srmrmp.edu.in" 
                    onChange={handleInputChange} 
                    className="glass-input !py-2 !text-xs" 
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Must end with @eec.srmrmp.edu.in</p>
                </div>

                {/* Mobile & Class */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required 
                      type="tel" 
                      maxLength="10" 
                      name="mobile" 
                      value={formData.mobile} 
                      placeholder="10-digit mobile" 
                      onChange={handleInputChange} 
                      className="glass-input !py-2 !text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Class / Section <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="className" 
                      value={formData.className} 
                      placeholder="e.g. Section A" 
                      onChange={handleInputChange} 
                      className="glass-input !py-2 !text-xs" 
                    />
                  </div>
                </div>

                {/* Department & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required 
                      name="department" 
                      value={formData.department} 
                      onChange={handleInputChange} 
                      className="glass-input !py-2 !text-xs"
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Year of Study <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required 
                      name="year" 
                      value={formData.year} 
                      onChange={handleInputChange} 
                      className="glass-input !py-2 !text-xs"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Create Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        required 
                        type={showRegisterPassword ? 'text' : 'password'} 
                        name="password" 
                        value={formData.password} 
                        placeholder="At least 8 chars" 
                        onChange={handleInputChange} 
                        className="glass-input !py-2 !text-xs pr-8" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 text-sm"
                        title={showRegisterPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegisterPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        required 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        placeholder="Repeat password" 
                        onChange={handleInputChange} 
                        className="glass-input !py-2 !text-xs pr-8" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 text-sm"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Checklist Indicator */}
                {formData.password && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[10px] space-y-1 text-slate-600">
                    <span className="font-bold text-slate-700 block">Password Requirements:</span>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      <div className={`flex items-center gap-1 ${passwordCriteria.length ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        {passwordCriteria.length ? <FiCheck /> : <FiX />} Min 8 characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordCriteria.hasUpper ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        {passwordCriteria.hasUpper ? <FiCheck /> : <FiX />} Uppercase letter (A-Z)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordCriteria.hasLower ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        {passwordCriteria.hasLower ? <FiCheck /> : <FiX />} Lowercase letter (a-z)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        {passwordCriteria.hasNumber ? <FiCheck /> : <FiX />} Number (0-9)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordCriteria.hasSpecial ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        {passwordCriteria.hasSpecial ? <FiCheck /> : <FiX />} Special symbol (@$!%*#)
                      </div>
                    </div>
                  </div>
                )}

                {/* LIVE ID CARD CAMERA CAPTURE (NO FILE UPLOAD) */}
                <div className="pt-2">
                  <IdCardCameraCapture 
                    onIdCardCapture={(blob) => setIdCardBlob(blob)} 
                    isCaptured={!!idCardBlob} 
                  />
                </div>

                {/* Submit Register Button */}
                <button 
                  type="submit" 
                  disabled={registerLoading || !idCardBlob}
                  className="w-full btn-primary py-3 text-xs font-bold mt-3 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registerLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Complete Verification &amp; Register &rarr;</span>
                  )}
                </button>

                <div className="text-center pt-1">
                  <p className="text-xs text-slate-500">
                    Already registered?{' '}
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('login')} 
                      className="text-primary font-bold hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Admin Portal Gateway Link */}
            <div className="mt-5 pt-3 border-t border-slate-200 text-center">
              <Link to="/admin/login" className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                Authorized Faculty &amp; Admin Portal &rarr;
              </Link>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;
