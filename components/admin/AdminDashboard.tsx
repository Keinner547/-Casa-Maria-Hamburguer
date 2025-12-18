
import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useNavigation } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useSettings } from '../../context/SettingsContext';
import { MenuItem } from '../../types';
import { LogOut, Plus, Edit, Trash2, X, Image as ImageIcon, RotateCcw, Upload, Search, Percent, User, Lock, Save, Camera, Layout } from 'lucide-react';
import { processImage } from '../../utils/imageHelpers';
import { CURRENCY } from '../../constants';

const AdminDashboard = () => {
  const { logout, adminProfile, updateAdminProfile } = useAuth();
  const { items, addProduct, updateProduct, deleteProduct, resetMenu } = useMenu();
  const { settings, updateSettings } = useSettings();
  const { navigate } = useNavigation();
  
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Product Form State
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
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    image: ''
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isProfileModalOpen) {
      setProfileData({
        email: adminProfile.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        image: adminProfile.image
      });
      setProfileMessage({ type: '', text: '' });
    }
  }, [isProfileModalOpen, adminProfile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- Global Settings Logic ---
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processImage(e.target.files[0]);
        updateSettings({ heroImage: base64 });
      } catch (err) {
        alert("Error: " + err);
      }
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processImage(e.target.files[0]);
        updateSettings({ aboutImage: base64 });
      } catch (err) {
        alert("Error: " + err);
      }
    }
  };

  // --- Product Logic ---

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        image: item.image,
        popular: item.popular || false,
        discountPercent: item.discountPercent ? item.discountPercent.toString() : ''
      });
      setPreviewImage(item.image);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'burger',
        image: '', 
        popular: false,
        discountPercent: ''
      });
      setPreviewImage('');
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processImage(e.target.files[0]);
        setFormData(prev => ({ ...prev, image: base64 }));
        setPreviewImage(base64);
      } catch (err) {
        alert("Error procesando imagen: " + err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = formData.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
    
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category as any,
      image: finalImage,
      popular: formData.popular,
      discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : 0
    };

    if (editingItem) {
      updateProduct(editingItem.id, payload);
    } else {
      addProduct(payload);
    }
    setIsModalOpen(false);
  };

  // --- Profile Logic ---

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processImage(e.target.files[0]);
        setProfileData(prev => ({ ...prev, image: base64 }));
      } catch (err) {
        alert("Error: " + err);
      }
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });

    if (profileData.newPassword || profileData.confirmPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        setProfileMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
        return;
      }
      if (!profileData.currentPassword) {
        setProfileMessage({ type: 'error', text: 'Debes ingresar tu contraseña actual.' });
        return;
      }
    }

    const result = updateAdminProfile({
      image: profileData.image,
      email: profileData.email,
      currentPassword: profileData.currentPassword || undefined,
      newPassword: profileData.newPassword || undefined
    });

    if (result.success) {
      setProfileMessage({ type: 'success', text: result.message });
      setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setTimeout(() => setIsProfileModalOpen(false), 1500);
    } else {
      setProfileMessage({ type: 'error', text: result.message });
    }
  };

  // --- Render Helpers ---

  const formatPrice = (price: number | string) => {
    const value = typeof price === 'string' ? parseFloat(price) : price;
    return value.toLocaleString('es-CO');
  };

  const categories = [
    { id: 'burger', label: 'Hamburguesa' },
    { id: 'side', label: 'Acompañante' },
    { id: 'drink', label: 'Bebida' },
    { id: 'combo', label: 'Combo' },
  ];

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-600 bg-slate-800 flex items-center justify-center shrink-0">
              {adminProfile.image ? (
                <img src={adminProfile.image} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-slate-400" />
              )}
           </div>
           <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                 Panel de Administración
              </h1>
              <p className="text-slate-400 text-xs">Hola, {adminProfile.email}</p>
           </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700">
            Ver Sitio
          </button>
          <button onClick={() => setIsProfileModalOpen(true)} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-sm flex items-center gap-2 transition-colors border border-slate-700">
            <User size={16} /> Perfil
          </button>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/30 text-sm flex items-center gap-2 transition-colors border border-red-900/20">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setActiveTab('products')}
             className={`px-8 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'products' ? 'border-orange-600 text-orange-500 bg-orange-600/5' : 'border-transparent text-slate-500 hover:text-white'}`}
           >
             <Search size={18} /> Gestión de Menú
           </button>
           <button 
             onClick={() => setActiveTab('settings')}
             className={`px-8 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'border-orange-600 text-orange-500 bg-orange-600/5' : 'border-transparent text-slate-500 hover:text-white'}`}
           >
             <Layout size={18} /> Personalización Visual
           </button>
        </div>

        {activeTab === 'products' ? (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar producto..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={resetMenu} className="bg-slate-800 hover:bg-slate-700 text-slate-400 p-3 rounded-xl border border-slate-700" title="Restaurar Menú">
                  <RotateCcw size={20} />
                </button>
                <button 
                  onClick={() => openModal()}
                  className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-orange-600/20"
                >
                  <Plus size={20} /> Nuevo Producto
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-5 font-semibold">Producto</th>
                      <th className="p-5 font-semibold">Precio</th>
                      <th className="p-5 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-slate-800" />
                            <div>
                               <p className="font-bold text-white">{item.name}</p>
                               <p className="text-xs text-slate-500">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-orange-400 font-bold">
                          {CURRENCY}{formatPrice(item.price)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openModal(item)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"><Edit size={16} /></button>
                            <button onClick={() => deleteProduct(item.id)} className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* --- SITE SETTINGS TAB --- */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
             {/* Hero Image Settings */}
             <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-600/20 p-2 rounded-lg text-orange-500">
                    <Layout size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Imagen de Inicio (Hero)</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">Esta es la imagen principal que ven los clientes al entrar al sitio.</p>
                
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-950 group">
                   <img src={settings.heroImage} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => heroFileInputRef.current?.click()}
                        className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 shadow-xl"
                      >
                        <Upload size={18} /> Cambiar Imagen
                      </button>
                      <p className="text-[10px] text-slate-400 mt-2">Recomendado: 1920x1080px</p>
                   </div>
                </div>
                <input type="file" ref={heroFileInputRef} className="hidden" accept="image/*" onChange={handleHeroImageUpload} />
             </div>

             {/* About Image Settings */}
             <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-600/20 p-2 rounded-lg text-orange-500">
                    <Camera size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Foto de la Sede (Fachada)</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">Esta foto aparece en la sección "Nosotros" para mostrar tu local.</p>
                
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-950 group">
                   <img src={settings.aboutImage} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => aboutFileInputRef.current?.click()}
                        className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 shadow-xl"
                      >
                        <Upload size={18} /> Cambiar Fachada
                      </button>
                      <p className="text-[10px] text-slate-400 mt-2">Perfecta para fotos verticales o cuadradas</p>
                   </div>
                </div>
                <input type="file" ref={aboutFileInputRef} className="hidden" accept="image/*" onChange={handleAboutImageUpload} />
             </div>

             <div className="lg:col-span-2 bg-orange-600/10 border border-orange-600/20 p-6 rounded-2xl flex items-center justify-between">
                <div>
                   <h4 className="text-orange-500 font-bold flex items-center gap-2">
                     <Save size={18} /> Los cambios son automáticos
                   </h4>
                   <p className="text-slate-400 text-sm">Las imágenes se guardan directamente en el sitio para que tus clientes las vean.</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* --- MODAL DE PRODUCTO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {editingItem ? 'Editar Producto' : 'Crear Producto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-300">Imagen del Producto</label>
                  <div onClick={() => fileInputRef.current?.click()} className="aspect-square w-full rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 hover:bg-slate-800/50 cursor-pointer transition-all flex items-center justify-center overflow-hidden bg-slate-950 relative group">
                    {previewImage ? (
                      <img src={previewImage} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-slate-500" />
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="space-y-5">
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nombre" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Precio" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white">
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                  <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5" /> Producto Favorito/Destacado</label>
                </div>
              </div>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descripción del producto..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-orange-600 resize-none"></textarea>
              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancelar</button>
                <button type="submit" className="flex-1 px-6 py-4 rounded-xl bg-orange-600 text-white font-bold shadow-lg">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE PERFIL --- */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-800">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><User size={20} className="text-orange-500" /> Perfil de Admin</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              <div className="flex flex-col items-center">
                <div onClick={() => profileFileInputRef.current?.click()} className="w-24 h-24 rounded-full border-2 border-dashed border-slate-600 hover:border-orange-500 bg-slate-800 overflow-hidden relative cursor-pointer group">
                  {profileData.image ? <img src={profileData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={32} /></div>}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={20} className="text-white" /></div>
                </div>
                <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
              </div>
              {profileMessage.text && <div className={`p-3 rounded-lg text-sm border ${profileMessage.type === 'error' ? 'bg-red-900/20 text-red-400 border-red-900/30' : 'bg-green-900/20 text-green-400 border-green-900/30'}`}>{profileMessage.text}</div>}
              <div className="space-y-4">
                <input type="text" disabled value={profileData.email} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed" />
                <input type="password" value={profileData.currentPassword} onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})} placeholder="Contraseña Actual" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
                <input type="password" value={profileData.newPassword} onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})} placeholder="Nueva Contraseña" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
                <input type="password" value={profileData.confirmPassword} onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})} placeholder="Confirmar Nueva" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
              </div>
              <button type="submit" className="w-full px-4 py-3 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center gap-2"><Save size={16} /> Guardar Perfil</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
