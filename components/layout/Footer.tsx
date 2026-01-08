import React from 'react';

const Footer: React.FC = () => {
  const linkClasses = "hover:text-teal-400 transition-colors duration-200";

  return (
    <footer className="bg-gray-800/50 border-t border-gray-700/50 text-center py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-gray-400 text-sm font-medium">
          <a href="/about" className={linkClasses}>About</a>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <a href="/docs" className={linkClasses}>Docs</a>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <a href="/terms" className={linkClasses}>Terms</a>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <a href="/privacy-policy" className={linkClasses}>Privacy Policy</a>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className={linkClasses}>Sitemap</a>
        </div>
        
        <div className="text-gray-500 text-xs tracking-widest uppercase font-semibold">
          Powered By - <span className="text-teal-500/80">"Build By prohor"</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;