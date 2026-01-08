import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center font-black uppercase tracking-widest text-[11px] px-10 py-5 rounded-2xl transition-all duration-500 transform hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-br from-teal-400 to-teal-600 text-black shadow-[0_15px_30px_-5px_rgba(20,184,166,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.5)]",
    secondary: "bg-white/[0.03] text-white border border-white/10 hover:bg-white/[0.08] hover:border-white/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* Premium Shine Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
    </button>
  );
};

export default Button;