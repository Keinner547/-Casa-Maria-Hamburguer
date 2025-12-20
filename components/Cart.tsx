
import React, { useState } from 'react';
import { CartItem } from '../types';
import { CURRENCY, LOCATION_INFO, SITE_NAME } from '../constants';
import { X, Plus, Minus, Trash2, ArrowRight, MessageCircle, FileText, Receipt, MapPin, Bike, Store, Navigation, Loader2 } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, clearCart }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Calculate totals including discounts
  const calculateItemTotal = (item: CartItem) => {
    const discount = item.discountPercent || 0;
    const finalPrice = item.price - (item.price * (discount / 100));
    return finalPrice * item.quantity;
  };

  const calculateSubtotalNoDiscount = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const total = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const subtotalOriginal = calculateSubtotalNoDiscount();
  const totalSavings = subtotalOriginal - total;

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CO');
  };

  // Función de Geocodificación Inversa (Nominatim) optimizada para evitar Failed to fetch
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Petición simplificada para evitar problemas de CORS/Preflight en entornos sandbox
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.pedestrian || addr.suburb || '';
        const houseNumber = addr.house_number || '';
        const neighborhood = addr.neighbourhood || addr.residential || '';
        const city = addr.city || addr.town || addr.village || '';
        
        // Construimos una dirección amigable para el repartidor
        const fullAddress = `${street} ${houseNumber}${street ? ',' : ''} ${neighborhood}${neighborhood ? ',' : ''} ${city}`.trim();
        setAddress(fullAddress || data.display_name);
      }
    } catch (error) {
      console.warn('Error en geocodificación inversa:', error);
      // No bloqueamos el flujo, el usuario aún tiene el marcador GPS capturado
      setLocationError('Ubicación GPS capturada. Por favor, escribe tu dirección manualmente para mayor seguridad.');
    }
  };

  // Lógica de Geolocalización (Estilo InDrive: Rápida y Precisa)
  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      const msg = 'Tu navegador no soporta geolocalización.';
      alert(msg);
      setIsLocating(false);
      return;
    }

    // Solicitar permiso y obtener coordenadas exactas (enableHighAccuracy)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setLocationCoords({ lat, lng });
        
        // Intentar autocompletar la dirección
        await reverseGeocode(lat, lng);
        
        setIsLocating(false);
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        let msg = 'Lo sentimos, no pudimos obtener tu ubicación exacta.';
        
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Necesitamos tu ubicación para que el repartidor sepa dónde entregarte el pedido. Por favor, acepta los permisos del navegador.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'La ubicación no está disponible actualmente. Verifica tu señal GPS.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Se agotó el tiempo de espera. Inténtalo de nuevo.';
        }
        
        setLocationError(msg);
        alert(msg);
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true, // Requerido para precisión exacta
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (deliveryType === 'delivery' && !address.trim() && !locationCoords) {
      alert("Por favor ingresa tu dirección o usa el botón de ubicación para el domicilio.");
      return;
    }

    let message = `Hola *${SITE_NAME}*! 👋\nQuiero realizar el siguiente pedido:\n\n`;
    
    cartItems.forEach(item => {
      const discount = item.discountPercent || 0;
      const finalPrice = item.price - (item.price * (discount / 100));
      const lineTotal = finalPrice * item.quantity;
      
      message += `• ${item.quantity}x *${item.name}*`;
      if (discount > 0) message += ` (Oferta -${discount}%)`;
      message += `\n   Valor: ${CURRENCY}${formatPrice(lineTotal)}\n`;
    });

    message += `\n--------------------------------\n`;
    if (totalSavings > 0) {
       message += `Subtotal: ${CURRENCY}${formatPrice(subtotalOriginal)}\n`;
       message += `Ahorro: -${CURRENCY}${formatPrice(totalSavings)}\n`;
    }
    message += `*TOTAL A PAGAR: ${CURRENCY}${formatPrice(total)}*\n`;
    message += `--------------------------------\n\n`;

    if (deliveryType === 'pickup') {
      message += `🥡 *Método:* Recoger en Tienda\n`;
    } else {
      message += `🛵 *Método:* Domicilio\n`;
      if (locationCoords) {
        // Enlace directo a Google Maps con las coordenadas exactas capturadas
        message += `📍 *Ubicación Exacta (GPS):* https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}\n`;
      }
      if (address) {
        message += `📝 *Dirección:* ${address}\n`;
      }
    }
    
    message += `\nEspero su confirmación. ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = LOCATION_INFO.whatsapp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  if (showReceipt) {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const date = new Date().toLocaleDateString('es-CO');
    const time = new Date().toLocaleTimeString('es-CO');

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
         <div className="bg-white text-slate-900 w-full max-w-sm rounded-lg shadow-2xl overflow-hidden relative">
            <div className="h-2 bg-orange-600 w-full"></div>
            <div className="p-6 relative">
              <button onClick={() => setShowReceipt(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
              <div className="text-center mb-6 border-b border-dashed border-slate-300 pb-6">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-1">{SITE_NAME}</h2>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Pre-Factura de Venta</p>
                <p className="text-sm mt-2 font-mono">#{orderId}</p>
                <p className="text-xs text-slate-500">{date} - {time}</p>
              </div>
              <div className="space-y-3 mb-6 font-mono text-sm max-h-60 overflow-y-auto">
                {cartItems.map((item) => {
                  const discount = item.discountPercent || 0;
                  const finalPrice = item.price - (item.price * (discount / 100));
                  return (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold">{item.quantity}x</span> {item.name}
                        {discount > 0 && <span className="block text-xs text-red-500 ml-5">Desc. {discount}%</span>}
                      </div>
                      <div className="text-right">
                        <span>{CURRENCY}{formatPrice(finalPrice * item.quantity)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-dashed border-slate-300 pt-4 space-y-2 mb-6">
                 <div className="flex justify-between text-xl font-black mt-2">
                    <span>TOTAL</span>
                    <span>{CURRENCY}{formatPrice(total)}</span>
                 </div>
              </div>
              <div className="text-center space-y-3">
                 <button onClick={() => setShowReceipt(false)} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800">
                   Volver al Pedido
                 </button>
              </div>
            </div>
            <div className="relative h-4 bg-white" style={{
                backgroundImage: 'linear-gradient(135deg, white 50%, transparent 50%), linear-gradient(45deg, white 50%, transparent 50%)',
                backgroundPosition: 'bottom left',
                backgroundSize: '20px 20px',
                backgroundRepeat: 'repeat-x'
            }}></div>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-slate-900 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 border-l border-slate-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 shrink-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Receipt className="text-orange-500" />
              Tu Pedido
            </h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                  <ArrowRight size={32} />
                </div>
                <h3 className="text-lg font-medium text-white">Tu carrito está vacío</h3>
                <p className="text-slate-400 max-w-xs">Parece que aún no has agregado ninguna de nuestras deliciosas hamburguesas.</p>
                <button onClick={onClose} className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-700 transition-colors">
                  Ir al Menú
                </button>
              </div>
            ) : (
              <div className="space-y-6 pb-20">
                {cartItems.map((item) => {
                  const hasDiscount = item.discountPercent && item.discountPercent > 0;
                  const finalPrice = hasDiscount ? (item.price - (item.price * (item.discountPercent! / 100))) : item.price;
                  return (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative w-20 h-20 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl bg-slate-800 border border-slate-700" />
                        {hasDiscount && (
                           <span className="absolute -top-2 -left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                             -{item.discountPercent}%
                           </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-white line-clamp-1">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-500 p-1 shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mb-2">
                           {hasDiscount ? (
                             <div className="flex items-center gap-2">
                               <span className="text-orange-500 font-medium text-sm">{CURRENCY}{formatPrice(finalPrice)}</span>
                               <span className="text-slate-500 text-xs line-through">{CURRENCY}{formatPrice(item.price)}</span>
                             </div>
                           ) : (
                             <p className="text-orange-500 font-medium text-sm">{CURRENCY}{formatPrice(item.price)}</p>
                           )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-700 rounded-l-lg text-slate-400 hover:text-white" disabled={item.quantity <= 1}>
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-700 rounded-r-lg text-slate-400 hover:text-white">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-slate-800 bg-slate-900 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10">
              <div className="px-6 pt-4 pb-2">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
                  <button onClick={() => setDeliveryType('pickup')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${deliveryType === 'pickup' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Store size={16} /> Recoger
                  </button>
                  <button onClick={() => setDeliveryType('delivery')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${deliveryType === 'delivery' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Bike size={16} /> Domicilio
                  </button>
                </div>

                {deliveryType === 'delivery' && (
                  <div className="space-y-3 mb-4 animate-in slide-in-from-top-2">
                    <button
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                        locationCoords
                          ? 'bg-green-900/20 border-green-800 text-green-400'
                          : 'bg-slate-800 border-slate-700 text-orange-400 hover:bg-slate-700'
                      }`}
                    >
                      {isLocating ? (
                        <><Loader2 size={16} className="animate-spin" /> Localizando...</>
                      ) : locationCoords ? (
                        <><MapPin size={16} /> Ubicación Detectada</>
                      ) : (
                        <><Navigation size={16} /> Usar mi ubicación actual</>
                      )}
                    </button>
                    
                    {locationError && <p className="text-xs text-red-400 text-center">{locationError}</p>}

                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Escribe tu dirección o usa el botón de ubicación"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-orange-500 outline-none resize-none h-20"
                    />
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 space-y-3">
                 <div className="flex justify-between items-center text-white border-t border-slate-800 pt-3">
                   <span className="text-lg">Total</span>
                   <span className="text-2xl font-bold">{CURRENCY}{formatPrice(total)}</span>
                 </div>
                 <div className="grid grid-cols-[auto_1fr] gap-3">
                    <button onClick={() => setShowReceipt(true)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-xl font-bold transition-all border border-slate-700 flex items-center justify-center" title="Ver Factura">
                      <Receipt size={20} />
                    </button>
                    <button onClick={handleCheckout} className="bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2">
                      <MessageCircle size={20} />
                      {deliveryType === 'delivery' ? 'Pedir Domicilio' : 'Pedir para Recoger'}
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
