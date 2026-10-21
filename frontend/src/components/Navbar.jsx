import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiX, FiLogOut, FiPlusCircle, FiSearch, FiSliders } from 'react-icons/fi';

const Navbar = () => {
  const { user, admin, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    relative px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200
    ${isActive(path) 
      ? 'text-primary bg-primary/10 shadow-sm' 
      : 'text-slate-700 hover:text-primary hover:bg-white/60'}
  `;

  return (
    <header className="glass-nav fixed w-full z-50 top-0 left-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* College Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              EEC
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                EEC Care
              </span>
              <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase hidden sm:block">
                Eswari Engineering College
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            <Link to="/about" className={linkClass('/about')}>About</Link>
            <Link to="/departments" className={linkClass('/departments')}>Departments</Link>
            <Link to="/facilities" className={linkClass('/facilities')}>Facilities</Link>
            <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
            <Link to="/track" className={linkClass('/track')}>
              <span className="flex items-center gap-1.5">
                <FiSearch className="text-xs" /> Track
              </span>
            </Link>
            
            {isAuthenticated && (
              <>
                <div className="h-5 w-px bg-slate-300 mx-2" />
                <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                <Link to="/my-complaints" className={linkClass('/my-complaints')}>My Complaints</Link>
                <Link to="/new-complaint" className="btn-primary text-xs !py-2 !px-3.5 ml-2">
                  <FiPlusCircle /> File Complaint
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <div className="h-5 w-px bg-slate-300 mx-2" />
                <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>Admin Portal</Link>
                <Link to="/admin/complaints" className={linkClass('/admin/complaints')}>Manage Complaints</Link>
              </>
            )}
          </nav>

          {/* Right Actions: Theme Selector & User Auth */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Quick 4-Theme Selector */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 hover:text-primary transition-all"
                title="Change Ambient Theme"
              >
                <span 
                  className="w-3.5 h-3.5 rounded-full shadow-inner ring-1 ring-black/10"
                  style={{ backgroundColor: themes.find(t => t.id === theme)?.color || '#0284c7' }} 
                />
                <span className="capitalize">{themes.find(t => t.id === theme)?.name || 'Theme'}</span>
                <FiSliders className="text-slate-400 text-xs" />
              </button>

              {showThemePicker && (
                <div 
                  className="absolute right-0 mt-2 p-2.5 glass-card shadow-2xl border border-white/60 rounded-2xl flex flex-col gap-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-150 z-50"
                  onMouseLeave={() => setShowThemePicker(false)}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Select Ambience
                  </p>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemePicker(false);
                      }}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        theme === t.id ? 'bg-primary text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100/80'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-white" 
                        style={{ backgroundColor: t.color }}
                      />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth CTA / Logout */}
            {(isAuthenticated || isAdmin) ? (
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50/80 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-all"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/" className="btn-primary text-xs !py-2 !px-4">
                  Student Login
                </Link>
                <Link to="/admin/login" className="btn-outline text-xs !py-2 !px-3.5">
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="p-2 rounded-lg bg-white/70 border border-slate-200 text-xs"
              title="Theme"
            >
              <span 
                className="w-4 h-4 rounded-full inline-block shadow-inner ring-1 ring-black/10"
                style={{ backgroundColor: themes.find(t => t.id === theme)?.color || '#0284c7' }} 
              />
            </button>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-xl text-slate-700 hover:bg-white/80 transition-colors focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-nav border-t border-slate-200 shadow-xl px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            <Link to="/about" onClick={() => setIsOpen(false)} className={linkClass('/about')}>About EEC</Link>
            <Link to="/departments" onClick={() => setIsOpen(false)} className={linkClass('/departments')}>Departments</Link>
            <Link to="/facilities" onClick={() => setIsOpen(false)} className={linkClass('/facilities')}>Campus Facilities</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className={linkClass('/contact')}>Contact EEC</Link>
            <Link to="/track" onClick={() => setIsOpen(false)} className={linkClass('/track')}>Track Complaint</Link>
            
            {isAuthenticated && (
              <>
                <div className="h-px bg-slate-200 my-2" />
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className={linkClass('/dashboard')}>Dashboard</Link>
                <Link to="/my-complaints" onClick={() => setIsOpen(false)} className={linkClass('/my-complaints')}>My Complaints</Link>
                <Link to="/new-complaint" onClick={() => setIsOpen(false)} className="btn-primary text-xs mt-2 justify-center">
                  <FiPlusCircle /> File Complaint
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <div className="h-px bg-slate-200 my-2" />
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className={linkClass('/admin/dashboard')}>Admin Portal</Link>
                <Link to="/admin/complaints" onClick={() => setIsOpen(false)} className={linkClass('/admin/complaints')}>Manage Complaints</Link>
              </>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            {(isAuthenticated || isAdmin) ? (
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-200"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <div className="flex gap-2 w-full">
                <Link to="/" onClick={() => setIsOpen(false)} className="btn-primary text-xs flex-1 text-center justify-center">
                  Student Login
                </Link>
                <Link to="/admin/login" onClick={() => setIsOpen(false)} className="btn-outline text-xs flex-1 text-center justify-center">
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
