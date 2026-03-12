import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

// ── Default values ────────────────────────────────────────────────────────────
const DEFAULTS = {
  // Global / Contact
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '59168669000',
  whatsappMessage: '¡Hola! Me comunico desde la web de Empleame. Me gustaría obtener más información.',
  whatsappButtonLabel: '¡Chatea con nosotros!',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  linkedin: '',
  phone: '+591 68669000',
  email: 'hola@empleame.bo',
  address: 'Santa Cruz de la Sierra, Bolivia',
  // Hero section
  heroTitle: 'El personal de confianza que tu hogar merece',
  heroSubtitle: 'Conectamos a familias y empresas bolivianas con el mejor personal doméstico y empresarial. Verificado, legal y con garantía.',
  heroImageUrl: '',
}

const SettingsContext = createContext(DEFAULTS)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  // Track partial data from each doc so merges don't overwrite each other
  const globalData = useRef({})
  const heroData = useRef({})

  useEffect(() => {
    const merge = () =>
      setSettings({ ...DEFAULTS, ...globalData.current, ...heroData.current })

    const unsubGlobal = onSnapshot(
      doc(db, 'settings', 'global'),
      (snap) => {
        if (snap.exists()) { globalData.current = snap.data() }
        merge()
      },
      (err) => console.warn('SettingsContext/global:', err)
    )

    const unsubHero = onSnapshot(
      doc(db, 'settings', 'hero'),
      (snap) => {
        if (snap.exists()) { heroData.current = snap.data() }
        merge()
      },
      (err) => console.warn('SettingsContext/hero:', err)
    )

    return () => { unsubGlobal(); unsubHero() }
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

/** Convenience hook */
export function useSettings() {
  return useContext(SettingsContext)
}

