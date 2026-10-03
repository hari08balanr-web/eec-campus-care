import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-14 right-0 glass-card p-3 flex flex-col gap-3 shadow-xl border border-white/40"
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="group relative flex items-center gap-2"
                title={t.name}
              >
                <div 
                  className={`w-8 h-8 rounded-full shadow-md transition-transform ${theme === t.id ? 'scale-110 ring-2 ring-offset-2 ring-primary' : 'hover:scale-110'}`}
                  style={{ backgroundColor: t.color }}
                />
                <span className="absolute right-10 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {t.name}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <FiSettings className={`text-xl ${isOpen ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
      </button>
    </div>
  );
};

export default ThemeSelector;
