import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { Play, ChevronRight, CheckCircle, Lock, BookOpen, Award } from 'lucide-react'

// ── Demo Academy Data ─────────────────────────────────────────────────────────
const demoModules = [
  {
    id: 1,
    title: 'Módulo 1: Fundamentos del Hogar Profesional',
    icon: '🏠',
    lessons: [
      { id: 'L1-1', title: 'Bienvenida al Programa', duration: '5 min', videoId: 'dQw4w9WgXcQ', free: true },
      { id: 'L1-2', title: 'Organización y Limpieza Eficiente', duration: '12 min', videoId: 'dQw4w9WgXcQ', free: true },
      { id: 'L1-3', title: 'Productos de Limpieza Seguros', duration: '10 min', videoId: 'dQw4w9WgXcQ', free: false },
      { id: 'L1-4', title: 'Técnicas de Planchado', duration: '8 min', videoId: 'dQw4w9WgXcQ', free: false },
    ],
  },
  {
    id: 2,
    title: 'Módulo 2: Cuidado de Niños',
    icon: '👶',
    lessons: [
      { id: 'L2-1', title: 'Desarrollo infantil por etapas', duration: '15 min', videoId: 'dQw4w9WgXcQ', free: true },
      { id: 'L2-2', title: 'Actividades educativas y lúdicas', duration: '12 min', videoId: 'dQw4w9WgXcQ', free: false },
      { id: 'L2-3', title: 'Primeros auxilios básicos para niños', duration: '20 min', videoId: 'dQw4w9WgXcQ', free: false },
    ],
  },
  {
    id: 3,
    title: 'Módulo 3: Cocina y Nutrición',
    icon: '🍳',
    lessons: [
      { id: 'L3-1', title: 'Bases de la nutrición saludable', duration: '10 min', videoId: 'dQw4w9WgXcQ', free: true },
      { id: 'L3-2', title: 'Menús semanales equilibrados', duration: '14 min', videoId: 'dQw4w9WgXcQ', free: false },
      { id: 'L3-3', title: 'Higiene en la cocina', duration: '8 min', videoId: 'dQw4w9WgXcQ', free: false },
    ],
  },
  {
    id: 4,
    title: 'Módulo 4: Relaciones Laborales y Derechos',
    icon: '📋',
    lessons: [
      { id: 'L4-1', title: 'Contrato de trabajo y derechos laborales', duration: '18 min', videoId: 'dQw4w9WgXcQ', free: true },
      { id: 'L4-2', title: 'Comunicación efectiva con el empleador', duration: '12 min', videoId: 'dQw4w9WgXcQ', free: false },
      { id: 'L4-3', title: 'Resolución de conflictos', duration: '10 min', videoId: 'dQw4w9WgXcQ', free: false },
    ],
  },
]

export default function Academy() {
  const [modules, setModules] = useState(demoModules)
  const [activeLesson, setActiveLesson] = useState(demoModules[0].lessons[0])
  const [activeModule, setActiveModule] = useState(demoModules[0])
  const [expandedModules, setExpandedModules] = useState([1])
  const [completed, setCompleted] = useState([])

  // Load from Firestore
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'academia'))
        if (!snap.empty) {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          if (data.length > 0) setModules(data)
        }
      } catch (e) { /* use demo */ }
    }
    load()
  }, [])

  const toggleModule = (id) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const markComplete = (lessonId) => {
    setCompleted((prev) => prev.includes(lessonId) ? prev : [...prev, lessonId])
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const progress = Math.round((completed.length / totalLessons) * 100)

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-50 to-mauve-100/50 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-white text-pink-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 shadow-card border border-pink-100">
              Academia Empleame
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-navy-600 mb-4">
              Capacítate y mejora tus ingresos
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-6">
              Cursos gratuitos y de pago diseñados para el personal del hogar.
            </p>
            {/* Progress bar */}
            <div className="max-w-sm mx-auto">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-pink-400" /> Mi progreso</span>
                <span className="font-bold text-navy-600">{progress}% completado</span>
              </div>
              <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-brand rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <motion.div
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Video embed */}
              <div className="relative aspect-video bg-navy-700">
                <iframe
                  key={activeLesson.id}
                  src={`https://www.youtube.com/embed/${activeLesson.videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              {/* Lesson info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-pink-500 font-semibold uppercase tracking-widest mb-1">
                      {activeModule.icon} {activeModule.title}
                    </p>
                    <h2 className="text-xl font-bold text-navy-600">{activeLesson.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{activeLesson.duration}</p>
                  </div>
                  <button
                    onClick={() => markComplete(activeLesson.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                      completed.includes(activeLesson.id)
                        ? 'bg-green-100 text-green-600 border border-green-200'
                        : 'btn-pink'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {completed.includes(activeLesson.id) ? 'Completado' : 'Marcar completo'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Playlist */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-pink-500" />
              <h3 className="font-bold text-navy-600 text-sm">Contenido del Curso</h3>
              <span className="ml-auto text-xs text-gray-400">{totalLessons} lecciones</span>
            </div>

            {modules.map((mod) => (
              <motion.div
                key={mod.id}
                className="card overflow-hidden"
                layout
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-pink-50/50 transition-colors"
                >
                  <span className="text-xl">{mod.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-600 truncate">{mod.title}</p>
                    <p className="text-xs text-gray-400">{mod.lessons.length} lecciones</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    expandedModules.includes(mod.id) ? 'rotate-90' : ''
                  }`} />
                </button>

                {/* Lessons */}
                <AnimatePresence>
                  {expandedModules.includes(mod.id) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-pink-100/50"
                    >
                      {mod.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => { setActiveLesson(lesson); setActiveModule(mod) }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            activeLesson.id === lesson.id
                              ? 'bg-pink-50 border-l-2 border-pink-400'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            completed.includes(lesson.id)
                              ? 'bg-green-100'
                              : activeLesson.id === lesson.id
                              ? 'bg-pink-100'
                              : 'bg-gray-100'
                          }`}>
                            {completed.includes(lesson.id) ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : !lesson.free ? (
                              <Lock className="w-3 h-3 text-gray-400" />
                            ) : (
                              <Play className="w-3 h-3 text-pink-500 ml-0.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">{lesson.title}</p>
                            <p className="text-[10px] text-gray-400">{lesson.duration}</p>
                          </div>
                          {!lesson.free && (
                            <span className="text-[10px] font-semibold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full flex-shrink-0">PRO</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
