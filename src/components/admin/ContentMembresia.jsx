import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { Check, Loader2, Upload, CreditCard } from 'lucide-react';

const ContentMembresia = () => {
  const [formData, setFormData] = useState({
    precioMembresia: '',
    qrImageUrl: ''
  });
  const [qrFile, setQrFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAjustes = async () => {
      try {
        const docRef = doc(db, 'ajustes_membresia', 'general');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      } catch (error) {
        console.error("Error al cargar ajustes de membresía:", error);
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
      let currentQrUrl = formData.qrImageUrl;
      if (qrFile) {
        setMessage('Subiendo imagen QR...');
        const qrRef = ref(storage, 'assets/global/qr-pago.jpg');
        await uploadBytes(qrRef, qrFile);
        currentQrUrl = await getDownloadURL(qrRef);
      }

      const dataToSave = {
        ...formData,
        qrImageUrl: currentQrUrl
      };

      const docRef = doc(db, 'ajustes_membresia', 'general');
      await setDoc(docRef, dataToSave, { merge: true });
      setMessage('¡Ajustes de membresía guardados!');
      alert('¡Cambios guardados con éxito!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error al guardar ajustes de membresía:", error);
      setMessage('Hubo un error al guardar los ajustes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <CreditCard className="w-6 h-6 text-pink-500" />
        <h2 className="text-xl font-bold text-[#001f3f]">Ajustes de Membresía</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="precioMembresia" className="block text-sm font-medium text-gray-700 mb-1">
            Precio Membresía (Bs)
          </label>
          <input
            type="text"
            id="precioMembresia"
            name="precioMembresia"
            value={formData.precioMembresia}
            onChange={handleChange}
            placeholder="Ej: 99"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen QR de Pago
          </label>
          {formData.qrImageUrl && (
            <div className="mb-3 p-2 bg-gray-50 rounded-xl border border-dashed border-gray-200 inline-block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">QR Actual</p>
              <img 
                src={formData.qrImageUrl} 
                alt="QR Pago" 
                className="w-32 h-32 object-contain rounded-lg shadow-sm bg-white" 
              />
            </div>
          )}
          <div className="relative group">
            <input
              type="file"
              id="qrFile"
              accept="image/*"
              onChange={(e) => setQrFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
            />
            <Upload className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-pink-500 transition-colors" />
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
            className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-pink-500/20 disabled:opacity-70"
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

export default ContentMembresia;
