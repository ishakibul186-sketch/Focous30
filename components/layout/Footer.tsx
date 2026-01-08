
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-gray-400 text-sm">
        <span>Powered By - "Build By prohor"</span>
        <span className="mx-2">|</span>
        <a href="/README.md" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">
          README
        </a>
        <span className="mx-2">|</span>
        <a href="/privacy-policy.md" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">
          Privacy Policy
        </a>
        <span className="mx-2">|</span>
        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">
          Sitemap
        </a>
      </div>
    </footer>
  );
};

export default Footer;
