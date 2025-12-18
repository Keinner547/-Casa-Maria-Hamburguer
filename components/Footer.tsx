
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center gap-3">
             <div className="bg-orange-600 p-1.5 rounded-lg shadow-lg shadow-orange-600/20 text-white">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  {/* Top Bun */}
                  <path d="M15 40 C15 20 30 10 50 10 C70 10 85 20 85 40" />
                  {/* Seeds (Diamonds) */}
                  <rect x="30" y="20" width="6" height="6" transform="rotate(45 33 23)" fill="currentColor" stroke="none"/>
                  <rect x="50" y="15" width="6" height="6" transform="rotate(45 53 18)" fill="currentColor" stroke="none"/>
                  <rect x="70" y="20" width="6" height="6" transform="rotate(45 73 23)" fill="currentColor" stroke="none"/>
                  
                  {/* The C - Top Line/Layer */}
                  <path d="M20 52 H80" />
                  
                  {/* The M - Zigzag Patty Layer */}
                  <path d="M15 65 L 35 65 L 50 75 L 65 65 L 85 65" />
                  
                  {/* The B - Bottom Bun/Bowl */}
                  <path d="M15 80 C 15 95 35 95 50 95 C 65 95 85 95 85 80" />
                </svg>
             </div>
             <div>
               <span className="text-2xl font-bold tracking-tight">Casa María</span>
               <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Todos los derechos reservados.</p>
             </div>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="https://www.instagram.com/casamaria_burger/?utm_source=ig_web_button_share_sheet" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-orange-500 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
              <Facebook size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
