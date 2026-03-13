import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Users, UserCheck, UserMinus, Loader2, Mail, User } from 'lucide-react';

export default function ContentUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMiembro = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        esMiembro: !currentStatus
      });
      
      // Update local state
      setUsuarios(usuarios.map(user => 
        user.id === userId ? { ...user, esMiembro: !currentStatus } : user
      ));
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando lista de usuarios...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#001f3f] flex items-center gap-2">
          <Users className="w-6 h-6 text-pink-500" />
          Gestión de Usuarios
        </h2>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
          {usuarios.length} Usuarios Registrados
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado de Membresía</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                  No se encontraron usuarios en la base de datos.
                </td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#001f3f]">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-gray-700">{user.nombre || 'Sin nombre'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.esMiembro ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                        <UserCheck className="w-3.5 h-3.5" />
                        Miembro Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                        <UserMinus className="w-3.5 h-3.5" />
                        No Miembro
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleMiembro(user.id, user.esMiembro)}
                      disabled={actionLoading === user.id}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 ml-auto ${
                        user.esMiembro
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-pink-500 text-white hover:bg-pink-600'
                      }`}
                    >
                      {actionLoading === user.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Procesando...
                        </>
                      ) : user.esMiembro ? (
                        'Desactivar'
                      ) : (
                        'Activar'
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
