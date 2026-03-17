import React, { useState, useEffect } from 'react';
import { Save, Loader2, Layout, Home, Building2, Trash2, Plus, Pencil, Image as ImageIcon, UploadCloud, Eye, ClipboardList, CheckSquare, Calendar, X, ChevronRight } from 'lucide-react';
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc, addDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

const ContentFormularios = () => {
  // 1. Estados iniciales blindados
  const [formData, setFormData] = useState({
    mainTitle: '',
    mainSubtitle: '',
    hogarWelcome: '',
    empresaWelcome: ''
  });
  const [initialData, setInitialData] = useState({
    mainTitle: '',
    mainSubtitle: '',
    hogarWelcome: '',
    empresaWelcome: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('textos'); // 'textos' o 'items'

  // --- Estados Items Formularios ---
  const [itemsForm, setItemsForm] = useState([]);
  const [nuevoItem, setNuevoItem] = useState({ 
    categoria: 'hogar', 
    titulo: '', 
    desc: '',
    preguntas: [] // Array de { id, label, type }
  });
  const [itemEnEdicion, setItemEnEdicion] = useState(null); 
  
  // Portada Principal (1200x630)
  const [itemImageFile, setItemImageFile] = useState(null);
  const [itemPreviewUrl, setItemPreviewUrl] = useState('');
  
  // Portada de Formulario
  const [itemFormImageFile, setItemFormImageFile] = useState(null);
  const [itemFormPreviewUrl, setItemFormPreviewUrl] = useState('');

  // --- Estado Solicitudes Recibidas ---
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  // 2. Carga de datos
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Textos Generales
        const textsDoc = await getDoc(doc(db, 'ajustes_formularios', 'textos'));
        
        // 2. Items (Cards)
        const itemsSnap = await getDocs(collection(db, 'items_formularios'));
        const fetchedItems = itemsSnap.docs.map(d => ({ ...d.data(), id: d.id }));

        if (isMounted) {
          if (textsDoc.exists()) {
            const data = textsDoc.data();
            const sanitized = {
              mainTitle: data?.mainTitle || '¿Qué servicio necesitas?',
              mainSubtitle: data?.mainSubtitle || 'Completa el formulario correspondiente y nos pondremos en contacto contigo rápidamente.',
              hogarWelcome: data?.hogarWelcome || 'Bienvenido a la sección de Hogar. Encuentra el personal ideal para tu familia.',
              empresaWelcome: data?.empresaWelcome || 'Bienvenido a la sección de Empresa. Soluciones profesionales para tu negocio.'
            };
            setFormData(sanitized);
            setInitialData(sanitized);
          } else {
            const defaults = {
              mainTitle: '¿Qué servicio necesitas?',
              mainSubtitle: 'Completa el formulario correspondiente y nos pondremos en contacto contigo rápidamente.',
              hogarWelcome: 'Bienvenido a la sección de Hogar. Encuentra el personal ideal para tu familia.',
              empresaWelcome: 'Bienvenido a la sección de Empresa. Soluciones profesionales para tu negocio.'
            };
            setFormData(defaults);
            setInitialData(defaults);
          }

          setItemsForm(fetchedItems);
        }
      } catch (err) {
        console.error("Error cargando ajustes de formularios:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // 3. Suscripción a Solicitudes de Servicios (Real-time)
    const qSolicitudes = query(collection(db, 'solicitudes_servicios'), orderBy('timestamp', 'desc'));
    const unsubSolicitudes = onSnapshot(qSolicitudes, 
      (snap) => {
        setSolicitudes(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      },
      (error) => {
        console.error("Error en suscripción de solicitudes:", error);
      }
    );

    return () => { 
      isMounted = false; 
      unsubSolicitudes();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'ajustes_formularios', 'textos'), formData, { merge: true });
      setInitialData({ ...formData });
      alert('¡Textos de formularios guardados!');
    } catch (err) {
      console.error("Error al guardar ajustes de formularios:", err);
      alert('Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers Items ---
  const validateFile = (file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Formato no permitido. Usa .jpg, .png o .webp');
      return false;
    }
    if (file.size > maxSize) {
      alert('El archivo es muy grande (Máx. 2MB)');
      return false;
    }
    return true;
  };

  const handleItemFormFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateFile(file)) return;
      setItemFormImageFile(file);
      setItemFormPreviewUrl(URL.createObjectURL(file));
    }
  };

  const iniciarEdicionItem = (item) => {
    setItemEnEdicion(item.id);
    setNuevoItem({
      categoria: item.categoria || 'hogar',
      titulo: item.titulo || '',
      desc: item.desc || '',
      preguntas: item.preguntas || []
    });
    setItemPreviewUrl(item.imagenUrl || '');
    setItemFormPreviewUrl(item.formImagenUrl || '');
    setItemImageFile(null);
    setItemFormImageFile(null);
  };

  const cancelarEdicionItem = () => {
    setItemEnEdicion(null);
    setNuevoItem({ 
      categoria: 'hogar', 
      titulo: '', 
      desc: '', 
      preguntas: [] 
    });
    setItemPreviewUrl('');
    setItemFormPreviewUrl('');
    setItemImageFile(null);
    setItemFormImageFile(null);
  };

  const cargarPlantillaNinera = () => {
    const plantillaNinera = [
      { id: 1, label: 'Nombre Completo', type: 'text' },
      { id: 2, label: 'Teléfono de Contacto', type: 'tel' },
      { id: 3, label: 'Ubicación (Barrio/Zona)', type: 'text' },
      { id: 4, label: 'Número de Niños', type: 'number' },
      { id: 5, label: 'Edades de los niños', type: 'text' },
      { id: 6, label: 'Tareas adicionales (Ej: Cocina ligera)', type: 'textarea' },
      { id: 7, label: 'Horario Requerido (Cama adentro/afuera)', type: 'select' },
      { id: 8, label: 'Fecha de inicio estimada', type: 'text' },
      { id: 9, label: 'Presupuesto aproximado (Mensual/Por hora)', type: 'text' }
    ];
    setNuevoItem(prev => ({ 
      ...prev, 
      titulo: 'Niñera Profesional',
      desc: 'Personal capacitado para el cuidado integral de tus hijos.',
      categoria: 'hogar',
      preguntas: plantillaNinera 
    }));
  };

  // --- Handlers Constructor Preguntas ---
  const agregarPregunta = () => {
    const nueva = { id: Date.now(), label: '', type: 'text' };
    setNuevoItem(prev => ({ ...prev, preguntas: [...prev.preguntas, nueva] }));
  };

  const eliminarPregunta = (id) => {
    setNuevoItem(prev => ({ ...prev, preguntas: prev.preguntas.filter(p => p.id !== id) }));
  };

  const handlePreguntaChange = (id, field, value) => {
    setNuevoItem(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleOptionChange = (qId, oId, field, value) => {
    setNuevoItem(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p => 
        p.id === qId 
          ? { 
              ...p, 
              options: (p.options || []).map(o => o.id === oId ? { ...o, [field]: value } : o) 
            } 
          : p
      )
    }));
  };

  const agregarOpcion = (qId) => {
    const nuevaOpcion = { id: Date.now(), label: '', imageUrl: '' };
    setNuevoItem(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p => 
        p.id === qId 
          ? { ...p, options: [...(p.options || []), nuevaOpcion] } 
          : p
      )
    }));
  };

  const eliminarOpcion = (qId, oId) => {
    setNuevoItem(prev => ({
      ...prev,
      preguntas: prev.preguntas.map(p => 
        p.id === qId 
          ? { ...p, options: (p.options || []).filter(o => o.id !== oId) } 
          : p
      )
    }));
  };

  const handleOptionIconChange = async (qId, oIdx, file) => {
    if (!validateFile(file)) return;
    setSaving(true);
    try {
      const fileName = `${Date.now()}_oicon_${file.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, `form_icons/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      setNuevoItem(prev => ({
        ...prev,
        preguntas: prev.preguntas.map(p => {
          if (p.id === qId) {
            const newOptions = [...(p.options || [])];
            newOptions[oIdx] = { ...newOptions[oIdx], imageUrl: url };
            return { ...p, options: newOptions };
          }
          return p;
        })
      }));
    } catch (err) {
      console.error("Error subiendo icono de opción:", err);
      alert("Error al subir el icono.");
    } finally {
      setSaving(false);
    }
  };

  const moverPregunta = (index, direction) => {
    const newPreguntas = [...nuevoItem.preguntas];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPreguntas.length) return;
    [newPreguntas[index], newPreguntas[targetIndex]] = [newPreguntas[targetIndex], newPreguntas[index]];
    setNuevoItem(prev => ({ ...prev, preguntas: newPreguntas }));
  };

  const handleQuestionIconChange = async (idx, file) => {
    if (!validateFile(file)) return;
    setSaving(true);
    try {
      const fileName = `${Date.now()}_qicon_${file.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, `form_icons/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      const newPreguntas = [...nuevoItem.preguntas];
      newPreguntas[idx] = { ...newPreguntas[idx], imageUrl: url };
      setNuevoItem(prev => ({ ...prev, preguntas: newPreguntas }));
    } catch (err) {
      console.error("Error subiendo icono de pregunta:", err);
      alert("Error al subir el icono.");
    } finally {
      setSaving(false);
    }
  };

  const handleGuardarItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = itemPreviewUrl;
      let finalFormImageUrl = itemFormPreviewUrl;

      // 1. Subida Portada Principal
      if (itemImageFile) {
        const fileName = `${Date.now()}_cover_${itemImageFile.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `form_covers/${fileName}`);
        const snapshot = await uploadBytes(storageRef, itemImageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Subida Portada Formulario (Banner)
      if (itemFormImageFile) {
        const fileName = `${Date.now()}_form_banner_${itemFormImageFile.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `form_covers/${fileName}`);
        const snapshot = await uploadBytes(storageRef, itemFormImageFile);
        finalFormImageUrl = await getDownloadURL(snapshot.ref);
      }

      if (!finalImageUrl && !itemEnEdicion) {
        alert('Por favor selecciona una imagen para la tarjeta.');
        setSaving(false); return;
      }

      const itemData = { 
        ...nuevoItem, 
        imagenUrl: finalImageUrl,
        formImagenUrl: finalFormImageUrl
      };

      if (itemEnEdicion) {
        await updateDoc(doc(db, 'items_formularios', itemEnEdicion), itemData);
        setItemsForm(itemsForm.map(it => it.id === itemEnEdicion ? { ...it, ...itemData } : it));
        alert('¡Servicio y Formulario actualizados!');
      } else {
        const customId = nuevoItem.titulo.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        const docRef = await addDoc(collection(db, 'items_formularios'), { ...itemData, id: customId });
        setItemsForm([...itemsForm, { ...itemData, id: docRef.id }]);
        alert('¡Nuevo servicio dinámico creado!');
      }
      cancelarEdicionItem();
    } catch (err) {
      console.error("Error Saving Item:", err);
      alert('Error crítico al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleItemFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateFile(file)) return;
      setItemImageFile(file);
      setItemPreviewUrl(URL.createObjectURL(file));
    }
  };

  const eliminarItem = async (id) => {
    if (!window.confirm('¿Eliminar este item?')) return;
    try {
      await deleteDoc(doc(db, 'items_formularios', id));
      setItemsForm(itemsForm.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-navy-950 font-bold animate-pulse">Cargando textos...</p>
      </div>
    );
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Sub-Tabs de Navegación */}
      <div className="flex justify-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 max-w-fit mx-auto">
        <button 
          onClick={() => setActiveSubTab('textos')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeSubTab === 'textos' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950 hover:bg-gray-50'}`}
        >
          <Layout className="w-4 h-4" />
          Textos de Página
        </button>
        <button 
          onClick={() => setActiveSubTab('items')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeSubTab === 'items' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950 hover:bg-gray-50'}`}
        >
          <Plus className="w-4 h-4 text-pink-500" />
          Gestión de Tarjetas
        </button>
        <button 
          onClick={() => setActiveSubTab('recibidas')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeSubTab === 'recibidas' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950 hover:bg-gray-50'}`}
        >
          <ClipboardList className="w-4 h-4 text-green-500" />
          Solicitudes Recibidas
        </button>
      </div>

      {activeSubTab === 'textos' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
              <Layout className="w-6 h-6 text-pink-500" />
              Editor de Textos
            </h2>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-navy-950 mb-1.5">Título Principal</label>
                <input type="text" name="mainTitle" value={formData.mainTitle} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-950 mb-1.5">Subtítulo Principal</label>
                <textarea name="mainSubtitle" value={formData.mainSubtitle} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-5 bg-pink-50/30 rounded-2xl border border-pink-100 space-y-4">
                <div className="flex items-center gap-2 text-pink-600 font-bold"><Home className="w-5 h-5" /> Hogar</div>
                <textarea name="hogarWelcome" value={formData.hogarWelcome} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" placeholder="Bienvenida Hogar..." required />
              </div>
              <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold"><Building2 className="w-5 h-5" /> Empresa</div>
                <textarea name="empresaWelcome" value={formData.empresaWelcome} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" placeholder="Bienvenida Empresa..." required />
              </div>
            </div>

            <button type="submit" disabled={saving || !hasChanges} className={`flex items-center justify-center gap-2 px-10 py-4 font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${saving || !hasChanges ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}>
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              Guardar Cambios
            </button>
          </form>
        </div>
      ) : activeSubTab === 'items' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-pink-500" />
              Gestión de Items (Tarjetas)
            </h2>
          </div>
          <div className="p-8 space-y-8">
            <form onSubmit={handleGuardarItem} className={`space-y-6 p-8 rounded-3xl border transition-all ${itemEnEdicion ? 'bg-blue-50/20 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría</label>
                  <select value={nuevoItem.categoria} onChange={(e) => setNuevoItem({...nuevoItem, categoria: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-navy-950">
                    <option value="hogar">Hogar (Rosa)</option>
                    <option value="empresa">Empresa (Azul)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título del Servicio</label>
                  <input type="text" value={nuevoItem.titulo} onChange={(e) => setNuevoItem({...nuevoItem, titulo: e.target.value})} placeholder="Ej: Niñera" className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold" required />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Breve Descripción</label>
                  <input type="text" value={nuevoItem.desc} onChange={(e) => setNuevoItem({...nuevoItem, desc: e.target.value})} placeholder="Cuidado infantil y apoyo escolar..." className="px-4 py-3 border border-gray-200 rounded-xl text-sm" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Portada Tarjeta */}
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <label className="block text-sm font-bold text-navy-950">Portada de Tarjeta (1200x630)</label>
                  <div className="relative h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group">
                    {itemPreviewUrl ? <img src={itemPreviewUrl} className="w-full h-full object-cover" /> : <UploadCloud className="w-8 h-8 text-gray-300" />}
                    <input type="file" accept="image/*" onChange={(e) => handleItemFileChange(e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">REEMPLAZAR</div>
                  </div>
                </div>

                {/* Portada Formulario */}
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <label className="block text-sm font-bold text-navy-950">Portada dentro del Formulario</label>
                  <div className="relative h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group">
                    {itemFormPreviewUrl ? <img src={itemFormPreviewUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-300" />}
                    <input type="file" accept="image/*" onChange={(e) => handleItemFormFileChange(e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">SUBIR BANNER</div>
                  </div>
                </div>
              </div>

              {/* Constructor de Preguntas */}
              <div className="p-6 bg-navy-950/5 rounded-2xl space-y-4">
                 <div className="flex items-center justify-between border-b border-navy-950/10 pb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-black text-navy-950 uppercase tracking-tighter">Constructor de Preguntas Dinámicas</h3>
                    <button 
                      type="button" 
                      onClick={cargarPlantillaNinera}
                      className="bg-pink-100 text-pink-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-pink-200 transition-all flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-3 h-3" />
                      Plantilla Niñera
                    </button>
                  </div>
                  <button type="button" onClick={agregarPregunta} className="flex items-center gap-2 bg-navy-950 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-navy-800 transition-all">
                    <Plus className="w-4 h-4" />
                    Añadir Pregunta
                  </button>
                </div>

                <div className="space-y-3">
                  {(Array.isArray(nuevoItem.preguntas) ? nuevoItem.preguntas : []).map((p, idx) => (
                    <div key={p?.id || idx} className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-sm group">
                      <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                        <div className="bg-navy-950 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</div>
                        
                        {/* ICONO DE LA PREGUNTA */}
                        <div className="relative w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0 group/icon">
                          {p?.imageUrl ? (
                            <img src={p.imageUrl} className="w-full h-full object-cover" alt="Icono" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-gray-300" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleQuestionIconChange(idx, e.target.files[0])}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover/icon:opacity-100 flex items-center justify-center text-white text-[8px] font-bold">SUBIR</div>
                        </div>

                        <input 
                          type="text" 
                          value={p?.label || ''} 
                          onChange={(e) => handlePreguntaChange(p?.id, 'label', e.target.value)} 
                          placeholder="Texto de la pregunta..." 
                          className="flex-grow px-4 py-2 bg-gray-50 border-transparent focus:border-blue-200 rounded-lg text-sm outline-none transition-all"
                        />
                        <select 
                          value={p?.type || 'text'} 
                          onChange={(e) => handlePreguntaChange(p?.id, 'type', e.target.value)}
                          className="px-3 py-2 bg-gray-50 border-transparent rounded-lg text-xs font-bold text-gray-500 outline-none"
                        >
                          <option value="text">Texto Corto</option>
                          <option value="number">Número</option>
                          <option value="textarea">Respuesta Larga</option>
                          <option value="select">Selección (Si/No)</option>
                        </select>
                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => moverPregunta(idx, -1)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400"><Pencil className="w-3 h-3 -rotate-90" /></button>
                          <button type="button" onClick={() => eliminarPregunta(p?.id)} className="p-1.5 hover:bg-pink-50 rounded-md text-pink-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      {/* GESTIÓN DE OPCIONES PARA SELECT */}
                      {p?.type === 'select' && (
                        <div className="mt-3 ml-12 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-navy-950/40 uppercase tracking-widest">Opciones de Respuesta</span>
                            <button 
                              type="button" 
                              onClick={() => agregarOpcion(p.id)}
                              className="text-blue-600 text-[10px] font-bold hover:underline"
                            >
                              + Añadir Opción
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(p.options || []).map((opt, oIdx) => (
                              <div key={opt.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm relative group/opt">
                                <div className="relative w-8 h-8 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center shrink-0">
                                  {opt.imageUrl ? (
                                    <img src={opt.imageUrl} className="w-full h-full object-cover" alt="Opcion" />
                                  ) : (
                                    <Plus className="w-3 h-3 text-gray-300" />
                                  )}
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleOptionIconChange(p.id, oIdx, e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                  />
                                </div>
                                <input 
                                  type="text" 
                                  value={opt.label}
                                  onChange={(e) => handleOptionChange(p.id, opt.id, 'label', e.target.value)}
                                  placeholder="Etiqueta..."
                                  className="flex-grow text-xs font-semibold outline-none bg-transparent"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => eliminarOpcion(p.id, opt.id)}
                                  className="text-pink-400 hover:text-pink-600 p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!nuevoItem.preguntas || nuevoItem.preguntas.length === 0) && (
                    <div className="text-center py-8 text-gray-400 text-xs italic">No hay preguntas personalizadas. El formulario estará básico.</div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200/50">
                <button type="submit" disabled={saving} className={`flex-grow ${itemEnEdicion ? 'bg-blue-600' : 'bg-pink-500'} text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-200 active:scale-95 text-sm uppercase tracking-widest flex items-center justify-center gap-3`}>
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (itemEnEdicion ? 'Actualizar Servicio' : 'Lanzar Nuevo Servicio')}
                </button>
                {itemEnEdicion && <button type="button" onClick={cancelarEdicionItem} className="px-8 bg-white border border-gray-200 text-gray-500 font-bold rounded-2x hover:bg-gray-50 transition-all rounded-2xl">Cancelar</button>}
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Array.isArray(itemsForm) ? itemsForm : []).map(item => (
                <div key={item?.id} className={`p-4 rounded-2xl border flex gap-4 items-center shadow-sm transition-all ${itemEnEdicion === item?.id ? 'ring-2 ring-blue-500 scale-[1.02]' : (item?.categoria === 'hogar' ? 'border-pink-100 bg-pink-50/20' : 'border-blue-100 bg-blue-50/20')}`}>
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item?.imagenUrl ? <img src={item?.imagenUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs opacity-30">Sin foto</div>}
                  </div>
                  <div className="flex-grow">
                    <h4 className={`font-bold text-sm ${item?.categoria === 'hogar' ? 'text-pink-600' : 'text-blue-600'}`}>{item?.titulo || 'Sin Título'}</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{item?.desc || 'Sin descripción'}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => iniciarEdicionItem(item)} className="text-gray-400 hover:text-blue-600 p-2"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => eliminarItem(item?.id)} className="text-gray-300 hover:text-pink-500 p-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {(!itemsForm || itemsForm.length === 0) && (
                <div className="col-span-2 text-center py-10 text-gray-400 text-xs italic bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                  No hay servicios configurados aún.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* TAB SOLICITUDES RECIBIDAS */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-navy-950 uppercase tracking-tighter">Buzón de Solicitudes</h2>
              <p className="text-gray-500 text-sm italic">Gestión de pedidos de servicios dinámicos ({solicitudes.length})</p>
            </div>
            <div className="bg-green-50 p-3 rounded-2xl">
              <ClipboardList className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(Array.isArray(solicitudes) ? solicitudes : []).map((s) => (
              <div key={s?.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12 items-center gap-4 group text-left">
                <div className="md:col-span-1 flex justify-center md:justify-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s?.categoria === 'hogar' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                    {s?.categoria === 'hogar' ? <Home className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <h3 className="font-black text-navy-950 uppercase tracking-tight text-sm truncate">{s?.servicio || 'Servicio Desconocido'}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3 text-pink-500" />
                    {s?.timestamp ? s.timestamp.toDate().toLocaleString('es-BO', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'}) : 'Sin fecha'}
                  </div>
                </div>

                <div className="md:col-span-4 border-l md:pl-6 border-gray-100">
                  <div className="text-sm font-bold text-navy-950 truncate">{s?.clienteSubnombre || 'Anónimo'}</div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{s?.clienteSubtel || 'Sin teléfono'}</div>
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <button 
                    onClick={() => setSelectedSolicitud(s)}
                    className={`flex items-center gap-2 bg-navy-950 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-navy-100 active:scale-95 w-full md:w-auto justify-center ${s?.categoria === 'hogar' ? 'hover:bg-pink-500' : 'hover:bg-blue-600'}`}
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}

            {(!solicitudes || solicitudes.length === 0) && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
                <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No hay solicitudes pendientes aún</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DETALLE SOLICITUD */}
      {selectedSolicitud && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in fade-in duration-300">
            <div className={`p-6 text-white flex justify-between items-center ${selectedSolicitud.categoria === 'hogar' ? 'bg-pink-500' : 'bg-blue-600'}`}>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Detalle de Solicitud</h3>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{selectedSolicitud.servicio}</p>
              </div>
              <button 
                onClick={() => setSelectedSolicitud(null)}
                className="bg-white/20 hover:bg-white/40 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Información del Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Cliente</label>
                  <p className="text-sm font-bold text-navy-950">{selectedSolicitud.clienteSubnombre || 'No indicado'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Contacto</label>
                  <p className="text-sm font-bold text-navy-950">{selectedSolicitud.clienteSubtel || 'No indicado'}</p>
                </div>
              </div>

              {/* Respuestas del Formulario */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-navy-950 uppercase tracking-widest border-b border-gray-100 pb-2">Respuestas Completas</h4>
                {selectedSolicitud.respuestas && Object.entries(selectedSolicitud.respuestas).map(([pregunta, respuesta]) => (
                  <div key={pregunta} className="flex flex-col gap-1 text-left">
                    <span className={`text-[10px] font-black uppercase tracking-wide ${selectedSolicitud.categoria === 'hogar' ? 'text-pink-500' : 'text-blue-500'}`}>
                      {pregunta}
                    </span>
                    <p className="text-sm font-semibold text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">{respuesta || '-'}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <a 
                  href={`https://wa.me/${selectedSolicitud.clienteSubtel?.replace(/\D/g, '')}`}
                  target="_blank"
                  className="bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2 shadow-xl shadow-green-100"
                >
                  Continuar en WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentFormularios;
