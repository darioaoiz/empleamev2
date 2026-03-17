import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Loader2, User, Phone, Briefcase, Award, Camera, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Unete() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    especialidad: '',
    experiencia: '',
  });
  const [foto, setFoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let fotoUrl = '';
      let cvUrl = '';

      // 1. Subir Foto si existe
      if (foto) {
        const fotoRef = ref(storage, `solicitudes_empleo/fotos/${Date.now()}_${foto.name}`);
        const snapshot = await uploadBytes(fotoRef, foto);
        fotoUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Subir CV si existe
      if (cv) {
        const cvRef = ref(storage, `solicitudes_empleo/cvs/${Date.now()}_${cv.name}`);
        const snapshot = await uploadBytes(cvRef, cv);
        cvUrl = await getDownloadURL(snapshot.ref);
      }

      // 3. Guardar en Firestore
      await addDoc(collection(db, 'solicitudes_empleo'), {
        ...formData,
        fotoUrl,
        cvUrl,
        fechaSolicitud: serverTimestamp(),
        estado: 'pendiente'
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error(err);
      setError('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-soft-lg border border-pink-100 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-navy-950 mb-4">¡Solicitud Enviada!</h2>
          <p className="text-gray-500 mb-6">
            Gracias por interesarte en formar parte de nuestro equipo. Revisaremos tu perfil y nos pondremos en contacto contigo pronto.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-soft-lg border border-pink-100"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-navy-950">Trabaja con Nosotros</h1>
            <p className="mt-2 text-gray-500">Completa el formulario para postularte como profesional en Empleame</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-500" /> Nombre Completo
                </label>
                <input
                  required
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Ej: María García"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-500" /> Teléfono / WhatsApp
                </label>
                <input
                  required
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Ej: +591 70000000"
                />
              </div>

              {/* Especialidad */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-pink-500" /> Especialidad
                </label>
                <select
                  required
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all appearance-none bg-white font-medium"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Limpieza Hogar">Limpieza Hogar</option>
                  <option value="Cuidado Niños/Adultos">Cuidado Niños/Adultos</option>
                  <option value="Cocina">Cocina</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              {/* Experiencia */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-pink-500" /> Años de Experiencia
                </label>
                <input
                  required
                  name="experiencia"
                  type="text"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Ej: 5 años"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Foto de Perfil */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-pink-500" /> Foto de Perfil
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFoto(e.target.files[0])}
                    className="hidden"
                    id="foto-upload"
                  />
                  <label 
                    htmlFor="foto-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer group-hover:border-pink-300 group-hover:bg-pink-50 transition-all overflow-hidden bg-gray-50"
                  >
                    {foto ? (
                      <div className="flex items-center gap-2 text-pink-600 font-medium p-4 text-center">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{foto.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-pink-500">
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium text-center">Toca para subir o arrastra tu foto</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* CV */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pink-500" /> Currículum Vitae (PDF o Word)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCv(e.target.files[0])}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label 
                    htmlFor="cv-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer group-hover:border-pink-300 group-hover:bg-pink-50 transition-all overflow-hidden bg-gray-50"
                  >
                    {cv ? (
                      <div className="flex items-center gap-2 text-pink-600 font-medium p-4 text-center">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{cv.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-pink-500">
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium text-center">Toca para subir CV (PDF/Word)</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>Enviar Postulación</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
