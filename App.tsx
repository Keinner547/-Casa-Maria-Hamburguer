
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Location from './components/Location';
import About from './components/About';
import Cart from './components/Cart';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Reviews from './components/Reviews';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { MenuItem, CartItem } from './types';
import { AuthProvider, useAuth, NavigationProvider, useNavigation } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { ReviewProvider } from './context/ReviewContext';
import { SettingsProvider } from './context/SettingsContext';

// Protect Admin Routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;
  return <>{children}</>;
};

// Main Layout for public pages
const PublicLayout = ({ children, cartCount, toggleCart }: any) => (
  <>
    <Header cartCount={cartCount} toggleCart={toggleCart} />
    <main className="flex-grow">{children}</main>
    <Footer />
  </>
);

const MainContent: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { currentPage } = useNavigation();

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  let content;

  switch (currentPage) {
    case '/':
      content = (
        <PublicLayout cartCount={totalItems} toggleCart={() => setIsCartOpen(true)}>
          <Hero />
          <div id="featured-menu">
            <Menu addToCart={addToCart} />
          </div>
          <Reviews />
          <Location />
        </PublicLayout>
      );
      break;
    case '/menu':
      content = (
        <PublicLayout cartCount={totalItems} toggleCart={() => setIsCartOpen(true)}>
          <Menu addToCart={addToCart} />
        </PublicLayout>
      );
      break;
    case '/location':
      content = (
        <PublicLayout cartCount={totalItems} toggleCart={() => setIsCartOpen(true)}>
          <Location />
        </PublicLayout>
      );
      break;
    case '/about':
      content = (
        <PublicLayout cartCount={totalItems} toggleCart={() => setIsCartOpen(true)}>
          <About />
        </PublicLayout>
      );
      break;
    case '/admin':
      content = <AdminLogin />;
      break;
    case '/admin/dashboard':
      content = (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      );
      break;
    default:
      content = (
        <PublicLayout cartCount={totalItems} toggleCart={() => setIsCartOpen(true)}>
          <Hero />
        </PublicLayout>
      );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans text-slate-200">
      {content}
      
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
      
      <ChatBot />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <MenuProvider>
          <ReviewProvider>
            <NavigationProvider>
              <MainContent />
            </NavigationProvider>
          </ReviewProvider>
        </MenuProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
