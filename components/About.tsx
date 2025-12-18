
import React from 'react';
import { MapPin, Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-slate-950 py-24 overflow-hidden border-t border-slate-900 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-900/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna de Imagen */}
          <div className="relative order-2 lg:order-1 flex justify-center">
             
             {/* Glow effect behind image */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-orange-500/10 rounded-3xl blur-2xl"></div>

             <div className="relative group w-full max-w-md mx-auto">
               <img 
                 src="/fachada.jpg" 
                 alt="Nueva Sede Casa María Burguer" 
                 className="relative w-full h-auto object-cover rounded-2xl shadow-2xl border-2 border-slate-800 transform transition-transform duration-500 hover:scale-[1.01] z-10"
                 onError={(e) => {
                   // Fallback visual por si la imagen no se ha guardado en public/ todavía
                   const target = e.target as HTMLImageElement;
                   target.onerror = null; 
                   // Imagen oscura genérica de restaurante mientras subes la tuya
                   target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80';
                 }}
               />
               
               {/* Badge flotante animado */}
               <div className="absolute -bottom-6 -right-6 z-20 bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-700 shadow-xl max-w-[200px]">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-white font-bold text-sm tracking-wide">YA ABIERTO</span>
                 </div>
                 <p className="text-slate-400 text-xs leading-relaxed">
                   Visita nuestra nueva ubicación campestre.
                 </p>
               </div>
             </div>
          </div>

          {/* Columna de Texto */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-900/20 text-orange-400 border border-orange-900/30 mb-6">
              <Star size={14} className="fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">Nuestra Evolución</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Bienvenido a la nueva <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Casa María
              </span>
            </h2>
            
            <div className="prose prose-lg text-slate-400 space-y-6 mb-8">
              <p>
                Hemos crecido gracias a ti. Lo que ves en la foto es nuestro nuevo orgullo: un espacio diseñado desde los cimientos para ofrecerte la mejor experiencia.
              </p>
              <p>
                Bajo este nuevo techo, mantenemos la tradición de nuestras hamburguesas artesanales, pero ahora con el espacio perfecto para que vengas con toda tu familia y amigos. Ambiente campestre, luces cálidas y el sabor de siempre.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800">
               <div className="flex items-center gap-4">
                 <div className="bg-slate-800 p-3 rounded-lg text-orange-500">
                    <MapPin size={24} />
                 </div>
                 <div>
                   <p className="text-white font-bold">Ubicación Premium</p>
                   <p className="text-sm text-slate-500">Fácil acceso y parqueadero</p>
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
