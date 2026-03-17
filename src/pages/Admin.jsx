import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, ShieldCheck } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import ContentFormularios from '../components/admin/ContentFormularios';
import ContentTalento from '../components/admin/ContentTalento';
import ContentSolicitudes from '../components/admin/ContentSolicitudes';
import ContentGlobal from '../components/admin/ContentGlobal';
import ContentUsuarios from '../components/admin/ContentUsuarios';
import ContentMembresia from '../components/admin/ContentMembresia';
import ContentAcademia from '../components/admin/ContentAcademia';
import ContentHero from '../components/admin/ContentHero';
import AdminGlobal from './admin/AdminGlobal';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('contenido');
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('adminAuth');
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  useEffect(() => {
    // If already authenticated, do nothing
    if (isAuthenticated) return;

    // Request password
    const password = prompt('Introduce la contraseña para acceder al Panel de Administración:');
    
    if (password === 'Admin2026') {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
    } else {
      // Small Delay to prevent redirect loop issues in some browsers
      setTimeout(() => navigate('/'), 100);
    }
  }, [navigate, isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-grow">
        <header className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-white">
          <h1 className="text-2xl font-bold text-navy-950 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-pink-500" />
            Panel de Administración
          </h1>
          <div className="flex items-center gap-3">
            <Link 
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-navy-600 rounded-2xl hover:bg-navy-700 transition-colors shadow-sm"
            >
              <Home className="w-5 h-5" />
              Regresar al Sitio
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-pink-500 rounded-2xl hover:bg-pink-600 transition-colors shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </header>
        
        <div className="px-6 border-b border-gray-100 bg-gray-50/50">
          <nav className="flex gap-6 overflow-x-auto pt-4">
            <button 
              onClick={() => setActiveTab('contenido')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'contenido' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Contenido
            </button>
            <button 
              onClick={() => setActiveTab('formularios')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'formularios' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Formularios
            </button>
            <button 
              onClick={() => setActiveTab('talento')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'talento' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Talento
            </button>
            <button 
              onClick={() => setActiveTab('solicitudes')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold flex items-center gap-1.5 ${activeTab === 'solicitudes' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Solicitudes
            </button>
            <button 
              onClick={() => setActiveTab('academia')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'academia' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Academia
            </button>
            <button 
              onClick={() => setActiveTab('pagos')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'pagos' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pagos
            </button>
            <button 
              onClick={() => setActiveTab('global')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'global' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Global
            </button>
            <button 
              onClick={() => setActiveTab('membresia')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'membresia' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Membresía
            </button>

            <button 
              onClick={() => setActiveTab('usuarios')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'usuarios' ? 'border-b-2 border-navy-950 text-navy-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Usuarios
            </button>
          </nav>
        </div>
        
        <main className="p-8 flex-grow bg-gray-50/20">
          {activeTab === 'contenido' && <AdminGlobal />}
          {activeTab === 'formularios' && <ContentFormularios />}
          {activeTab === 'talento' && <ContentTalento />}
          {activeTab === 'solicitudes' && <ContentSolicitudes />}
          {activeTab === 'academia' && <ContentAcademia />}
          {activeTab === 'pagos' && <div className="p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500 font-medium">Módulo de Pagos en construcción</div>}
          {activeTab === 'global' && <ContentGlobal />}
          {activeTab === 'membresia' && <ContentMembresia />}
          {activeTab === 'usuarios' && <ContentUsuarios />}
        </main>
      </div>
    </div>
  );
}
