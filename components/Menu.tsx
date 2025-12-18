
import React, { useState } from 'react';
import { CURRENCY } from '../constants';
import { MenuItem } from '../types';
import { Plus, Star, Loader, Tag } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

interface MenuProps {
  addToCart: (item: MenuItem) => void;
}

const Menu: React.FC<MenuProps> = ({ addToCart }) => {
  const { items } = useMenu();
  const [activeCategory, setActiveCategory] = useState<'all' | 'burger' | 'side' | 'drink' | 'combo'>('all');

  const categories = [
    { id: 'all', label: 'Todo' },
    { id: 'burger', label: 'Hamburguesas' },
    { id: 'combo', label: 'Combos' },
    { id: 'side', label: 'Acompañantes' },
    { id: 'drink', label: 'Bebidas' },
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  const formatPrice = (price: number | string) => {
    const value = typeof price === 'string' ? parseFloat(price) : price;
    return value.toLocaleString('es-CO');
  };

  const getDiscountedPrice = (price: number, percent: number = 0) => {
    return price - (price * (percent / 100));
  };

  return (
    <div className="py-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase mb-2">Nuestro Menú</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white">Sabores que enamoran</h3>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Preparadas al momento con ingredientes frescos. Elige tu favorita y pídela online.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
              <p className="text-slate-400 text-lg">No hay productos en esta categoría.</p>
              <p className="text-slate-600 text-sm mt-2">¡Prueba seleccionando otra!</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const hasDiscount = item.discountPercent && item.discountPercent > 0;
              const finalPrice = hasDiscount ? getDiscountedPrice(item.price, item.discountPercent) : item.price;

              return (
                <div key={item.id} className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 hover:border-orange-600/50 transition-all duration-300 group flex flex-col h-full hover:shadow-orange-900/10">
                  <div className="relative h-64 overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                    
                    {item.popular && (
                      <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-md z-10">
                        <Star size={12} className="mr-1 fill-current" /> FAVORITO
                      </div>
                    )}

                    {hasDiscount && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-md z-10 animate-bounce">
                        <Tag size={12} className="mr-1" /> -{item.discountPercent}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
                      <div className="flex flex-col items-end">
                         {hasDiscount ? (
                           <>
                            <span className="text-xs text-slate-500 line-through decoration-red-500 decoration-2">
                              {CURRENCY}{formatPrice(item.price)}
                            </span>
                            <span className="bg-slate-800 text-orange-400 border border-slate-700 font-bold px-2 py-1 rounded-lg text-lg">
                              {CURRENCY}{formatPrice(finalPrice)}
                            </span>
                           </>
                         ) : (
                            <span className="flex-shrink-0 bg-slate-800 text-orange-400 border border-slate-700 font-bold px-3 py-1 rounded-lg ml-2">
                              {CURRENCY}{formatPrice(item.price)}
                            </span>
                         )}
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full bg-slate-800 text-white hover:bg-orange-600 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 group/btn border border-slate-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-600/20"
                    >
                      <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-200" />
                      Agregar al Pedido
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
