
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  suffix?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, suffix, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          id={id}
          className={`w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 group-hover:border-gray-600 ${suffix ? 'pr-32' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500 font-medium text-sm">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
