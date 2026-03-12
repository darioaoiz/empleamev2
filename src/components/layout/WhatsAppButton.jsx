import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [whatsappButtonLabel, setWhatsappButtonLabel] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'ajustes_globales', 'general')
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data()
          if (data.whatsapp) setWhatsappNumber(data.whatsapp)
          if (data.mensajeBienvenida) setWhatsappMessage(data.mensajeBienvenida)
          if (data.whatsappButtonLabel) setWhatsappButtonLabel(data.whatsappButtonLabel)
        }
      } catch (error) {
        console.error('Error fetching whatsapp settings:', error)
      }
    }
    fetchSettings()
  }, [])

  if (!whatsappNumber) return null; // Don't show button if no number is configured.

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 overflow-hidden group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-2xl bg-green-400 animate-ping opacity-20" />

      <div className="relative flex items-center gap-2 px-4 py-3">
        <MessageCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          {whatsappButtonLabel || '¡Chatea con nosotros!'}
        </span>
      </div>
    </motion.a>
  )
}

