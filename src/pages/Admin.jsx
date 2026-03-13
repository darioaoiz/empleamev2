import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, ShieldCheck } from 'lucide-react';
import ContentInicio from '../components/admin/ContentInicio';
import ContentFormularios from '../components/admin/ContentFormularios';
import ContentTalento from '../components/admin/ContentTalento';
import ContentSolicitudes from '../components/admin/ContentSolicitudes';
import ContentGlobal from '../components/admin/ContentGlobal';
import ContentUsuarios from '../components/admin/ContentUsuarios';
import ContentMembresia from '../components/admin/ContentMembresia';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
      return;
    }

    const password = prompt('Introduce la contraseña para acceder al Panel de Administración:');
    if (password === 'Admin2026') {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-grow">
        <header className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-white">
          <h1 className="text-2xl font-bold text-[#001f3f] flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-pink-500" />
            Panel de Administración
          </h1>
          <Link 
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#001f3f] rounded-2xl hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Home className="w-5 h-5" />
            Regresar al Sitio
          </Link>
        </header>
        
        <div className="px-6 border-b border-gray-100 bg-gray-50/50">
          <nav className="flex gap-6 overflow-x-auto pt-4">
            <button 
              onClick={() => setActiveTab('inicio')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'inicio' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => setActiveTab('formularios')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'formularios' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Formularios
            </button>
            <button 
              onClick={() => setActiveTab('talento')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'talento' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Talento
            </button>
            <button 
              onClick={() => setActiveTab('solicitudes')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold flex items-center gap-1.5 ${activeTab === 'solicitudes' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Solicitudes
            </button>
            <button 
              onClick={() => setActiveTab('academia')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'academia' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Academia
            </button>
            <button 
              onClick={() => setActiveTab('pagos')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'pagos' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pagos
            </button>
            <button 
              onClick={() => setActiveTab('global')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'global' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Global
            </button>
            <button 
              onClick={() => setActiveTab('membresia')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'membresia' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Membresía
            </button>
            <button 
              onClick={() => setActiveTab('usuarios')}
              className={`pb-3 px-2 transition-colors whitespace-nowrap text-sm font-semibold ${activeTab === 'usuarios' ? 'border-b-2 border-[#001f3f] text-[#001f3f]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Usuarios
            </button>
          </nav>
        </div>
        
        <main className="p-8 flex-grow bg-gray-50/20">
          {activeTab === 'inicio' && <ContentInicio />}
          {activeTab === 'formularios' && <ContentFormularios />}
          {activeTab === 'talento' && <ContentTalento />}
          {activeTab === 'solicitudes' && <ContentSolicitudes />}
          {activeTab === 'academia' && <div className="p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500 font-medium">Módulo de Academia en construcción</div>}
          {activeTab === 'pagos' && <div className="p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500 font-medium">Módulo de Pagos en construcción</div>}
          {activeTab === 'global' && <ContentGlobal />}
          {activeTab === 'membresia' && <ContentMembresia />}
          {activeTab === 'usuarios' && <ContentUsuarios />}
        </main>
      </div>
    </div>
  );
}
