
import React from 'react';
import { MapPin, Star, Utensils, Users } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-slate-950 py-24 overflow-hidden border-t border-slate-900 relative">
      {/* Elementos decorativos de fondo para resaltar el estilo nocturno */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-900/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-900/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna de Imagen: Optimizada para la foto de la fachada */}
          <div className="relative order-2 lg:order-1 flex justify-center">
             
             {/* Brillo suave detrás de la foto para simular la luz del local */}
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
                 {/* Overlay para mejorar el contraste de las luces */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
               </div>
               
               {/* Badge flotante de 'Nueva Sede' */}
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

          {/* Columna de Texto: Historia y Valor */}
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
            
            <div className="prose prose-lg text-slate-400 space-y-6 mb-10">
              <p className="text-lg leading-relaxed">
                Lo que ves en la foto es más que un edificio; es el resultado de años de pasión por la cocina. Nuestra nueva sede ha sido creada para ofrecerte una experiencia campestre única, donde el sabor rústico y la comodidad se encuentran.
              </p>
              <p className="text-slate-500">
                Desde nuestras hamburguesas artesanales hasta nuestras refrescantes limonadas, cada detalle en <strong>Casa María</strong> está pensado para que te sientas como en casa, bajo un ambiente acogedor y lleno de vida.
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
