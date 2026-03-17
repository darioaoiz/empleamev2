import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Loader2, UploadCloud, Settings } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

const AdminGlobal = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Estados Hero ---
  const [heroData, setHeroData] = useState({ titulo: '', subtitulo: '', imagenUrl: '' });
  const [initialHeroData, setInitialHeroData] = useState({ titulo: '', subtitulo: '', imagenUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // --- Estados Servicios (Home Cards) ---
  const [servicios, setServicios] = useState([]);
  const [servicioEnEdicion, setServicioEnEdicion] = useState(null);
  const [servicioForm, setServicioForm] = useState({ titulo: '', descripcion: '', botonTexto: '' });

  // 1. Carga de Datos
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [heroSnap, servSnap] = await Promise.all([
          getDoc(doc(db, 'ajustes_home', 'hero')),
          getDoc(doc(db, 'ajustes_home', 'servicios'))
        ]);

        if (isMounted) {
          // HERO
          if (heroSnap.exists()) {
            const h = heroSnap.data();
            const hSanitized = {
              titulo: h?.titulo || 'El personal de confianza que tu hogar merece',
              subtitulo: h?.subtitulo || 'Conectamos familias y empresas bolivianas con el mejor personal.',
              imagenUrl: h?.imagenUrl || ''
            };
            setHeroData(hSanitized);
            setInitialHeroData(hSanitized);
            setPreviewUrl(hSanitized.imagenUrl);
          }

          // SERVICIOS
          if (servSnap.exists() && Array.isArray(servSnap.data()?.lista)) {
            setServicios(servSnap.data().lista);
          } else {
            setServicios([
              { id: 'hogar', titulo: 'Gestión Hogar', descripcion: 'Personal para el cuidado de tu familia.', botonTexto: 'Solicitar Personal' },
              { id: 'empresa', titulo: 'Gestión Empresa', descripcion: 'Soluciones para tu oficina.', botonTexto: 'Solicitar Personal' }
            ]);
          }
        }
      } catch (err) {
        console.error("Error cargando Admin Inicio:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  // --- Handlers Hero ---
  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setHeroData(prev => ({ ...prev, [name]: value || '' }));
  };

  const validateFile = (file) => {
    const maxSize = 2 * 1024 * 1024;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Formato no permitido.');
      return false;
    }
    if (file.size > maxSize) {
      alert('Máximo 2MB.');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateFile(file)) return;
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = initialHeroData?.imagenUrl || '';
      if (imageFile) {
        const fileName = `${Date.now()}_hero_${imageFile.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `hero_images/${fileName}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }
      const updated = { ...heroData, imagenUrl: finalImageUrl };
      await setDoc(doc(db, 'ajustes_home', 'hero'), updated, { merge: true });
      setHeroData(updated);
      setInitialHeroData(updated);
      setImageFile(null);
      alert('¡Hero Section actualizada!');
    } catch (err) {
      console.error(err);
      alert('Error al guardar Hero.');
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers Servicios ---
  const iniciarEdicionServicio = (s) => {
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
      const nuevaLista = servicios.map(s => s.id === servicioEnEdicion ? { ...s, ...servicioForm } : s);
      await setDoc(doc(db, 'ajustes_home', 'servicios'), { lista: nuevaLista }, { merge: true });
      setServicios(nuevaLista);
      setServicioEnEdicion(null);
      alert('¡Servicio actualizado!');
    } catch (err) {
      console.error(err);
      alert('Error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Cargando gestión de inicio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* EDITOR HERO */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-pink-500" />
            Editor Hero (Inicio)
          </h2>
        </div>
        <form onSubmit={handleSaveHero} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-950 mb-1.5">Título</label>
                <input type="text" name="titulo" value={heroData.titulo} onChange={handleHeroChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-950 mb-1.5">Subtítulo</label>
                <textarea name="subtitulo" value={heroData.subtitulo} onChange={handleHeroChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-950 mb-1.5">Imagen de Fondo</label>
              <div className="relative w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <UploadCloud className="w-10 h-10 text-gray-300" />}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold uppercase">Cambiar Imagen</div>
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Hero
          </button>
        </form>
      </div>

      {/* EDITOR SERVICIOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Tarjetas de Servicios (Hogar / Empresa)
          </h2>
        </div>
        <div className="p-8">
          {servicioEnEdicion ? (
            <form onSubmit={guardarServicio} className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="titulo" value={servicioForm.titulo} onChange={handleServicioChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Título" required />
                <input type="text" name="botonTexto" value={servicioForm.botonTexto} onChange={handleServicioChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Texto botón" required />
              </div>
              <textarea name="descripcion" value={servicioForm.descripcion} onChange={handleServicioChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Descripción" required />
              <div className="flex gap-4 pt-2">
                <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all">Actualizar</button>
                <button type="button" onClick={() => setServicioEnEdicion(null)} className="text-gray-500 font-bold px-4 hover:text-navy-950 transition-colors">Cancelar</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicios.map(s => (
                <div key={s.id} className="p-5 border border-gray-100 bg-gray-50/50 rounded-2xl flex flex-col shadow-sm group hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-navy-950 text-lg uppercase tracking-tight">{s.titulo}</span>
                    <button onClick={() => iniciarEdicionServicio(s)} className="text-blue-600 p-2 bg-white rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{s.descripcion}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Botón: {s.botonTexto}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGlobal;
