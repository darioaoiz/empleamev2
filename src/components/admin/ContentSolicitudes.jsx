import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { MessageSquareText, Loader2, Clock, User, Phone, Briefcase, Download, ExternalLink, Users } from 'lucide-react';

const ContentSolicitudes = () => {
  const [tab, setTab] = useState('reclutamiento'); // Por defecto reclutamiento como se pidió
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesEmpleo, setSolicitudesEmpleo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar solicitudes de interesados
    const q1 = query(collection(db, 'solicitudes'), orderBy('fechaSolicitud', 'desc'));
    const unsub1 = onSnapshot(q1, (snapshot) => {
      setSolicitudes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Escuchar solicitudes de empleo (reclutamiento)
    const q2 = query(collection(db, 'solicitudes_empleo'), orderBy('fechaSolicitud', 'desc'));
    const unsub2 = onSnapshot(q2, (snapshot) => {
      setSolicitudesEmpleo(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error obteniendo solicitudes de empleo:", error);
      setLoading(false);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#001f3f]" />
          <h2 className="text-xl font-bold text-[#001f3f]">Gestión de Solicitudes</h2>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setTab('reclutamiento')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'reclutamiento' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reclutamiento
          </button>
          <button 
            onClick={() => setTab('interesados')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'interesados' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Interesados
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-[#001f3f] animate-spin" />
        </div>
      ) : tab === 'reclutamiento' ? (
        // TAB RECLUTAMIENTO
        <div>
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Candidatos profesionales que se han postulado a través del formulario de reclutamiento.
            </p>
          </div>

          {solicitudesEmpleo.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No hay postulaciones de empleo registradas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-left text-sm text-gray-700 border-collapse">
                <thead className="bg-[#001f3f] text-white">
                  <tr>
                    <th className="px-4 py-4 font-medium">Foto</th>
                    <th className="px-4 py-4 font-medium">Candidato</th>
                    <th className="px-4 py-4 font-medium">WhatsApp</th>
                    <th className="px-4 py-4 font-medium">Especialidad</th>
                    <th className="px-4 py-4 font-medium">Experiencia</th>
                    <th className="px-4 py-4 font-medium text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {solicitudesEmpleo.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/80 transition-colors bg-white">
                      <td className="px-4 py-4">
                        {s.fotoUrl ? (
                          <div className="relative group">
                            <img 
                              src={s.fotoUrl} 
                              alt={s.nombre} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-pink-100 shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
                              onClick={() => window.open(s.fotoUrl, '_blank')}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                            <User className="w-6 h-6" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-[#001f3f]">{s.nombre}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{formatDate(s.fechaSolicitud)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <a 
                          href={`https://wa.me/${s.telefono.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 font-bold flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 w-fit"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {s.telefono}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-100">
                          {s.especialidad}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600 font-semibold">{s.experiencia}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          {s.cvUrl ? (
                            <a 
                              href={s.cvUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 bg-pink-500 text-white text-xs font-bold rounded-xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 active:scale-95"
                              title="Ver / Descargar CV"
                            >
                              <Download className="w-3.5 h-3.5" />
                              VER CV
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No adjunto</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // TAB INTERESADOS
        <div>
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Listado de personas que han solicitado información sobre una candidata específica.
            </p>
          </div>

          {solicitudes.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <MessageSquareText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No hay solicitudes de interesados registradas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-[#001f3f] text-white">
                  <tr>
                    <th className="px-6 py-4 font-medium">Fecha</th>
                    <th className="px-6 py-4 font-medium">Interesado</th>
                    <th className="px-6 py-4 font-medium">Teléfono</th>
                    <th className="px-6 py-4 font-medium">Candidata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {solicitudes.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors bg-white">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {formatDate(s.fechaSolicitud)}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#001f3f]">{s.interesadoNombre}</td>
                      <td className="px-6 py-4">
                        <a 
                          href={`https://wa.me/${s.interesadoTelefono.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 font-bold underline decoration-green-200 hover:decoration-green-500 underline-offset-4"
                        >
                          {s.interesadoTelefono}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-100">
                          {s.candidataNombre}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentSolicitudes;
