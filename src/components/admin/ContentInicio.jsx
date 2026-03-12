import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { Check, Edit3, Loader2 } from 'lucide-react';

const ContentInicio = () => {
  const [formData, setFormData] = useState({
    titulo_hero: '',
    subtitulo_hero: '',
    heroImageUrl: ''
  });
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const docRef = doc(db, 'contenido_inicio', 'hero');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data());
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
      let currentImageUrl = formData.heroImageUrl;
      if (heroImageFile) {
        setMessage('Subiendo imagen...');
        const imageRef = ref(storage, 'assets/hero/imagen-hero.jpg');
        await uploadBytes(imageRef, heroImageFile);
        currentImageUrl = await getDownloadURL(imageRef);
      }

      const dataToSave = {
        ...formData,
        heroImageUrl: currentImageUrl
      };

      const docRef = doc(db, 'contenido_inicio', 'hero');
      await setDoc(docRef, dataToSave, { merge: true });
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
        <h2 className="text-xl font-bold text-[#001f3f]">Editor de Inicio (Hero)</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="titulo_hero" className="block text-sm font-medium text-gray-700 mb-1">
            Título Principal (Hero)
          </label>
          <input
            type="text"
            id="titulo_hero"
            name="titulo_hero"
            value={formData.titulo_hero}
            onChange={handleChange}
            placeholder="Ej: Empleadas domésticas y cuidado del hogar"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-[#001f3f] outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="subtitulo_hero" className="block text-sm font-medium text-gray-700 mb-1">
            Subtítulo (Hero)
          </label>
          <textarea
            id="subtitulo_hero"
            name="subtitulo_hero"
            value={formData.subtitulo_hero}
            onChange={handleChange}
            placeholder="Encuentra al personal doméstico ideal con confianza..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-[#001f3f] outline-none transition-shadow resize-none"
          ></textarea>
        </div>

        <div>
          <label htmlFor="heroImageFile" className="block text-sm font-medium text-gray-700 mb-1">
            Imagen Principal (Hero)
          </label>
          {formData.heroImageUrl && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Imagen actual:</p>
              <img src={formData.heroImageUrl} alt="Hero actual" className="w-48 h-32 object-cover rounded-xl border border-gray-200 shadow-sm" />
            </div>
          )}
          <input
            type="file"
            id="heroImageFile"
            accept="image/*"
            onChange={(e) => setHeroImageFile(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-[#001f3f] outline-none transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-[#001f3f] hover:bg-blue-900 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentInicio;
