import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] p-6 sm:p-8 transition-all duration-500 hover:border-teal-500/30 group ${className}`}>
      {/* Dynamic Background Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full group-hover:bg-teal-500/20 transition-all duration-700 pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/15 transition-all duration-700 pointer-events-none"></div>
      
      {title && (
        <div className="relative z-10 mb-8">
          <h3 className="text-xl font-black text-white tracking-tight flex items-center">
            <span className="w-1.5 h-6 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full mr-4 shadow-[0_0_10px_rgba(45,212,191,0.5)]"></span>
            {title}
          </h3>
          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mt-4"></div>
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;