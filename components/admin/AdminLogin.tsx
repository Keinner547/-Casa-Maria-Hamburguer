
import React, { useState } from 'react';
import { useAuth, useNavigation } from '../../context/AuthContext';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { navigate } = useNavigation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Credenciales incorrectas. (Prueba: admin@casamaria.com / admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black"></div>
      </div>

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 p-8 z-10">
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-slate-400 hover:text-white mb-6 text-sm transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Volver al Inicio
        </button>
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mb-4 border border-orange-600/30">
            <Lock className="text-orange-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Acceso Administrativo</h2>
          <p className="text-slate-400 mt-2 text-sm">Gestiona el menú de Casa María</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all placeholder-slate-600"
              placeholder="admin@casamaria.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all placeholder-slate-600"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95"
          >
            Entrar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
