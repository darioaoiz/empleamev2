import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import Modal from '../components/ui/Modal'
import { Home, Building2, ChevronRight, Send, CheckCircle } from 'lucide-react'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

// ── Form Definitions ──────────────────────────────────────────────────────────
const hogarForms = [
  {
    id: 'empleada',
    emoji: '🏠',
    title: 'Empleada Doméstica',
    desc: 'Limpieza y organización del hogar',
    gradient: 'from-pink-100 to-rose-100',
    fields: [
      { name: 'nombre', label: 'Nombre Completo', type: 'text', required: true },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { name: 'ciudad', label: 'Ciudad', type: 'select', options: ['Santa Cruz', 'La Paz', 'Cochabamba'] },
      { name: 'modalidad', label: 'Modalidad', type: 'select', options: ['Cama adentro', 'Cama afuera', 'Por horas'] },
      { name: 'horario', label: 'Horario preferido', type: 'text', placeholder: 'Ej: Lunes a Viernes 8am-5pm' },
      { name: 'personas', label: 'N° de personas en el hogar', type: 'number' },
      { name: 'mascotas', label: 'Mascotas', type: 'select', options: ['No tengo', 'Perro', 'Gato', 'Otros'] },
      { name: 'referencia', label: 'Referencia / Observación', type: 'textarea' },
    ],
  },
  {
    id: 'ninjera',
    emoji: '👶',
    title: 'Niñera / Babysitter',
    desc: 'Cuidado especializado de niños',
    gradient: 'from-blue-50 to-cyan-100',
    fields: [
      { name: 'nombre', label: 'Nombre Completo', type: 'text', required: true },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { name: 'ciudad', label: 'Ciudad', type: 'select', options: ['Santa Cruz', 'La Paz', 'Cochabamba'] },
      { name: 'ninos', label: 'N° y edades de los niños', type: 'text', placeholder: 'Ej: 2 niños, 3 y 5 años' },
      { name: 'modalidad', label: 'Modalidad', type: 'select', options: ['Cama adentro', 'Cama afuera', 'Por horas'] },
      { name: 'horario', label: 'Horario', type: 'text' },
      { name: 'requisitos', label: 'Requisitos especiales', type: 'textarea' },
    ],
  },
  {
    id: 'cocinera',
    emoji: '🍳',
    title: 'Cocinera',
    desc: 'Preparación de alimentos y cocina',
    gradient: 'from-orange-50 to-yellow-100',
    fields: [
      { name: 'nombre', label: 'Nombre Completo', type: 'text', required: true },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { name: 'ciudad', label: 'Ciudad', type: 'select', options: ['Santa Cruz', 'La Paz', 'Cochabamba'] },
      { name: 'personas', label: 'N° de personas a alimentar', type: 'number' },
      { name: 'tipo_cocina', label: 'Tipo de cocina preferida', type: 'text', placeholder: 'Ej: Criolla, Internacional...' },
      { name: 'horario', label: 'Horario', type: 'text' },
      { name: 'dietas', label: 'Alergias o dietas especiales', type: 'textarea' },
    ],
  },
  {
    id: 'enfermera',
    emoji: '🏥',
    title: 'Enfermera / Cuidadora',
    desc: 'Atención para adultos mayores o pacientes',
    gradient: 'from-green-50 to-emerald-100',
    fields: [
      { name: 'nombre', label: 'Nombre del Contratante', type: 'text', required: true },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { name: 'ciudad', label: 'Ciudad', type: 'select', options: ['Santa Cruz', 'La Paz', 'Cochabamba'] },
      { name: 'paciente', label: 'Nombre del paciente', type: 'text' },
      { name: 'edad_paciente', label: 'Edad del paciente', type: 'number' },
      { name: 'condicion', label: 'Condición médica (general)', type: 'textarea' },
      { name: 'modalidad', label: 'Modalidad', type: 'select', options: ['Tiempo completo', 'Cama adentro', 'Turno día', 'Turno noche'] },
    ],
  },
  {
    id: 'jardinero',
    emoji: '🌿',
    title: 'Jardinero',
    desc: 'Mantenimiento de jardines y áreas verdes',
    gradient: 'from-lime-50 to-green-100',
    fields: [
      { name: 'nombre', label: 'Nombre Completo', type: 'text', required: true },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { name: 'ciudad', label: 'Ciudad', type: 'select', options: ['Santa Cruz', 'La Paz', 'Cochabamba'] },
      { name: 'frecuencia', label: 'Frecuencia', type: 'select', options: ['Semanal', 'Quincenal', 'Mensual'] },
      { name: 'tamano', label: 'Tamaño del jardín', type: 'select', options: ['Pequeño', 'Mediano', 'Grande'] },
      { name: 'detalles', label: 'Detalles adicionales', type: 'textarea' },
    ],
  },
]

const empresaForms = [
  {
    id: 'limpieza_emp',
    emoji: '🏢',
    title: 'Limpieza Empresarial',
    desc: 'Personal de limpieza para oficinas y locales',
    gradient: 'from-purple-50 to-violet-100',
    fields: [
      { name: 'empresa', label: 'Nombre de la Empresa', type: 'text', required: true },
      { name: 'contacto', label: 'Persona de Contacto', type: 'text', required: true },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { name: 'ciudad', label: 'Ciudad', type: 'select', options: ['Santa Cruz', 'La Paz', 'Cochabamba'] },
      { name: 'metros', label: 'Metros cuadrados aproximados', type: 'number' },
      { name: 'frecuencia', label: 'Frecuencia', type: 'select', options: ['Diario', 'Interdiario', 'Semanal'] },
      { name: 'personal', label: 'Cantidad de personal requerido', type: 'number' },
      { name: 'horario', label: 'Horario de limpieza', type: 'text' },
    ],
  },
  {
    id: 'asistente',
    emoji: '💼',
    title: 'Asistente de Oficina',
    desc: 'Personal administrativo y de apoyo',
    gradient: 'from-indigo-50 to-blue-100',
    fields: [
      { name: 'empresa', label: 'Nombre de la Empresa', type: 'text', required: true },
      { name: 'contacto', label: 'Persona de Contacto', type: 'text', required: true },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { name: 'ciudad', label: 'Ciudad', type: 'select', options: ['Santa Cruz', 'La Paz', 'Cochabamba'] },
      { name: 'funciones', label: 'Funciones requeridas', type: 'textarea' },
      { name: 'experiencia', label: 'Experiencia mínima requerida', type: 'text' },
      { name: 'horario', label: 'Horario', type: 'text' },
    ],
  },
  {
    id: 'mensajero',
    emoji: '🚀',
    title: 'Mensajería',
    desc: 'Mensajeros y ayudantes de entrega',
    gradient: 'from-amber-50 to-yellow-100',
    fields: [
      { name: 'empresa', label: 'Nombre de la Empresa', type: 'text', required: true },
      { name: 'contacto', label: 'Persona de Contacto', type: 'text', required: true },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { name: 'ciudad', label: 'Ciudad', type: 'select', options: ['Santa Cruz', 'La Paz', 'Cochabamba'] },
      { name: 'tipo', label: 'Tipo de mensajería', type: 'select', options: ['Motorizado', 'A pie', 'En vehículo'] },
      { name: 'zona', label: 'Zona de cobertura', type: 'text' },
      { name: 'horario', label: 'Horario', type: 'text' },
    ],
  },
]

// Helper to safely format fields
const formatFields = (fields) => {
  if (typeof fields === 'string') {
    try { return JSON.parse(fields) } catch { return [] }
  }
  return fields || []
}

// ── Dynamic Form Component ────────────────────────────────────────────────────
function DynamicForm({ formDef, onClose }) {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'solicitudes'), {
        tipo: formDef.title,
        categoria: formDef.id,
        datos: values,
        timestamp: serverTimestamp(),
        leido: false,
      })

      // Format WhatsApp message
      const lines = [
        `🌸 *Nueva Solicitud – ${formDef.title}*`,
        ``,
        ...Object.entries(values).map(([k, v]) => {
          const field = formDef.fields.find((f) => f.name === k)
          return `*${field?.label || k}:* ${v}`
        }),
        ``,
        `📅 ${new Date().toLocaleString('es-BO')}`,
      ]
      const msg = lines.join('\n')
      const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
      
      setSuccess(true)
      setTimeout(() => window.open(waUrl, '_blank'), 1500)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>
        <h3 className="text-xl font-bold text-navy-600 mb-2">¡Solicitud enviada!</h3>
        <p className="text-gray-500 text-sm">Te redirigiremos a WhatsApp para confirmar tu solicitud...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {formDef.fields.map((field) => (
        <div key={field.name}>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            {field.label} {field.required && <span className="text-pink-400">*</span>}
          </label>
          {field.type === 'select' ? (
            <select
              className="input-field"
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              className="input-field resize-none h-24"
              placeholder={field.placeholder || ''}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              className="input-field"
              placeholder={field.placeholder || ''}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
        </div>
      ))}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar Solicitud por WhatsApp
            </>
          )}
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">
          Tus datos se guardan de forma segura y serán enviados a nuestro equipo.
        </p>
      </div>
    </form>
  )
}

// ── Main Forms Page ───────────────────────────────────────────────────────────
export default function Forms() {
  const [activeTab, setActiveTab] = useState('hogar')
  const [selectedForm, setSelectedForm] = useState(null)
  
  const [dynamicForms, setDynamicForms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'formularios'), orderBy('orden', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setDynamicForms(snap.docs.map(d => ({ ...d.data(), id: d.id })))
      setLoading(false)
    }, (err) => {
      console.error(err)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Provide fallback to static arrays if Firestore is empty
  const allReadyForms = dynamicForms.length > 0 
    ? dynamicForms.map(f => ({ ...f, fields: formatFields(f.fields) }))
    : [...hogarForms, ...empresaForms]

  const currentForms = allReadyForms.filter(f => f.categoria === activeTab || (!f.categoria && (activeTab === 'hogar' ? hogarForms.find(h=>h.id===f.id) : empresaForms.find(e=>e.id===f.id))))

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-50 to-mauve-100/50 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl -translate-y-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-white text-pink-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 shadow-card border border-pink-100">
              Formularios
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-navy-600 mb-4">
              ¿Qué servicio necesitas?
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Completa el formulario correspondiente y nos pondremos en contacto contigo rápidamente.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="flex justify-center gap-3 mt-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setActiveTab('hogar')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'hogar'
                  ? 'bg-navy-600 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-100 shadow-card'
              }`}
            >
              <Home className="w-4 h-4" />
              Gestión Hogar
            </button>
            <button
              onClick={() => setActiveTab('empresa')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'empresa'
                  ? 'bg-navy-600 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-100 shadow-card'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Gestión Empresa
            </button>
          </motion.div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentForms.map((form, idx) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                onClick={() => setSelectedForm(form)}
                className="card cursor-pointer group hover:-translate-y-1 overflow-hidden"
              >
                {/* Cover */}
                <div className={`h-32 bg-gradient-to-br ${form.gradient || 'from-pink-100 to-rose-100'} flex items-center justify-center relative overflow-hidden`}>
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt={form.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{form.emoji || '📝'}</span>
                  )}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                </div>
                {/* Content */}
                <div className="p-5 bg-white relative">
                  <h3 className="font-bold text-navy-600 mb-1">{form.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{form.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400 font-medium">{form.fields?.length || 0} campos</span>
                    <span className="flex items-center gap-1 text-pink-500 text-sm font-semibold group-hover:gap-2 transition-all">
                      Solicitar <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={!!selectedForm}
        onClose={() => setSelectedForm(null)}
        title={selectedForm ? `${selectedForm.emoji} ${selectedForm.title}` : ''}
        size="md"
      >
        {selectedForm && (
          <DynamicForm formDef={selectedForm} onClose={() => setSelectedForm(null)} />
        )}
      </Modal>
    </div>
  )
}
