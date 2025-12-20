
import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useNavigation } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useSettings } from '../../context/SettingsContext';
import { MenuItem } from '../../types';
import { LogOut, Plus, Edit, Trash2, X, Image as ImageIcon, RotateCcw, Upload, Search, Percent, User, Lock, Save, Camera, Layout, CheckCircle, Loader2, Github, Copy, ExternalLink, Globe, FileText } from 'lucide-react';
import { processImage } from '../../utils/imageHelpers';
import { CURRENCY, LOCATION_INFO, SITE_NAME } from '../../constants';

const AdminDashboard = () => {
  const { logout, adminProfile, updateAdminProfile } = useAuth();
  const { items, addProduct, updateProduct, deleteProduct, resetMenu } = useMenu();
  const { settings, updateSettings } = useSettings();
  const { navigate } = useNavigation();
  
  const categories = [
    { id: 'burger', label: 'Hamburguesas' },
    { id: 'combo', label: 'Combos' },
    { id: 'side', label: 'Acompañantes' },
    { id: 'drink', label: 'Bebidas' },
  ];

  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'publish'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'burger',
    image: '',
    popular: false,
    discountPercent: ''
  });
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    email: '', currentPassword: '', newPassword: '', confirmPassword: '', image: ''
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isProfileModalOpen) {
      setProfileData({
        email: adminProfile.email, currentPassword: '', newPassword: '', confirmPassword: '', image: adminProfile.image
      });
      setProfileMessage({ type: '', text: '' });
    }
  }, [isProfileModalOpen, adminProfile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("¡Código copiado al portapapeles!");
  };

  const generateConstantsCode = () => {
    const code = `import { MenuItem, LocationData } from './types';

export const MENU_ITEMS: MenuItem[] = ${JSON.stringify(items, null, 2)};

export const LOCATION_INFO: LocationData = ${JSON.stringify(LOCATION_INFO, null, 2)};

export const SITE_NAME = "${SITE_NAME}";
export const CURRENCY = "${CURRENCY}";`;
    return code;
  };

  const generateSettingsCode = () => {
    const code = `import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteSettings {
  heroImage: string;
  aboutImage: string;
}

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = ${JSON.stringify(settings, null, 2)};

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
};`;
    return code;
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessingImage('hero');
      try {
        const base64 = await processImage(e.target.files[0], 1920, 1080);
        updateSettings({ heroImage: base64 });
        showToast("Imagen de Inicio actualizada localmente.");
      } catch (err) { alert(err); } finally { setIsProcessingImage(null); }
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessingImage('about');
      try {
        const base64 = await processImage(e.target.files[0], 1200, 800);
        updateSettings({ aboutImage: base64 });
        showToast("Imagen de Fachada actualizada localmente.");
      } catch (err) { alert(err); } finally { setIsProcessingImage(null); }
    }
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name, description: item.description, price: item.price.toString(),
        category: item.category, image: item.image, popular: item.popular || false,
        discountPercent: item.discountPercent ? item.discountPercent.toString() : ''
      });
      setPreviewImage(item.image);
    } else {
      setEditingItem(null);
      setFormData({
        name: '', description: '', price: '', category: 'burger', image: '', popular: false, discountPercent: ''
      });
      setPreviewImage('');
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processImage(e.target.files[0], 600, 600);
        setFormData(prev => ({ ...prev, image: base64 }));
        setPreviewImage(base64);
      } catch (err) { alert(err); }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = formData.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
    const payload = {
      name: formData.name, description: formData.description,
      price: parseFloat(formData.price), category: formData.category as any,
      image: finalImage, popular: formData.popular,
      discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : 0
    };
    if (editingItem) updateProduct(editingItem.id, payload);
    else addProduct(payload);
    setIsModalOpen(false);
    showToast("Producto guardado localmente.");
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8">
      {successMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle size={20} />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-600 bg-slate-800 flex items-center justify-center shrink-0">
              {adminProfile.image ? <img src={adminProfile.image} alt="Admin" className="w-full h-full object-cover" /> : <User size={24} className="text-slate-400" />}
           </div>
           <div>
              <h1 className="text-xl font-bold text-white">Casa María - Admin</h1>
              <p className="text-slate-400 text-xs">Gestión en tiempo real</p>
           </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700">Ver Sitio</button>
          <button onClick={() => setIsProfileModalOpen(true)} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-sm flex items-center gap-2 border border-slate-700"><User size={16} /> Perfil</button>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/30 text-sm flex items-center gap-2 border border-red-900/20"><LogOut size={16} /> Salir</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
           <button onClick={() => setActiveTab('products')} className={`px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'products' ? 'border-orange-600 text-orange-500 bg-orange-600/5' : 'border-transparent text-slate-500 hover:text-white'}`}><Search size={18} /> Menú</button>
           <button onClick={() => setActiveTab('settings')} className={`px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'border-orange-600 text-orange-500 bg-orange-600/5' : 'border-transparent text-slate-500 hover:text-white'}`}><Layout size={18} /> Diseño</button>
           <button onClick={() => setActiveTab('publish')} className={`px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'publish' ? 'border-green-600 text-green-500 bg-green-600/5' : 'border-transparent text-slate-500 hover:text-white'}`}><Github size={18} /> Publicar en GitHub</button>
        </div>

        {activeTab === 'products' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none" />
              </div>
              <button onClick={() => openModal()} className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-orange-600/20"><Plus size={20} /> Nuevo Producto</button>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                    <tr><th className="p-5">Producto</th><th className="p-5">Precio</th><th className="p-5 text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4"><div className="flex items-center gap-4"><img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-slate-800" /><div><p className="font-bold text-white">{item.name}</p><p className="text-xs text-slate-500">{item.category}</p></div></div></td>
                        <td className="p-4 font-mono text-orange-400 font-bold">{CURRENCY}{item.price.toLocaleString('es-CO')}</td>
                        <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => openModal(item)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"><Edit size={16} /></button><button onClick={() => deleteProduct(item.id)} className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg"><Trash2 size={16} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
             <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Layout size={20} className="text-orange-500" /> Imagen Hero</h3></div>
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-950 group">
                   <img src={settings.heroImage} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button disabled={!!isProcessingImage} onClick={() => heroFileInputRef.current?.click()} className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 shadow-xl">{isProcessingImage === 'hero' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} Subir Nueva</button>
                   </div>
                </div>
                <input type="file" ref={heroFileInputRef} className="hidden" accept="image/*" onChange={handleHeroImageUpload} />
             </div>
             <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Camera size={20} className="text-orange-500" /> Foto Fachada</h3></div>
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-950 group">
                   <img src={settings.aboutImage} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button disabled={!!isProcessingImage} onClick={() => aboutFileInputRef.current?.click()} className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 shadow-xl">{isProcessingImage === 'about' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} Subir Nueva</button>
                   </div>
                </div>
                <input type="file" ref={aboutFileInputRef} className="hidden" accept="image/*" onChange={handleAboutImageUpload} />
             </div>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
             <div className="bg-green-600/10 border border-green-600/20 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                <div className="bg-green-600 p-3 rounded-full text-white"><Globe size={24} /></div>
                <div>
                   <h3 className="text-xl font-bold text-green-500">Persistencia Permanente</h3>
                   <p className="text-slate-400 text-sm">Para que tus cambios se vean en todos los dispositivos y en el link de Vercel, debes actualizar el código fuente en GitHub.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* constants.ts Generator */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                   <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-blue-500" /> constants.ts</h4>
                      <button onClick={() => copyToClipboard(generateConstantsCode())} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-all"><Copy size={14} /> Copiar Código</button>
                   </div>
                   <p className="text-xs text-slate-500">Este código contiene todos tus productos, precios y fotos. Pégalo en el archivo <code>constants.ts</code> de tu proyecto.</p>
                   <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-48 overflow-y-auto no-scrollbar">
                      <pre className="text-[10px] text-slate-400 font-mono">{generateConstantsCode()}</pre>
                   </div>
                </div>

                {/* SettingsContext.tsx Generator */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                   <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white flex items-center gap-2"><Save size={18} className="text-orange-500" /> SettingsContext.tsx</h4>
                      <button onClick={() => copyToClipboard(generateSettingsCode())} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-all"><Copy size={14} /> Copiar Código</button>
                   </div>
                   <p className="text-xs text-slate-500">Este código guarda la imagen de fachada y el hero permanentemente. Pégalo en <code>context/SettingsContext.tsx</code>.</p>
                   <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-48 overflow-y-auto no-scrollbar">
                      <pre className="text-[10px] text-slate-400 font-mono">{generateSettingsCode()}</pre>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">¿Cómo publicar en GitHub?</h4>
                <ol className="text-sm text-slate-400 space-y-3 list-decimal list-inside">
                   <li>Realiza todos los cambios necesarios (subir fotos, editar precios) aquí en el Admin.</li>
                   <li>Usa los botones superiores para copiar los códigos de <span className="text-white">constants.ts</span> y <span className="text-white">SettingsContext.tsx</span>.</li>
                   <li>Abre tu repositorio en <span className="text-white">GitHub.com</span>.</li>
                   <li>Busca los archivos correspondientes, haz clic en el icono de lápiz (editar) y pega el código nuevo reemplazando todo el anterior.</li>
                   <li>Guarda los cambios con un "Commit".</li>
                   <li><span className="text-green-500 font-bold">Vercel detectará el cambio y en 1 minuto el link público estará actualizado para todo el mundo.</span></li>
                </ol>
             </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <h3 className="text-xl font-bold text-white">{editingItem ? 'Editar Producto' : 'Crear Producto'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div onClick={() => fileInputRef.current?.click()} className="aspect-square w-full rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 hover:bg-slate-800/50 cursor-pointer transition-all flex items-center justify-center overflow-hidden bg-slate-950 relative group">
                    {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-500" />}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="space-y-5">
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nombre" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Precio" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white">
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                  <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-orange-600" /> Destacado</label>
                  <div className="flex items-center gap-2">
                    <Percent size={18} className="text-slate-500" />
                    <input type="number" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value})} placeholder="% Descuento (0 para ninguno)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
                  </div>
                </div>
              </div>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descripción..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-orange-600"></textarea>
              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancelar</button>
                <button type="submit" className="flex-1 px-6 py-4 rounded-xl bg-orange-600 text-white font-bold shadow-lg">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
