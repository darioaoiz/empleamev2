import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Check, Edit3, Loader2 } from 'lucide-react';

const ContentInicio = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    boton1: '',
    boton2: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const docRef = doc(db, 'ajustes_web', 'inicio');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            titulo: data.titulo || '',
            subtitulo: data.subtitulo || '',
            boton1: data.boton1 || '',
            boton2: data.boton2 || ''
          });
        }
      } catch (error) {
        console.error("Error al cargar contenido de inicio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContenido();
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
      const docRef = doc(db, 'ajustes_web', 'inicio');
      await setDoc(docRef, formData, { merge: true });
      setMessage('¡Textos actualizados correctamente!');
      alert('¡Cambios guardados con éxito!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error al guardar contenido de inicio:", error);
      setMessage('Hubo un error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-[#001f3f]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <Edit3 className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl font-bold text-[#001f3f]">Editor de Portada</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título Principal
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej: El personal de confianza que tu hogar merece"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-[#001f3f] outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="subtitulo" className="block text-sm font-medium text-gray-700 mb-1">
            Subtítulo
          </label>
          <textarea
            id="subtitulo"
            name="subtitulo"
            value={formData.subtitulo}
            onChange={handleChange}
            placeholder="Ej: Conectamos familias y empresas bolivianas..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-[#001f3f] outline-none transition-shadow resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="boton1" className="block text-sm font-medium text-gray-700 mb-1">
              Texto Botón 1
            </label>
            <input
              type="text"
              id="boton1"
              name="boton1"
              value={formData.boton1}
              onChange={handleChange}
              placeholder="Ej: Contratar Personal"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-[#001f3f] outline-none transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="boton2" className="block text-sm font-medium text-gray-700 mb-1">
              Texto Botón 2
            </label>
            <input
              type="text"
              id="boton2"
              name="boton2"
              value={formData.boton2}
              onChange={handleChange}
              placeholder="Ej: Buscar Trabajo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-[#001f3f] outline-none transition-shadow"
            />
          </div>
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
            className="flex items-center gap-2 px-6 py-2.5 bg-[#001f3f] hover:bg-blue-900 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentInicio;

