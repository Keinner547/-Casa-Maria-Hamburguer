
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteSettings {
  heroImage: string;
  aboutImage: string;
}

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1920&q=80',
  aboutImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cmb_site_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Error loading site settings:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      try {
        localStorage.setItem('cmb_site_settings', JSON.stringify(newSettings));
      } catch (e) {
        console.error("Failed to save settings to localStorage (likely quota exceeded):", e);
        alert("La imagen es demasiado pesada. Intenta con una más pequeña.");
        return prev;
      }
      return newSettings;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
