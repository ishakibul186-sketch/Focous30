
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  isNegative?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, name, checked, onChange, isNegative = false }) => {
  const bgColor = checked ? (isNegative ? 'bg-red-500' : 'bg-teal-500') : 'bg-gray-600';
  const ringColor = isNegative ? 'focus:ring-red-500' : 'focus:ring-teal-500';

  return (
    <label htmlFor={name} className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
        <div className="text-center text-sm font-medium text-gray-300 mb-2">{label}</div>
        <div className="relative inline-block w-10 h-6">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`block ${bgColor} w-10 h-6 rounded-full`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-full' : ''}`}></div>
        </div>
    </label>
  );
};

export default Checkbox;
