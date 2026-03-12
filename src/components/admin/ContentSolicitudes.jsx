import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { MessageSquareText, Loader2, Clock, User, Phone, Briefcase } from 'lucide-react';

const ContentSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'solicitudes'),
      orderBy('fechaSolicitud', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSolicitudes(data);
      setLoading(false);
    }, (error) => {
      console.error("Error obteniendo solicitudes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <MessageSquareText className="w-6 h-6 text-[#001f3f]" />
        <h2 className="text-xl font-bold text-[#001f3f]">Solicitudes de Interesados</h2>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Listado de personas que han hecho clic en 'Me interesa' sobre una candidata.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-[#001f3f] animate-spin" />
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MessageSquareText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>Aún no hay solicitudes de interés registradas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#001f3f] text-white">
              <tr>
                <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2"><Clock className="w-4 h-4"/> Fecha</div></th>
                <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2"><User className="w-4 h-4"/> Interesado</div></th>
                <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2"><Phone className="w-4 h-4"/> Teléfono</div></th>
                <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> Candidata</div></th>
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
                      className="text-green-600 hover:text-green-700 font-medium underline decoration-green-200 hover:decoration-green-500 underline-offset-4"
                      title="Contactar por WhatsApp"
                    >
                      {s.interesadoTelefono}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-100">
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
  );
};

export default ContentSolicitudes;
