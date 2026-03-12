import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // check path
import { Check, Settings, Loader2 } from 'lucide-react';

const ContentGlobal = () => {
  const [formData, setFormData] = useState({
    whatsapp: '',
    mensajeBienvenida: '',
    instagram: '',
    facebook: '',
    tiktok: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAjustes = async () => {
      try {
        const docRef = doc(db, 'ajustes_globales', 'general');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      } catch (error) {
        console.error("Error al cargar ajustes globales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAjustes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const docRef = doc(db, 'ajustes_globales', 'general');
      await setDoc(docRef, formData, { merge: true });
      setMessage('¡Ajustes guardados correctamente!');
      alert('¡Cambios guardados con éxito!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error al guardar ajustes globales:", error);
      setMessage('Hubo un error al guardar los ajustes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <Settings className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl font-bold text-gray-800">Ajustes Globales</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp (Número)
          </label>
          <input
            type="text"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="Ej: +59168669000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="mensajeBienvenida" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje de Bienvenida
          </label>
          <textarea
            id="mensajeBienvenida"
            name="mensajeBienvenida"
            value={formData.mensajeBienvenida}
            onChange={handleChange}
            placeholder="Mensaje por defecto para WhatsApp..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"
          ></textarea>
        </div>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
            Link de Instagram
          </label>
          <input
            type="url"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/tu_cuenta"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
            Link de Facebook
          </label>
          <input
            type="url"
            id="facebook"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/tu_pagina"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-1">
            Link de TikTok
          </label>
          <input
            type="url"
            id="tiktok"
            name="tiktok"
            value={formData.tiktok}
            onChange={handleChange}
            placeholder="https://tiktok.com/@tu_cuenta"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {saving ? 'Guardando...' : 'Guardar Ajustes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentGlobal;
