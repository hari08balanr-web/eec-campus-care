import React from 'react';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

const MANAGEMENT = [
  { name: 'Dr. R. Shivakumar', title: 'Chairman', org: 'SRM Ramapuram & Trichy Campus' },
  { name: 'Mr. S. Niranjan', title: 'Co-Chairman', org: 'SRM Ramapuram & Trichy Campus' },
  { name: 'Dr. P. Deiva Sundari', title: 'Principal', org: 'Eswari Engineering College' },
  { name: 'Dr. M. Senthil Kumar', title: 'Vice Principal - Academic', org: 'Eswari Engineering College' },
  { name: 'Dr. S. Prasanna Raj Yadav', title: 'Vice Principal - Admin', org: 'Eswari Engineering College' },
  { name: 'Dr. E. Kaliappan', title: 'Assistant Registrar', org: 'Eswari Engineering College' }
];

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">About Eswari Engineering College</h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Eswari Engineering College was established in the year 1996 and is approved by AICTE, New Delhi and affiliated to Anna University, Chennai. The college offers various undergraduate and postgraduate programs. We strive to create an inclusive environment for our students with world-class infrastructure and top-tier educational facilities.
        </p>
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Our Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MANAGEMENT.map((person, idx) => (
            <motion.div 
              key={person.name}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform"
            >
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
                <FiUser size={32} />
              </div>
              <h3 className="text-xl font-bold mb-1">{person.name}</h3>
              <p className="text-primary font-medium text-sm mb-1">{person.title}</p>
              <p className="text-xs opacity-70">{person.org}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
