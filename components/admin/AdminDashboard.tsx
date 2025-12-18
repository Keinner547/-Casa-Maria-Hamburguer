
import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useNavigation } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { MenuItem } from '../../types';
import { LogOut, Plus, Edit, Trash2, X, Image as ImageIcon, RotateCcw, Upload, Search, Percent, User, Lock, Save, Camera } from 'lucide-react';
import { processImage } from '../../utils/imageHelpers';
import { CURRENCY } from '../../constants';

const AdminDashboard = () => {
  const { logout, adminProfile, updateAdminProfile } = useAuth();
  const { items, addProduct, updateProduct, deleteProduct, resetMenu } = useMenu();
  const { navigate } = useNavigation();
  
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

    // Validar contraseñas si se intenta cambiar
    if (profileData.newPassword || profileData.confirmPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        setProfileMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
        return;
      }
      if (!profileData.currentPassword) {
        setProfileMessage({ type: 'error', text: 'Debes ingresar tu contraseña actual para hacer cambios.' });
        return;
      }
    }

    const result = updateAdminProfile({
      image: profileData.image,
      email: profileData.email, // Aunque no editable en UI, se pasa para consistencia
      currentPassword: profileData.currentPassword || undefined,
      newPassword: profileData.newPassword || undefined
    });

    if (result.success) {
      setProfileMessage({ type: 'success', text: result.message });
      // Limpiar campos de password
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
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors">
            Ver Sitio Web
          </button>
          <button onClick={resetMenu} className="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 text-sm flex items-center gap-2 border border-red-900/30 transition-colors">
            <RotateCcw size={16} /> Restaurar Menú
          </button>
          <button onClick={() => setIsProfileModalOpen(true)} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-sm flex items-center gap-2 transition-colors border border-slate-700">
            <User size={16} /> Perfil
          </button>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm flex items-center gap-2 transition-colors">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none placeholder-slate-600"
            />
          </div>
          <button 
            onClick={() => openModal()}
            className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-orange-600/20 hover:scale-105"
          >
            <Plus size={20} /> Nuevo Producto
          </button>
        </div>

        {/* Products Grid / Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-5 font-semibold">Producto</th>
                  <th className="p-5 font-semibold">Categoría</th>
                  <th className="p-5 font-semibold">Precio / Descuento</th>
                  <th className="p-5 font-semibold text-center">Estado</th>
                  <th className="p-5 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="p-10 text-center text-slate-500">
                       El inventario está vacío.
                     </td>
                   </tr>
                ) : filteredItems.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="p-10 text-center text-slate-500">
                       No se encontraron productos.
                     </td>
                   </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 shrink-0 relative">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                            {item.discountPercent && item.discountPercent > 0 && (
                              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1 font-bold">
                                -{item.discountPercent}%
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-base">{item.name}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 capitalize">
                          {categories.find(c => c.id === item.category)?.label || item.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-orange-400 font-bold text-lg">
                           {CURRENCY}{formatPrice(item.price)}
                        </div>
                        {item.discountPercent && item.discountPercent > 0 && (
                           <div className="text-xs text-red-400 font-medium bg-red-900/20 px-2 py-0.5 rounded inline-block border border-red-900/30">
                             Descuento: {item.discountPercent}%
                           </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {item.popular && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-500 border border-yellow-700/50">
                            ★ Destacado
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openModal(item)}
                            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-600"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              if(window.confirm('¿Eliminar producto?')) deleteProduct(item.id);
                            }}
                            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-900/30"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL DE PRODUCTO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {editingItem ? <Edit size={20} className="text-orange-500" /> : <Plus size={20} className="text-orange-500" />}
                {editingItem ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Image Uploader */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-300">Imagen</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square w-full rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 hover:bg-slate-800/50 cursor-pointer transition-all flex flex-col items-center justify-center overflow-hidden bg-slate-950 relative group shadow-inner"
                  >
                    {previewImage ? (
                      <>
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/20">
                            <Upload size={18} /> Cambiar Foto
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <div className="bg-slate-900 p-4 rounded-full inline-block mb-3 text-slate-500 group-hover:text-orange-500 transition-colors">
                           <ImageIcon size={32} />
                        </div>
                        <p className="text-slate-300 font-medium">Sube una foto</p>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>

                {/* Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Nombre</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Precio</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-500">{CURRENCY}</span>
                            <input
                            type="number"
                            step="100"
                            required
                            placeholder="0"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none font-mono"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Descuento (%)</label>
                        <div className="relative">
                            <span className="absolute right-3 top-3 text-slate-500"><Percent size={14}/></span>
                            <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={formData.discountPercent}
                            onChange={e => setFormData({...formData, discountPercent: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-8 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none font-mono"
                            />
                        </div>
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-300 mb-2">Categoría</label>
                     <select
                     value={formData.category}
                     onChange={e => setFormData({...formData, category: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none"
                     >
                     {categories.map(cat => (
                         <option key={cat.id} value={cat.id}>{cat.label}</option>
                     ))}
                     </select>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                        type="checkbox"
                        checked={formData.popular}
                        onChange={e => setFormData({...formData, popular: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-orange-600 focus:ring-orange-600"
                        />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                            Producto Destacado
                        </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Descripción</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl bg-orange-600 text-white hover:bg-orange-700 font-bold shadow-lg shadow-orange-600/20"
                >
                  {editingItem ? 'Guardar Cambios' : 'Publicar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE PERFIL --- */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={20} className="text-orange-500" />
                Perfil de Administrador
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => profileFileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-slate-600 hover:border-orange-500 bg-slate-800 overflow-hidden relative cursor-pointer group transition-all"
                >
                  {profileData.image ? (
                    <img src={profileData.image} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <User size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <button type="button" onClick={() => profileFileInputRef.current?.click()} className="mt-2 text-sm text-orange-500 font-medium hover:text-orange-400">
                  Cambiar Foto
                </button>
                <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
              </div>

              {profileMessage.text && (
                <div className={`p-3 rounded-lg text-sm border ${profileMessage.type === 'error' ? 'bg-red-900/20 text-red-400 border-red-900/30' : 'bg-green-900/20 text-green-400 border-green-900/30'}`}>
                  {profileMessage.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Correo (No editable)</label>
                  <input
                    type="text"
                    disabled
                    value={profileData.email}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-wider mb-3">Cambiar Contraseña</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Contraseña Actual (Requerida)</label>
                      <div className="relative">
                         <Lock size={14} className="absolute left-3 top-3 text-slate-500" />
                         <input
                           type="password"
                           value={profileData.currentPassword}
                           onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                           placeholder="••••••••"
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:ring-2 focus:ring-orange-600 outline-none text-sm"
                         />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nueva Contraseña</label>
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                        placeholder="Nueva contraseña"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-orange-600 outline-none text-sm"
                      />
                    </div>
                     <div>
                      <label className="block text-xs text-slate-400 mb-1">Confirmar Nueva</label>
                      <input
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                        placeholder="Repetir nueva contraseña"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-orange-600 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 font-bold shadow-lg shadow-orange-600/20 text-sm flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
