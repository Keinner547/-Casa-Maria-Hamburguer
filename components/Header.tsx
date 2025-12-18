
import React, { useState } from 'react';
import { Menu, ShoppingBag, MapPin, Info, X, Lock } from 'lucide-react';
import { useNavigation, Page } from '../context/AuthContext';

interface HeaderProps {
  cartCount: number;
  toggleCart: () => void;
}

export default function Header({ cartCount, toggleCart }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentPage, navigate } = useNavigation();

  const navLinks: { name: string; path: Page; icon: React.ReactNode }[] = [
    { name: 'Inicio', path: '/', icon: <Menu size={18} /> },
    { name: 'Menú', path: '/menu', icon: <ShoppingBag size={18} /> },
    { name: 'Ubicación', path: '/location', icon: <MapPin size={18} /> },
    { name: 'Nosotros', path: '/about', icon: <Info size={18} /> },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavigation = (path: Page) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-xl font-bold text-white tracking-tighter flex items-center gap-2 group"
            >
              <div className="bg-orange-600 p-1.5 rounded-lg shadow-lg shadow-orange-600/20 text-white group-hover:bg-orange-500 transition-colors">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 40 C15 20 30 10 50 10 C70 10 85 20 85 40" />
                  <rect x="30" y="20" width="6" height="6" transform="rotate(45 33 23)" fill="currentColor" stroke="none"/>
                  <rect x="50" y="15" width="6" height="6" transform="rotate(45 53 18)" fill="currentColor" stroke="none"/>
                  <rect x="70" y="20" width="6" height="6" transform="rotate(45 73 23)" fill="currentColor" stroke="none"/>
                  <path d="M20 52 H80" />
                  <path d="M15 65 L 35 65 L 50 75 L 65 65 L 85 65" />
                  <path d="M15 80 C 15 95 35 95 50 95 C 65 95 85 95 85 80" />
                </svg>
              </div>
              Casa María
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  currentPage === link.path
                    ? 'text-orange-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => navigate('/admin')}
              className="text-slate-700 hover:text-slate-500 transition-colors" 
              title="Administración"
            >
              <Lock size={14} />
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-400 hover:text-orange-500 transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full border-2 border-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 absolute w-full left-0 shadow-2xl animate-in slide-in-from-top-5 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  currentPage === link.path
                    ? 'bg-orange-900/20 text-orange-500'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  {link.icon}
                  {link.name}
                </span>
              </button>
            ))}
            <div className="border-t border-slate-800 my-2 pt-2">
              <button
                onClick={() => handleNavigation('/admin')}
                className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Lock size={18} />
                  Administración
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
