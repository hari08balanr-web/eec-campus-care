import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully! (Mock)");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">Contact Us</h1>
        <p className="opacity-80">Get in touch with the EEC Care support team or college administration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} className="space-y-6">
          <div className="glass-card p-6 flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg"><FiMapPin size={24} /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">Address</h3>
              <p className="opacity-80 text-sm leading-relaxed">
                Bharathi Salai, Ramapuram,<br/>
                Chennai, Tamil Nadu 600089<br/>
                India
              </p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg"><FiPhone size={24} /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">Phone</h3>
              <p className="opacity-80 text-sm mb-1">+91 XXXXXXXXXX (Admin Office)</p>
              <p className="opacity-80 text-sm">+91 XXXXXXXXXX (Helpdesk)</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg"><FiMail size={24} /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">Email</h3>
              <a href="mailto:warnerthepro@gmail.com" className="text-primary hover:underline text-sm font-medium">warnerthepro@gmail.com</a>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="glass-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="glass-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Message</label>
              <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="glass-input resize-none"></textarea>
            </div>
            <button type="submit" className="btn-primary w-full py-3 mt-2">
              <FiSend /> Send Message
            </button>
          </form>
        </motion.div>
      </div>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="glass-card p-2 overflow-hidden h-96">
        <iframe 
          title="EEC Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3887.1896791993215!2d80.1783088152504!3d13.023577390821611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260d70eb069c9%3A0xc3c5f47055964098!2sSRM%20Eswari%20Engineering%20College!5e0!3m2!1sen!2sin!4v1628169904255!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0, borderRadius: '0.75rem' }} 
          allowFullScreen="" 
          loading="lazy">
        </iframe>
      </motion.div>
    </div>
  );
};

export default ContactPage;
