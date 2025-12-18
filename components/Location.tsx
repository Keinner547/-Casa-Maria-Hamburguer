
import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { LOCATION_INFO } from '../constants';

const Location: React.FC = () => {
  // Sanitize WhatsApp number for link
  const cleanPhone = LOCATION_INFO.whatsapp.replace(/\D/g, '');

  return (
    <div className="bg-black py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase mb-2">Visítanos</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white">Ubicación y Contacto</h3>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
            Estamos listos para atenderte. Puedes pedir a domicilio o visitarnos en nuestro local.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Info Card */}
          <div className="bg-slate-900 rounded-2xl p-8 lg:p-12 border border-slate-800 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Información de Contacto</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="bg-slate-800 p-3 rounded-xl text-orange-500 shrink-0 border border-slate-700">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">Dirección</h4>
                    <p className="text-slate-400 leading-relaxed">{LOCATION_INFO.address}</p>
                    <a 
                      href={LOCATION_INFO.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-500 text-sm font-semibold mt-2 inline-flex items-center hover:text-orange-400 hover:underline"
                    >
                      Ver en Google Maps <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="bg-slate-800 p-3 rounded-xl text-orange-500 shrink-0 border border-slate-700">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">Horario de Atención</h4>
                    <ul className="text-slate-400 space-y-1">
                      {LOCATION_INFO.hours.map((hour, idx) => (
                        <li key={idx}>{hour}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="bg-slate-800 p-3 rounded-xl text-orange-500 shrink-0 border border-slate-700">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">Contacto</h4>
                    <p className="text-slate-400 mb-1">Tel: {LOCATION_INFO.phone}</p>
                    <p className="text-slate-400">WhatsApp: {LOCATION_INFO.whatsapp}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800">
               <a 
                 href={`https://wa.me/${cleanPhone}`}
                 target="_blank"
                 rel="noreferrer"
                 className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-900/20"
               >
                 <MessageCircle size={22} />
                 Hacer Pedido por WhatsApp
               </a>
            </div>
          </div>

          {/* Map Link / Placeholder */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative group min-h-[400px]">
             <a href={LOCATION_INFO.mapLink} target="_blank" rel="noreferrer" className="block w-full h-full relative">
                {/* Static map placeholder since we don't have an API key for embed */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" 
                  alt="Mapa de ubicación" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-black/80 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 transform group-hover:scale-110 transition-transform border border-slate-700">
                        <div className="bg-orange-600 p-2 rounded-full text-white">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Abrir Mapa</p>
                          <p className="text-xs text-slate-400">Google Maps</p>
                        </div>
                    </div>
                </div>
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
