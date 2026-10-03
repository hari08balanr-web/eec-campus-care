import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiActivity } from 'react-icons/fi';

const UG_PG_PROGRAMS = [
  'Automobile Engineering', 'Bio Medical Engineering', 'Civil Engineering',
  'Computer Science and Engineering', 'CSE (AI & ML)', 'CSE (Cyber Security)',
  'Computer Science and Design', 'Electrical and Electronics Engineering',
  'Electronics and Communication Engineering', 'Mechanical Engineering',
  'Robotics and Automation Engineering', 'Artificial Intelligence and Data Science',
  'Biotechnology', 'Computer Science and Business Systems (TCS)', 'Information Technology',
  'MBA', 'MCA'
];

const SUPPORTING = [
  'Chemistry', 'English', 'Maths', 'Physics', 'Physical Education', 'Counselling'
];

const DepartmentsPage = () => {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Departments</h1>
        <p className="opacity-80">Explore the wide range of academic programs and supporting departments at EEC.</p>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-2">
          <FiBookOpen className="text-primary text-2xl" />
          <h2 className="text-2xl font-bold">Programs Offered</h2>
        </div>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {UG_PG_PROGRAMS.map(dept => (
            <motion.div key={dept} variants={item} className="glass-card p-4 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
              <h3 className="font-semibold text-sm">{dept}</h3>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-2">
          <FiActivity className="text-secondary text-2xl" />
          <h2 className="text-2xl font-bold">Supporting Departments</h2>
        </div>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SUPPORTING.map(dept => (
            <motion.div key={dept} variants={item} className="glass-card p-4 text-center hover:bg-secondary hover:text-white transition-colors group cursor-default">
              <h3 className="font-medium text-sm">{dept}</h3>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default DepartmentsPage;
