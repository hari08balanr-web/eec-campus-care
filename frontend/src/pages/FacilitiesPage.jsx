import React from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiCoffee, FiMonitor, FiWifi, FiTrendingUp, FiBox, FiShield, FiBatteryCharging, FiVideo, FiMap, FiHeart } from 'react-icons/fi';

const FACILITIES_1 = [
  { name: 'Infrastructure', icon: <FiBox /> },
  { name: 'Hostel', icon: <FiHome /> },
  { name: 'Health Centre', icon: <FiHeart /> },
  { name: 'Transport', icon: <FiMap /> },
  { name: 'Library', icon: <FiBookOpen /> },
  { name: 'Green Initiatives', icon: <FiTrendingUp /> },
  { name: 'Zero2Nature', icon: <FiShield /> },
];

const FACILITIES_2 = [
  { name: 'Canteen', icon: <FiCoffee /> },
  { name: 'Bank', icon: <FiBox /> }, // using Box as placeholder for bank
  { name: 'Lift', icon: <FiTrendingUp /> },
  { name: 'Auditorium', icon: <FiVideo /> },
  { name: 'Internet/Intranet', icon: <FiWifi /> },
  { name: 'Uninterrupted Power Supply', icon: <FiBatteryCharging /> },
  { name: 'Sports', icon: <FiActivity /> },
  { name: 'Gym', icon: <FiMonitor /> },
];

// Reusable dummy icons if missing
import { FiBookOpen, FiActivity } from 'react-icons/fi';

const FacilitiesPage = () => {
  const Card = ({ item, idx }) => (
    <motion.div 
      initial={{ opacity:0, scale:0.9 }} 
      animate={{ opacity:1, scale:1 }} 
      transition={{ delay: idx*0.05 }}
      className="glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-primary hover:text-white transition-all group"
    >
      <div className="text-3xl text-primary mb-3 group-hover:text-white transition-colors">{item.icon}</div>
      <h3 className="font-semibold text-sm">{item.name}</h3>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Campus Facilities</h1>
        <p className="opacity-80">World-class amenities to support the academic and personal growth of our students.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Core Facilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FACILITIES_1.map((f, i) => <Card key={f.name} item={f} idx={i} />)}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Other Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FACILITIES_2.map((f, i) => <Card key={f.name} item={f} idx={i} />)}
        </div>
      </section>
      
      <section className="glass-card p-8 md:p-12 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
        <h2 className="text-3xl font-bold mb-4">Open Air Theatre</h2>
        <p className="max-w-2xl mx-auto opacity-80">
          Our sprawling Open Air Theatre serves as the cultural hub of the campus, hosting events, festivals, and gatherings that bring our entire college community together under the stars.
        </p>
      </section>
    </div>
  );
};

export default FacilitiesPage;
