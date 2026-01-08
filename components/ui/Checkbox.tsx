import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  isNegative?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, name, checked, onChange, isNegative = false }) => {
  return (
    <label htmlFor={name} className={`flex flex-col items-center justify-between p-5 rounded-3xl cursor-pointer transition-all duration-300 border ${checked ? (isNegative ? 'bg-red-500/10 border-red-500/30' : 'bg-teal-500/10 border-teal-500/30') : 'bg-gray-800/40 border-white/5 hover:bg-gray-800/60 hover:border-white/10'}`}>
        <div className={`text-center text-xs font-bold uppercase tracking-widest mb-4 transition-colors ${checked ? (isNegative ? 'text-red-400' : 'text-teal-400') : 'text-gray-500'}`}>{label}</div>
        <div className="relative inline-block w-12 h-7">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`block w-full h-full rounded-full transition-colors duration-300 ${checked ? (isNegative ? 'bg-red-500' : 'bg-teal-400') : 'bg-gray-700'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-lg transition-transform duration-300 ${checked ? 'transform translate-x-5' : ''}`}></div>
        </div>
    </label>
  );
};

export default Checkbox;