
import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Auth Context ---

export interface AdminProfile {
  email: string;
  password?: string; // Internal use only
  image: string;
}

interface AuthContextType {
  isAdmin: boolean;
  adminProfile: AdminProfile;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateAdminProfile: (updates: Partial<AdminProfile> & { newPassword?: string, currentPassword?: string }) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN = {
  email: 'admin@casamaria.com',
  password: 'admin123',
  image: ''
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password,
    image: DEFAULT_ADMIN.image
  });

  // Cargar estado de admin y perfil guardado
  useEffect(() => {
    const storedAuth = localStorage.getItem('cmb_is_admin');
    if (storedAuth === 'true') setIsAdmin(true);

    const storedProfile = localStorage.getItem('cmb_admin_profile');
    if (storedProfile) {
      try {
        setAdminProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error("Error cargando perfil admin", e);
      }
    } else {
      // Initialize default
      localStorage.setItem('cmb_admin_profile', JSON.stringify(DEFAULT_ADMIN));
    }
  }, []);

  const login = (email: string, pass: string) => {
    // Verificar contra el perfil actual (memoria/storage) en lugar de hardcoded
    if (email === adminProfile.email && pass === (adminProfile.password || DEFAULT_ADMIN.password)) {
      setIsAdmin(true);
      localStorage.setItem('cmb_is_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('cmb_is_admin');
  };

  const updateAdminProfile = (updates: Partial<AdminProfile> & { newPassword?: string, currentPassword?: string }) => {
    // 1. Si intenta cambiar contraseña, verificar la actual
    let finalPassword = adminProfile.password;
    
    if (updates.newPassword) {
      if (updates.currentPassword !== adminProfile.password) {
        return { success: false, message: 'La contraseña actual no es correcta.' };
      }
      finalPassword = updates.newPassword;
    }

    // 2. Preparar nuevo objeto
    const newProfile = {
      ...adminProfile,
      ...updates,
      password: finalPassword
    };
    
    // Eliminar campos temporales que no van al estado directo
    delete (newProfile as any).newPassword;
    delete (newProfile as any).currentPassword;

    // 3. Guardar estado y localStorage
    setAdminProfile(newProfile);
    localStorage.setItem('cmb_admin_profile', JSON.stringify(newProfile));

    return { success: true, message: 'Perfil actualizado correctamente.' };
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, adminProfile, updateAdminProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- Navigation Context ---

export type Page = '/' | '/menu' | '/location' | '/about' | '/admin' | '/admin/dashboard';

interface NavigationContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from hash or default to home
  const getHashPath = (): Page => {
    const hash = window.location.hash.replace('#', '');
    const validPages: Page[] = ['/', '/menu', '/location', '/about', '/admin', '/admin/dashboard'];
    return validPages.includes(hash as Page) ? (hash as Page) : '/';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getHashPath());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getHashPath());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};
