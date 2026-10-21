import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="glass-nav mt-auto border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">EEC Care</h3>
            <p className="text-sm opacity-80 mb-4">
              Complaint Management System for Eswari Engineering College. Report, track, and resolve issues efficiently.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/departments" className="hover:text-primary transition-colors">Departments</Link></li>
              <li><Link to="/facilities" className="hover:text-primary transition-colors">Facilities</Link></li>
              <li><Link to="/track" className="hover:text-primary transition-colors">Track Complaint</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-1 text-primary flex-shrink-0" />
                <span>Bharathi Salai, Ramapuram,<br/>Chennai, Tamil Nadu 600089</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-primary flex-shrink-0" />
                <span>+91 XXXXXXXXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-primary flex-shrink-0" />
                <a href="mailto:warnerthepro@gmail.com" className="hover:text-primary">warnerthepro@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200/30 text-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} Eswari Engineering College. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
