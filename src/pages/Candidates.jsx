import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, getDocs, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import Modal from '../components/ui/Modal'
import { Search, Filter, MessageCircle, FileText, ShieldCheck, MapPin, Clock, Star, Loader2, RefreshCw } from 'lucide-react'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

// ── Filter constants ──────────────────────────────────────────────────────────
const cities = ['Todas las ciudades', 'Santa Cruz', 'La Paz', 'Cochabamba']
const modalities = ['Todas las modalidades', 'Cama adentro', 'Cama afuera', 'Por horas']
const ALL_SPECIALTIES = 'Todas las especialidades'

// ── Candidate Card ────────────────────────────────────────────────────────────
function CandidateCard({ candidate, onViewCV, onInterest }) {
  // Use ui-avatars as an automatic fallback whenever the photo URL fails to load
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.nombre)}&background=F2B8CE&color=1E3A5F&size=300&font-size=0.4&bold=true`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="card overflow-hidden group hover:-translate-y-1"
    >
      {/* Photo */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-pink-100 to-mauve-100">
          <img
            src={candidate.fotoUrl || fallbackAvatar}
            alt={candidate.nombre}
            className={`w-full h-full object-cover object-top transition-transform duration-500 ${
              candidate.estado === 'Contratada' ? 'opacity-60 grayscale-[50%]' : 'group-hover:scale-105'
            }`}
            onError={(e) => { e.currentTarget.src = fallbackAvatar }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {candidate.estado === 'Contratada' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-600/90 text-white text-xs rounded-full font-bold shadow-sm backdrop-blur-md border border-pink-400/50">
                <ShieldCheck className="w-3.5 h-3.5" /> Contratada
              </span>
            ) : (
              <span className="badge-verified text-xs">
                <ShieldCheck className="w-3 h-3" /> Verificada
              </span>
            )}
          <span className="text-xs font-bold text-white bg-navy-600/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
            #{String(candidate.id).slice(-6).toUpperCase()}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 -mt-4 relative">
        <h3 className="font-bold text-navy-600 text-base leading-tight">{candidate.nombre}</h3>
        <p className="text-pink-500 text-sm font-medium mt-0.5">{candidate.especialidad}</p>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>{candidate.ciudad} · {candidate.modalidad}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>{candidate.edad} años · {candidate.experiencia} años de experiencia</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mt-3 line-clamp-2">{candidate.resumen}</p>

        <div className="flex gap-0.5 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewCV(candidate)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-xl text-xs font-semibold transition-colors border border-pink-100"
          >
            <FileText className="w-3.5 h-3.5" />
            Ver Hoja de Vida
          </button>
          <button
            onClick={() => onInterest(candidate)}
            disabled={candidate.estado === 'Contratada'}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              candidate.estado === 'Contratada'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {candidate.estado === 'Contratada' ? (
              <>No disponible</>
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5" />
                Me interesa
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── CV Viewer Modal ───────────────────────────────────────────────────────────
function CVModal({ candidate }) {
  if (!candidate) return null

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.nombre)}&background=F2B8CE&color=1E3A5F&size=300&font-size=0.4&bold=true`
  const activeCvLink = candidate.cvPdfUrl || candidate.cvExternalLink

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="p-4 bg-pink-50 border-b border-pink-100 flex-shrink-0">
        <p className="text-sm text-gray-600">
          Hoja de vida de <strong className="text-navy-600">{candidate.nombre}</strong>
        </p>
      </div>

      {/* If a real PDF is stored (Firebase URL), embed it directly */}
      {activeCvLink && activeCvLink.startsWith('http') ? (
        <div className="flex-1 flex flex-col">
          <iframe
            src={activeCvLink}
            title="Hoja de Vida"
            className="flex-1 w-full"
            style={{ minHeight: '500px' }}
          />
          <div className="p-4 border-t border-pink-100 flex-shrink-0">
            <a
              href={activeCvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-navy-600 hover:bg-navy-700 text-white rounded-2xl text-sm font-bold transition-all hover:shadow-soft"
            >
              <FileText className="w-4 h-4" />
              Abrir Currículum en pestaña nueva ↗
            </a>
          </div>
        </div>
      ) : (
        /* Profile card fallback */
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center px-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 bg-pink-100 flex-shrink-0">
            <img
              src={candidate.fotoUrl || fallbackAvatar}
              alt={candidate.nombre}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = fallbackAvatar }}
            />
          </div>
          <h3 className="text-xl font-black text-navy-600 mb-1">{candidate.nombre}</h3>
          <p className="text-pink-500 font-semibold mb-1">{candidate.especialidad}</p>
          <p className="text-gray-400 text-sm mb-6">{candidate.ciudad} · {candidate.modalidad}</p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-4">
            {[
              { label: 'Edad', value: `${candidate.edad} años` },
              { label: 'Experiencia', value: `${candidate.experiencia} años` },
              { label: 'Modalidad', value: candidate.modalidad },
              { label: 'Ciudad', value: candidate.ciudad },
            ].map((item) => (
              <div key={item.label} className="bg-pink-50 rounded-xl p-3 text-center border border-pink-100">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-bold text-navy-600 text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{candidate.resumen}</p>

          <div className="mt-4 badge-verified text-sm px-4 py-2">
            <ShieldCheck className="w-4 h-4" /> Candidata Verificada por Empleame
          </div>

          {/* PDF button — disabled state when no PDF */}
          <div className="mt-5 w-full max-w-xs">
            <button
              disabled
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-gray-100 text-gray-400 rounded-2xl text-sm font-semibold cursor-not-allowed"
              title="Sin currículum cargado aún"
            >
              <FileText className="w-4 h-4" />
              Sin Currículum disponible
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Loading Skeleton Card ─────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-52 bg-pink-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-pink-100 rounded-lg w-3/4" />
        <div className="h-3 bg-pink-50 rounded-lg w-1/2" />
        <div className="h-3 bg-gray-100 rounded-lg w-full" />
        <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="h-9 bg-pink-100 rounded-xl" />
          <div className="h-9 bg-green-100 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [city, setCity] = useState('Todas las ciudades')
  const [modality, setModality] = useState('Todas las modalidades')
  const [specialty, setSpecialty] = useState(ALL_SPECIALTIES)
  const [cvCandidate, setCvCandidate] = useState(null)

  // Derive unique specialties from live data for the dropdown
  const specialtyOptions = [
    ALL_SPECIALTIES,
    ...Array.from(new Set(candidates.map((c) => c.especialidad).filter(Boolean))).sort(),
  ]

  // ── Live Firestore listener (auto-updates on external changes) ────────────
  useEffect(() => {
    setLoading(true)
    setError(null)

    const q = query(collection(db, 'candidatas'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setCandidates(data)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setError('No se pudo conectar con la base de datos. Intenta nuevamente.')
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  // ── Client-side filter ────────────────────────────────────────────────────
  useEffect(() => {
    let result = candidates
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.nombre?.toLowerCase().includes(q) ||
          c.especialidad?.toLowerCase().includes(q)
      )
    }
    if (city !== 'Todas las ciudades') result = result.filter((c) => c.ciudad === city)
    if (modality !== 'Todas las modalidades') result = result.filter((c) => c.modalidad === modality)
    if (specialty !== ALL_SPECIALTIES) result = result.filter((c) => c.especialidad === specialty)
    setFiltered(result)
  }, [search, city, modality, specialty, candidates])

  const handleInterest = async (candidate) => {
    const interesadoNombre = prompt('Por favor, ingresa tu nombre:');
    if (!interesadoNombre) return; // User cancelled

    const interesadoTelefono = prompt('Por favor, ingresa tu número de teléfono:');
    if (!interesadoTelefono) return; // User cancelled

    const msg = `Hola Empleame, mi nombre es ${interesadoNombre} y me interesa la candidata ${candidate.nombre}. Mi teléfono es ${interesadoTelefono}.`;
    const whatsappUrl = `https://wa.me/59168669000?text=${encodeURIComponent(msg)}`;

    // Open window immediately before async call to bypass Safari popup blockers
    window.open(whatsappUrl, '_blank');

    try {
      // Save to Firestore
      await addDoc(collection(db, 'solicitudes'), {
        interesadoNombre,
        interesadoTelefono,
        candidataNombre: candidate.nombre,
        candidataId: candidate.id,
        fechaSolicitud: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving solicitud:', error);
      // We can fail silently here or just log it, as requested by the user to avoid confusing technical alerts.
    }
  }

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Re-mount will re-trigger the snapshot listener
    window.location.reload()
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-pink-50 to-mauve-100/50 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-white text-pink-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 shadow-card border border-pink-100">
              Catálogo de Talentos
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-navy-600 mb-4">
              Encuentra tu candidata ideal
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Todas nuestras postulantes están verificadas y listas para integrarse a tu hogar.
            </p>
          </motion.div>

          {/* Search + Filters */}
          <motion.div
            className="bg-white rounded-3xl shadow-soft-lg p-4 md:p-6 max-w-4xl mx-auto border border-pink-100/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o especialidad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <select className="input-field pl-9 text-sm" value={city} onChange={(e) => setCity(e.target.value)}>
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <select className="input-field text-sm" value={modality} onChange={(e) => setModality(e.target.value)}>
                {modalities.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select className="input-field text-sm" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                {specialtyOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">

        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">⚠️</p>
            <h3 className="text-xl font-bold text-navy-600 mb-2">Error de conexión</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">{error}</p>
            <button onClick={handleRetry} className="btn-primary">
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
          </div>
        )}

        {/* Loading state */}
        {!error && loading && (
          <>
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando postulantes desde Firestore...
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {/* Results */}
        {!error && !loading && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                <strong className="text-navy-600">{filtered.length}</strong> postulante{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
              </p>
              {candidates.length === 0 && (
                <span className="text-xs text-gray-400 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                  Aún no hay candidatos en la base de datos
                </span>
              )}
            </div>

            {candidates.length === 0 ? (
              /* Empty Firestore — show a helpful message */
              <div className="text-center py-24">
                <p className="text-6xl mb-5">👩‍💼</p>
                <h3 className="text-2xl font-black text-navy-600 mb-3">Catálogo en preparación</h3>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Pronto publicaremos los perfiles de nuestras candidatas verificadas.<br />
                  ¿Tienes urgencia? Contáctanos directamente.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('¡Hola! Necesito ayuda para encontrar personal del hogar.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar por WhatsApp
                </a>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-xl font-bold text-navy-600 mb-2">Sin resultados</h3>
                <p className="text-gray-500">Intenta cambiar los filtros de búsqueda.</p>
                <button
                  onClick={() => { setSearch(''); setCity('Todas las ciudades'); setModality('Todas las modalidades'); setSpecialty(ALL_SPECIALTIES) }}
                  className="mt-4 text-pink-500 hover:text-pink-700 text-sm font-semibold underline"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filtered.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onViewCV={setCvCandidate}
                      onInterest={handleInterest}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* ── CV Modal ─────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!cvCandidate}
        onClose={() => setCvCandidate(null)}
        title={cvCandidate ? `Hoja de Vida – ${cvCandidate.nombre}` : ''}
        size="lg"
      >
        <CVModal candidate={cvCandidate} />
      </Modal>
    </div>
  )
}
