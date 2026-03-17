import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { Users, Loader2, CheckCircle2, Trash2, Edit } from 'lucide-react';

const ContentTalento = () => {
  const initialFormState = {
    nombre: '',
    especialidad: '',
    ciudad: 'Santa Cruz',
    modalidad: 'Cama afuera',
    edad: '',
    experiencia: '',
    resumen: '',
    estado: 'Libre'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [candidatas, setCandidatas] = useState([]);
  const [loadingCandidatas, setLoadingCandidatas] = useState(true);

  // Estados para archivos
  const [fotoFile, setFotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [cvUrlLink, setCvUrlLink] = useState('');

  // Estado para edición
  const [editId, setEditId] = useState(null);

  React.useEffect(() => {
    const q = query(
      collection(db, 'candidatas'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const candidatasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCandidatas(candidatasData);
      setLoadingCandidatas(false);
    }, (error) => {
      console.error("Error obteniendo candidatas:", error);
      setLoadingCandidatas(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a la candidata ${nombre}?`)) {
      try {
        await deleteDoc(doc(db, 'candidatas', id));
      } catch (error) {
        console.error("Error al eliminar candidata:", error);
        alert("Hubo un error al intentar eliminar la candidata.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (candidata) => {
    setEditId(candidata.id);
    setFormData({
      nombre: candidata.nombre || '',
      especialidad: candidata.especialidad || '',
      ciudad: candidata.ciudad || 'Santa Cruz',
      modalidad: candidata.modalidad || 'Cama afuera',
      edad: candidata.edad || '',
      experiencia: candidata.experiencia || '',
      resumen: candidata.resumen || '',
      estado: candidata.estado || 'Libre'
    });
    setCvUrlLink(candidata.cvExternalLink || '');
    setFotoFile(null);
    setCvFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 'Libre' ? 'Contratada' : 'Libre';
      await updateDoc(doc(db, 'candidatas', id), {
        estado: newEstado,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Hubo un error al actualizar el estado de la candidata.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: 'Subiendo...', type: 'info' });

    try {
      let fotoUrl = '';
      let cvPdfUrl = '';

      if (fotoFile) {
        const fotoRef = ref(storage, `fotos_perfil/${Date.now()}_${fotoFile.name}`);
        await uploadBytes(fotoRef, fotoFile);
        fotoUrl = await getDownloadURL(fotoRef);
      }

      if (cvFile) {
        const cvRef = ref(storage, `hojas_de_vida/${Date.now()}_${cvFile.name}`);
        await uploadBytes(cvRef, cvFile);
        cvPdfUrl = await getDownloadURL(cvRef);
      }

      const dataToSave = {
        ...formData,
        edad: Number(formData.edad),
        experiencia: Number(formData.experiencia),
        cvExternalLink: cvUrlLink || null
      };

      if (fotoUrl) dataToSave.fotoUrl = fotoUrl;
      if (cvPdfUrl) dataToSave.cvPdfUrl = cvPdfUrl;

      if (editId) {
        dataToSave.updatedAt = serverTimestamp();
        await updateDoc(doc(db, 'candidatas', editId), dataToSave);
        setMessage({ text: '¡Candidata actualizada con éxito!', type: 'success' });
      } else {
        dataToSave.createdAt = serverTimestamp();
        await addDoc(collection(db, 'candidatas'), dataToSave);
        setMessage({ text: '¡Candidata registrada con éxito!', type: 'success' });
      }
      
      setFormData(initialFormState); // Reset form
      setFotoFile(null);
      setCvFile(null);
      setCvUrlLink('');
      setEditId(null);
      
      // Clear success message after 4 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (error) {
      console.error("Error al guardar candidata:", error);
      setMessage({ text: 'Hubo un error al registrar la candidata.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <Users className="w-6 h-6 text-navy-950" />
        <h2 className="text-xl font-bold text-navy-950">Gestión de Talento</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {editId ? 'Editar Candidata' : 'Registrar Nueva Candidata'}
        </h3>
        <p className="text-sm text-gray-500">
          {editId ? 'Modifica los datos de la candidata.' : 'Completa los datos básicos para añadir al catálogo (sin foto).'}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: María Elena Condori"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow"
            />
          </div>

          {/* Especialidad */}
          <div>
            <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
            <select
              id="especialidad"
              name="especialidad"
              required
              value={formData.especialidad}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow bg-white"
            >
              <option value="" disabled>Seleccionar...</option>
              <option value="Empleada Doméstica">Empleada Doméstica</option>
              <option value="Niñera / Babysitter">Niñera / Babysitter</option>
              <option value="Cocinera">Cocinera</option>
              <option value="Cuidadora / Enfermera">Cuidadora / Enfermera</option>
              <option value="Jardinero">Jardinero</option>
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
            <select
              id="ciudad"
              name="ciudad"
              required
              value={formData.ciudad}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow bg-white"
            >
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="La Paz">La Paz</option>
              <option value="Cochabamba">Cochabamba</option>
            </select>
          </div>

          {/* Modalidad */}
          <div>
            <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700 mb-1">Modalidad *</label>
            <select
              id="modalidad"
              name="modalidad"
              required
              value={formData.modalidad}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow bg-white"
            >
              <option value="Cama afuera">Cama afuera</option>
              <option value="Cama adentro">Cama adentro</option>
              <option value="Por horas">Por horas</option>
            </select>
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
            <input
              type="number"
              id="edad"
              name="edad"
              required
              min="18"
              max="70"
              value={formData.edad}
              onChange={handleChange}
              placeholder="Ej: 35"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow"
            />
          </div>

          {/* Experiencia */}
          <div>
            <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-1">Años de Experiencia *</label>
            <input
              type="number"
              id="experiencia"
              name="experiencia"
              required
              min="0"
              max="50"
              value={formData.experiencia}
              onChange={handleChange}
              placeholder="Ej: 5"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow"
            />
          </div>

          {/* Resumen */}
          <div className="md:col-span-2">
            <label htmlFor="resumen" className="block text-sm font-medium text-gray-700 mb-1">Resumen / Perfil</label>
            <textarea
              id="resumen"
              name="resumen"
              value={formData.resumen}
              onChange={handleChange}
              placeholder="Breve descripción de sus habilidades..."
              rows="3"
              maxLength="300"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow resize-none"
            ></textarea>
            <p className="text-xs text-gray-400 mt-1 text-right">{formData.resumen.length}/300</p>
          </div>

          {/* Foto */}
          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil (.jpg, .png)</label>
            <input
              type="file"
              id="foto"
              accept=".jpg,.png"
              onChange={(e) => setFotoFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
            />
          </div>

          {/* CV */}
          <div>
            <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">Hoja de Vida (.pdf)</label>
            <input
              type="file"
              id="cv"
              accept=".pdf"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-navy-600 file:text-white hover:file:bg-navy-700"
            />
          </div>

          {/* Link Externo CV */}
          <div className="md:col-span-2">
            <label htmlFor="cvUrlLink" className="block text-sm font-medium text-gray-700 mb-1">Enlace Externo CV (Opcional)</label>
            <input
              type="url"
              id="cvUrlLink"
              value={cvUrlLink}
              onChange={(e) => setCvUrlLink(e.target.value)}
              placeholder="Ej: https://drive.google.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-950 focus:border-navy-950 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Notificaciones */}
        {message.text && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
            message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {message.type === 'info' && <Loader2 className="w-4 h-4 animate-spin" />}
            {message.text}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>{editId ? 'Actualizar Datos' : 'Agregar Candidata'}</>
            )}
          </button>
        </div>
      </form>

      {/* Tabla de Candidatas */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Users className="w-6 h-6 text-navy-950" />
          <h2 className="text-xl font-bold text-navy-950">Candidatas Registradas</h2>
        </div>

        {loadingCandidatas ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-navy-950 animate-spin" />
          </div>
        ) : candidatas.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No hay candidatas registradas aún.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-navy-950 text-white">
                <tr>
                  <th className="px-6 py-4 font-medium">Nombre</th>
                  <th className="px-6 py-4 font-medium">Especialidad</th>
                  <th className="px-6 py-4 font-medium">Ciudad</th>
                  <th className="px-6 py-4 font-medium text-center">Estado</th>
                  <th className="px-6 py-4 font-medium text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidatas.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.nombre}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {c.especialidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 truncate max-w-[150px]">{c.ciudad}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleEstado(c.id, c.estado || 'Libre')}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          (c.estado || 'Libre') === 'Libre'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                        }`}
                      >
                        {c.estado || 'Libre'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar candidata"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.nombre)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar candidata"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTalento;
