
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { MENU_ITEMS as INITIAL_ITEMS } from '../constants';

interface MenuContextType {
  items: MenuItem[];
  addProduct: (item: Omit<MenuItem, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<MenuItem>) => void;
  deleteProduct: (id: string) => void;
  resetMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar desde localStorage al inicio
  useEffect(() => {
    const storedMenu = localStorage.getItem('cmb_menu_items');
    if (storedMenu) {
      try {
        const parsed = JSON.parse(storedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      } catch (e) {
        console.error("Error cargando menú", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage cada vez que cambia (solo si ya cargó inicialmente)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cmb_menu_items', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addProduct = (newItem: Omit<MenuItem, 'id'>) => {
    const id = Date.now().toString(); // ID simple basado en tiempo
    setItems(prev => [...prev, { ...newItem, id }]);
  };

  const updateProduct = (id: string, updates: Partial<MenuItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteProduct = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const resetMenu = () => {
    if(window.confirm("¿Estás seguro? Esto borrará todos los cambios y volverá al menú original.")) {
      setItems(INITIAL_ITEMS);
    }
  }

  return (
    <MenuContext.Provider value={{ items, addProduct, updateProduct, deleteProduct, resetMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
};
