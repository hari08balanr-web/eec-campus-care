import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color = 'var(--primary)', delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-6 flex items-center justify-between"
    >
      <div>
        <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
        <h3 className="text-3xl font-bold" style={{ color }}>{value}</h3>
      </div>
      <div 
        className="p-4 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
    </motion.div>
  );
};

export default StatsCard;
