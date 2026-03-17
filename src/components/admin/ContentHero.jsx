import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Loader2, UploadCloud, Settings } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

const ContentHero = () => {
  // 1. Estados Iniciales Blindados
  const [heroData, setHeroData] = useState({
    titulo: '',
    subtitulo: '',
    imagenUrl: ''
  });
  const [initialHeroData, setInitialHeroData] = useState({
    titulo: '',
    subtitulo: '',
    imagenUrl: ''
  });
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Estado para la edición de un servicio individual
  const [servicioEnEdicion, setServicioEnEdicion] = useState(null);
  const [servicioForm, setServicioForm] = useState({
    titulo: '',
    descripcion: '',
    botonTexto: ''
  });

  // 2. Carga de Datos (useEffect)
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Hero
        const heroRef = doc(db, 'ajustes_home', 'hero');
        const heroSnap = await getDoc(heroRef);
        
        // Fetch Servicios
        const servRef = doc(db, 'ajustes_home', 'servicios');
        const servSnap = await getDoc(servRef);

        if (isMounted) {
          // Procesar Hero
          if (heroSnap.exists()) {
            const data = heroSnap.data();
            const sanitized = {
              titulo: data?.titulo || 'El personal de confianza que tu hogar merece',
              subtitulo: data?.subtitulo || 'Conectamos familias y empresas bolivianas con el mejor personal.',
              imagenUrl: data?.imagenUrl || ''
            };
            setHeroData(sanitized);
            setInitialHeroData(sanitized);
            setPreviewUrl(sanitized.imagenUrl);
          } else {
            // Defaults si no existe
            const defaults = {
              titulo: 'El personal de confianza que tu hogar merece',
              subtitulo: 'Conectamos familias y empresas bolivianas con el mejor personal.',
              imagenUrl: ''
            };
            setHeroData(defaults);
            setInitialHeroData(defaults);
          }

          // Procesar Servicios
          if (servSnap.exists() && Array.isArray(servSnap.data()?.lista)) {
            setServicios(servSnap.data().lista);
          } else {
            // Defaults si no existe
            setServicios([
              { id: 'hogar', titulo: 'Gestión Hogar', descripcion: 'Personal para el cuidado de tu familia.', botonTexto: 'Solicitar Personal' },
              { id: 'empresa', titulo: 'Gestión Empresa', descripcion: 'Soluciones para tu oficina.', botonTexto: 'Solicitar Personal' }
            ]);
          }
        }
      } catch (err) {
        console.error("Error cargando configuración:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Handlers para Hero
  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setHeroData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      let finalImageUrl = initialHeroData?.imagenUrl || '';
      if (imageFile) {
        const storageRef = ref(storage, `hero_images/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const updated = { ...heroData, imagenUrl: finalImageUrl };
      await setDoc(doc(db, 'ajustes_home', 'hero'), updated, { merge: true });
      
      setHeroData(updated);
      setInitialHeroData(updated);
      setImageFile(null);
      setMessage('¡Hero Section actualizada!');
      alert('¡Cambios guardados con éxito!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error al guardar Hero:", err);
      setMessage('Error al guardar cambios.');
    } finally {
      setSaving(false);
    }
  };

  // Handlers para Servicios
  const iniciarEdicion = (s) => {
    setServicioEnEdicion(s.id);
    setServicioForm({
      titulo: s.titulo || '',
      descripcion: s.descripcion || '',
      botonTexto: s.botonTexto || ''
    });
  };

  const handleServicioChange = (e) => {
    const { name, value } = e.target;
    setServicioForm(prev => ({ ...prev, [name]: value || '' }));
  };

  const guardarServicio = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const nuevaLista = (servicios || []).map(s => 
        s.id === servicioEnEdicion ? { ...s, ...servicioForm } : s
      );
      
      await setDoc(doc(db, 'ajustes_home', 'servicios'), { lista: nuevaLista }, { merge: true });
      setServicios(nuevaLista);
      setServicioEnEdicion(null);
      alert('¡Servicio actualizado en Firebase!');
    } catch (err) {
      console.error("Error guardando servicios:", err);
      alert('Error al guardar servicios.');
    } finally {
      setSaving(false);
    }
  };

  // 3. Renderizado Seguro (Evitar Crash)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-navy-950 font-bold animate-pulse">Cargando configuración...</p>
      </div>
    );
  }

  const hasChangesHero = 
    heroData?.titulo !== initialHeroData?.titulo || 
    heroData?.subtitulo !== initialHeroData?.subtitulo || 
    imageFile !== null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* TARJETA HERO */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-pink-500" />
            Editor de Inicio - Hero Section
          </h2>
        </div>
        <form onSubmit={handleSaveHero} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-950 mb-1.5">Título</label>
              <input 
                type="text" 
                name="titulo" 
                value={heroData?.titulo || ''} 
                onChange={handleHeroChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-950 mb-1.5">Subtítulo</label>
              <textarea 
                name="subtitulo" 
                value={heroData?.subtitulo || ''} 
                onChange={handleHeroChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-950 mb-1.5">Imagen de Portada</label>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative group w-full md:w-64 h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-all cursor-pointer">
                  {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <UploadCloud className="w-8 h-8 text-gray-400" />}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Formatos aceptados: JPG, PNG. Se recomienda alta resolución.</p>
              </div>
            </div>
          </div>
          {message && <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 font-bold text-sm">{message}</div>}
          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving || !hasChangesHero}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${saving || !hasChangesHero ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Guardando...' : 'Guardar y Publicar'}
            </button>
          </div>
        </form>
      </div>

      {/* TARJETA SERVICIOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Editor de Servicios
          </h2>
        </div>
        <div className="p-8">
          {servicioEnEdicion ? (
            <form onSubmit={guardarServicio} className="space-y-6 bg-blue-50/30 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-navy-950">Editando Servicio</h3>
              <div className="space-y-4">
                <input type="text" name="titulo" value={servicioForm?.titulo || ''} onChange={handleServicioChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Título" required />
                <textarea name="descripcion" value={servicioForm?.descripcion || ''} onChange={handleServicioChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Descripción" required></textarea>
                <input type="text" name="botonTexto" value={servicioForm?.botonTexto || ''} onChange={handleServicioChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Texto del botón" required />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-all">Actualizar en Firebase</button>
                <button type="button" onClick={() => setServicioEnEdicion(null)} className="px-6 py-2 text-gray-500 font-bold">Cancelar</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(servicios || []).map((s) => (
                <div key={s?.id || Math.random()} className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-navy-950 mb-2">{s?.titulo || 'Sin título'}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{s?.descripcion || 'Sin descripción'}</p>
                  </div>
                  <button onClick={() => iniciarEdicion(s)} className="w-full py-2.5 bg-white border border-gray-200 text-navy-950 font-bold rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-sm">
                    Editar Textos
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentHero;
