import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, QrCode, ShieldCheck } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const WHATSAPP_NUMBER = '59168669000';
const WHATSAPP_MSG = encodeURIComponent('Hola Empleame, realicé el pago');
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

export default function Membership() {
  const [precio, setPrecio] = useState('89');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAjustes = async () => {
      try {
        const docRef = doc(db, 'ajustes_membresia', 'general');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.precioMembresia) {
            setPrecio(data.precioMembresia);
          }
          if (data.qrImageUrl) {
            setQrImageUrl(data.qrImageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching membership settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAjustes();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-navy-950 mb-4">Membresía Premium</h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Acceso ilimitado a hojas de vida, contactos directos y talento verificado para tu hogar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Card: Plan Acceso Total */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-full border border-pink-100 uppercase tracking-widest shadow-sm">
                Recomendado
              </span>
            </div>
            
            <h2 className="text-2xl font-black text-navy-950 mb-2">Plan Acceso Total</h2>
            
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-navy-950">{precio} Bs</span>
              <span className="text-gray-400 font-medium">/ mes</span>
            </div>

            <ul className="space-y-4 mb-2">
              {[
                'Ver CVs ilimitados',
                'Contacto directo por WhatsApp',
                'Soporte personalizado',
                'Talento 100% verificado'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <div className="w-5 h-5 bg-green-50 text-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card: Payment Instructions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-navy-600 text-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-pink-400" />
                ¿Cómo activar?
              </h3>
              
              <div className="space-y-6">
                {/* Step 1: QR Payment */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-navy-500 rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-navy-400 text-sm">1</div>
                  <div className="flex-1">
                    <p className="font-semibold mb-3">Escanea el código QR para pagar</p>
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-inner overflow-hidden">
                      {qrImageUrl ? (
                        <img 
                          src={qrImageUrl} 
                          alt="QR de Pago" 
                          className="w-32 h-32 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-2">
                           <QrCode className="w-10 h-10 text-gray-300 mb-2" />
                           <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest text-center">QR no disponible</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 2: WhatsApp Confirmation */}
                <div className="flex gap-4 border-t border-navy-500 pt-6">
                  <div className="w-8 h-8 bg-navy-500 rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-navy-400 text-sm">2</div>
                  <p className="font-semibold text-sm leading-relaxed">Envía el comprobante por WhatsApp para activar tu cuenta de inmediato</p>
                </div>
              </div>

              {/* Action Button */}
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-green-500/30 hover:-translate-y-1 active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar comprobante por WhatsApp
              </a>
            </div>

            <p className="text-center text-xs text-gray-400 px-4 italic font-medium">
              Activación garantizada en menos de 30 minutos.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
