
import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { LOCATION_INFO } from '../constants';
import { useNavigation } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const Hero: React.FC = () => {
  const { navigate } = useNavigation();
  const { settings } = useSettings();

  return (
    <div className="relative bg-black overflow-hidden h-[90vh] flex items-center">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImage}
          alt="Hamburguesa Gourmet Casa María"
          className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 border border-orange-600/30 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider">Abierto Ahora</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Casa María <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Burguer
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed font-light">
            Descubre el verdadero sabor artesanal. Ingredientes frescos seleccionados diariamente, carne 100% premium y ese toque casero que nos hace únicos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-orange-600 hover:bg-orange-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-600/20"
            >
              Pedir Ahora / Ver Menú
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a
              href={LOCATION_INFO.mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border border-slate-700 text-base font-medium rounded-full text-slate-300 hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Ubicación
            </a>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold text-white">4.9</p>
              <div className="flex text-orange-500 text-sm">★★★★★</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Calificación</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">15+</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Variedades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
