import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  suffix?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, suffix, ...props }) => {
  return (
    <div className="w-full space-y-2">
      <label htmlFor={id} className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          id={id}
          className={`w-full bg-gray-900/60 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/40 group-hover:border-white/20 ${suffix ? 'pr-36' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-gray-500 font-bold text-xs uppercase tracking-wider">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;