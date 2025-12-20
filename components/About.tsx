
import React from 'react';
import { MapPin, Star, Utensils, Users } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-slate-950 py-24 overflow-hidden border-t border-slate-900 relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-900/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-900/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative order-2 lg:order-1 flex justify-center">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-orange-500/10 rounded-full blur-[100px] opacity-50"></div>

             <div className="relative group w-full max-w-lg mx-auto">
               <div className="relative z-10 overflow-hidden rounded-3xl border-2 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-700 group-hover:scale-[1.02]">
                 <img 
                   src={settings.aboutImage} 
                   alt="Fachada Casa María Burguer" 
                   className="w-full h-auto object-cover transition-opacity duration-1000"
                   onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     target.onerror = null; 
                     target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                   }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
               </div>
               
               <div className="absolute -bottom-6 -right-6 z-20 bg-slate-900/95 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-2xl max-w-[220px] animate-in slide-in-from-bottom-4 duration-1000">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-600 p-2 rounded-lg">
                      <Utensils size={18} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide">NUEVA SEDE</span>
                 </div>
                 <p className="text-slate-400 text-xs leading-relaxed">
                   Diseñamos un espacio mágico para que disfrutes con los que más quieres.
                 </p>
               </div>
             </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-900/20 text-orange-400 border border-orange-900/30 mb-6">
              <Star size={14} className="fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">Tradición Familiar</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Bienvenido a nuestra <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                Casa María Burguer
              </span>
            </h2>
            
            <div className="text-slate-300 space-y-6 mb-10 text-lg">
              <p className="font-bold text-orange-500 text-xl">
                ¡🍔✨ Casa María te trae la mejor hamburguesa!
              </p>
              <p className="leading-relaxed">
                ¿Tienes hambre? 🤤 ¡Atrévete a probar las <span className="text-white font-bold">deliciosas hamburguesas de Casa María</span>! 🤩 Sabores únicos, ingredientes frescos 🥩🍅 y el toque especial que solo <span className="text-white font-bold">Casa María</span> puede ofrecerte. ¡No te quedes con el antojo! 😋
              </p>
              
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                <p className="flex items-start gap-3">
                  <span className="font-bold text-white shrink-0">¿Dónde?</span>
                  <span className="text-slate-400">📍 <span className="text-white font-bold">CRA 22 # 9-14, frente a la U. Cooperativa, Villavicencio, Meta</span>.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-bold text-white shrink-0">⏰ Horarios:</span>
                  <span className="text-slate-400">🕓 Abierto todos los días de <span className="text-white font-bold">4:00 PM a 10:30 PM</span>.</span>
                </p>
              </div>

              <p className="text-slate-400 italic">
                ¡Ven y vive la experiencia de disfrutar una hamburguesa única! <span className="text-orange-500 font-bold">¡Te esperamos en Casa María, donde el hambre se queda en casa!</span> 🏠🍔🎉
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-800/60">
               <div className="flex items-start gap-4">
                 <div className="bg-slate-900 p-3 rounded-xl text-orange-500 border border-slate-800">
                    <MapPin size={24} />
                 </div>
                 <div>
                   <p className="text-white font-bold">Ambiente Único</p>
                   <p className="text-sm text-slate-500">Espacio abierto y familiar.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="bg-slate-900 p-3 rounded-xl text-orange-500 border border-slate-800">
                    <Users size={24} />
                 </div>
                 <div>
                   <p className="text-white font-bold">Para Todos</p>
                   <p className="text-sm text-slate-500">Perfecto para grupos grandes.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
