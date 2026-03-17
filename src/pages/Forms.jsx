import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp, query, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Modal from '../components/ui/Modal'
import { Home, Building2, ChevronRight, Send, CheckCircle, Layout } from 'lucide-react'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

// ── Form Definitions ──────────────────────────────────────────────────────────
const hogarForms = [
  {
    id: 'empleada',
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
function DynamicForm({ formDef, category }) {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [waUrl, setWaUrl] = useState('')

  // Determine fields to use (Preguntas dinámicas del admin o Fields estáticos)
  let dynamicFields = (formDef.preguntas && formDef.preguntas.length > 0) 
    ? [...formDef.preguntas] 
    : [...(formDef.fields || [])];

  // Enforce mandatory fields: Nombre and Teléfono
  const hasNombre = dynamicFields.some(f => (f.label || f.name || '').toLowerCase().includes('nombre'));
  const hasTelefono = dynamicFields.some(f => (f.label || f.name || '').toLowerCase().includes('telé') || (f.label || f.name || '').toLowerCase().includes('telef') || (f.label || f.name || '').toLowerCase().includes('celular'));

  if (!hasTelefono) {
    dynamicFields.unshift({ id: 'base_tel', label: 'Teléfono de Contacto', type: 'tel', required: true });
  }
  if (!hasNombre) {
    dynamicFields.unshift({ id: 'base_name', label: 'Nombre Completo', type: 'text', required: true });
  }

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Format WhatsApp message
    const lines = [
      `${category === 'hogar' ? '🌸' : '🏢'} *Nueva Solicitud – ${formDef.title}*`,
      ``,
      ...dynamicFields.map((f) => {
        const val = values[f.label || f.name] || 'No proporcionado';
        return `*${f.label || f.name}:* ${val}`;
      }),
      ``,
      `📅 ${new Date().toLocaleString('es-BO')}`,
    ]
    const msg = lines.join('\n')
    const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`

    try {
      // Guardar en Firestore (Nueva colección solicitudes_servicios)
      await addDoc(collection(db, 'solicitudes_servicios'), {
        servicio: formDef.title,
        categoria: category,
        respuestas: values,
        timestamp: serverTimestamp(),
        clienteSubnombre: values['Nombre Completo'] || values['nombre'] || '',
        clienteSubtel: values['Teléfono de Contacto'] || values['teléfono'] || values['telefono'] || values['celular'] || '',
        leido: false,
      })
      
      setWaUrl(waUrl)
      setSuccess(true)
      setTimeout(() => {
        const win = window.open(waUrl, '_blank');
        if (!win) {
          console.warn("Popup blocked or failed to open automatically.");
        }
      }, 1500)
    } catch (err) {
      console.error("Error guardando solicitud:", err)
      // Si falla Firestore, igual abrimos WhatsApp para no perder el cliente
      setWaUrl(waUrl)
      setSuccess(true)
      window.open(waUrl, '_blank')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-10 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-black text-navy-950 mb-3 tracking-normal uppercase">¡Recibido con éxito!</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">Estamos abriendo WhatsApp para que podamos coordinar los detalles finales...</p>
        
        {waUrl && (
          <a 
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-widest hover:underline"
          >
            Si no se abre automáticamente, haz clic aquí
            <ChevronRight className="w-4 h-4" />
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* Banner del Formulario */}
      {formDef.formImagenUrl && (
        <div className="h-40 w-full overflow-hidden mb-2 relative">
          <img src={formDef.formImagenUrl} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
        <div className="grid grid-cols-1 gap-4">
          {dynamicFields.map((field) => (
            <div key={field.id || field.name} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-2 ml-1">
                {field.imageUrl && <img src={field.imageUrl} className="w-6 h-6 object-contain" alt="icon" />}
                <label className="block text-xs font-black text-navy-950/40 uppercase tracking-widest">
                  {field.label || field.name} {field.required && <span className="text-pink-500">*</span>}
                </label>
              </div>
              
              {field.type === 'select' ? (
                <div className="space-y-2">
                  {field.options && field.options.length > 0 ? (
                    field.options.some(o => o.imageUrl) ? (
                      /* OPCIONES VISUALES (CARDS CON IMAGEN) */
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {field.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleChange(field.label || field.name, opt.label)}
                            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center group ${values[field.label || field.name] === opt.label ? (category === 'hogar' ? 'border-pink-500 bg-pink-50' : 'border-blue-500 bg-blue-50') : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                              {opt.imageUrl ? <img src={opt.imageUrl} className="w-full h-full object-cover" /> : <CheckCircle className="w-4 h-4 text-gray-200" />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-tight ${values[field.label || field.name] === opt.label ? (category === 'hogar' ? 'text-pink-600' : 'text-blue-600') : 'text-gray-500'}`}>
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* BOTONES DE SELECCIÓN SIMPLE */
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleChange(field.label || field.name, opt.label)}
                            className={`px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all ${values[field.label || field.name] === opt.label ? (category === 'hogar' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-blue-500 bg-blue-50 text-blue-600') : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )
                  ) : (
                    <select
                      className="input-field bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-medium"
                      value={values[field.label || field.name] || ''}
                      onChange={(e) => handleChange(field.label || field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Seleccionar opción...</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                  )}
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  className="input-field bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-medium resize-none min-h-[100px]"
                  placeholder="Escribe aquí los detalles..."
                  value={values[field.label || field.name] || ''}
                  onChange={(e) => handleChange(field.label || field.name, e.target.value)}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  className="input-field bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-medium"
                  placeholder={`Ingrese ${field.label || field.name}...`}
                  value={values[field.label || field.name] || ''}
                  onChange={(e) => handleChange(field.label || field.name, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="group bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black rounded-2xl transition-all shadow-xl shadow-green-100 w-full flex justify-center py-4 text-base disabled:opacity-60 gap-3 items-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                CONFIRMAR POR WHATSAPP
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Main Forms Page ───────────────────────────────────────────────────────────
export default function Forms() {
  const [activeTab, setActiveTab] = useState('hogar')
  const [selectedForm, setSelectedForm] = useState(null)
  
  const [dynamicForms, setDynamicForms] = useState([])
  const [pageData, setPageData] = useState({
    mainTitle: '¿Qué servicio necesitas?',
    mainSubtitle: 'Completa el formulario correspondiente y nos pondremos en contacto contigo rápidamente.',
    hogarWelcome: 'Bienvenido a la sección de Hogar. Encuentra el personal ideal para tu familia.',
    empresaWelcome: 'Bienvenido a la sección de Empresa. Soluciones profesionales para tu negocio.'
  })
  const [loading, setLoading] = useState(true)
  const [loadingTexts, setLoadingTexts] = useState(true)

  useEffect(() => {
    // 1. Detect category from hash
    const hash = window.location.hash.replace('#', '')
    if (hash === 'hogar' || hash === 'empresa') {
      setActiveTab(hash)
    }

    // 2. Load page texts from Firebase
    const fetchPageData = async () => {
      try {
        setLoadingTexts(true);
        const docRef = doc(db, 'ajustes_formularios', 'textos');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPageData({
            mainTitle: data?.mainTitle || '¿Qué servicio necesitas?',
            mainSubtitle: data?.mainSubtitle || 'Completa el formulario correspondiente y nos pondremos en contacto contigo rápidamente.',
            hogarWelcome: data?.hogarWelcome || 'Bienvenido a la sección de Hogar. Encuentra el personal ideal para tu familia.',
            empresaWelcome: data?.empresaWelcome || 'Bienvenido a la sección de Empresa. Soluciones profesionales para tu negocio.'
          });
        }
      } catch (err) {
        console.error("Error loading forms page data:", err);
      } finally {
        setLoadingTexts(false);
      }
    }

    // 3. Load dynamic items (cards)
    const q = query(collection(db, 'items_formularios'))
    const unsub = onSnapshot(q, (snap) => {
      setDynamicForms(snap.docs.map(d => ({ ...d.data(), id: d.id })))
      setLoading(false)
    }, (err) => {
      console.error(err)
      setLoading(false)
    })

    fetchPageData();
    return () => unsub()
  }, [])

  if (loading || loadingTexts) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-navy-950/10 border-t-pink-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Provide fallback: Use Firebase items if they exist, otherwise use static arrays
  const allReadyForms = (dynamicForms && dynamicForms.length > 0)
    ? dynamicForms.map(item => {
        const staticMatch = [...hogarForms, ...empresaForms].find(s => 
          s.title?.toLowerCase() === item.titulo?.toLowerCase() || s.id === item.id
        );
        return {
          ...item,
          title: item.titulo || 'Servicio Sin Nombre',
          fields: staticMatch ? staticMatch.fields : (item.fields ? formatFields(item.fields) : []),
          preguntas: item.preguntas || (staticMatch ? staticMatch.fields : []),
          gradient: staticMatch ? staticMatch.gradient : (item.categoria === 'hogar' ? 'from-pink-100 to-rose-100' : 'from-blue-100 to-indigo-100')
        }
      })
    : [...hogarForms, ...empresaForms];

  const currentForms = (allReadyForms || []).filter(f => f?.categoria === activeTab);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className={`bg-gradient-to-br ${activeTab === 'hogar' ? 'from-pink-50 to-rose-100/30' : 'from-blue-50 to-indigo-100/30'} pt-12 pb-16 relative overflow-hidden transition-colors duration-500`}>
        <div className={`absolute top-0 right-0 w-64 h-64 ${activeTab === 'hogar' ? 'bg-pink-200/20' : 'bg-blue-200/20'} rounded-full blur-3xl -translate-y-1/4 transition-colors duration-500`} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeTab + "-header"}
          >
            <span className={`inline-block px-3 py-1 bg-white ${activeTab === 'hogar' ? 'text-pink-600 border-pink-100' : 'text-blue-600 border-blue-100'} rounded-full text-xs font-semibold tracking-widest uppercase mb-4 shadow-card border transition-colors`}>
              Formularios
            </span>
            <h1 className={`text-4xl md:text-5xl font-black mb-4 transition-colors ${activeTab === 'hogar' ? 'text-pink-500' : 'text-blue-600'}`}>
              {pageData?.mainTitle || 'Nuestros Servicios'}
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto italic mb-4">
              {activeTab === 'hogar' ? pageData?.hogarWelcome : pageData?.empresaWelcome}
            </p>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              {pageData?.mainSubtitle}
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
                  ? 'bg-pink-500 text-white shadow-lg scale-105'
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
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-blue-100 shadow-card'
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
                {/* Cover with Image First */}
                <div className="aspect-[1200/630] bg-gray-100 relative overflow-hidden">
                  {form.imagenUrl ? (
                    <img 
                      src={form.imagenUrl} 
                      alt={form.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${form.gradient || 'from-gray-100 to-gray-200'} flex items-center justify-center opacity-30`}>
                      <Layout className="w-12 h-12 text-navy-950" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/20 transition-colors duration-300" />
                </div>
                {/* Content */}
                <div className="p-5 bg-white relative">
                  <h3 className={`font-bold mb-1 transition-colors ${activeTab === 'hogar' ? 'text-pink-500' : 'text-blue-600'}`}>{form.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{form.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                      {(form.preguntas?.length || form.fields?.length || 0)} pasos
                    </span>
                    <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-md group-hover:shadow-lg ${activeTab === 'hogar' ? 'bg-pink-500 shadow-pink-100 active:bg-pink-600' : 'bg-blue-600 shadow-blue-100 active:bg-blue-700'}`}>
                      Solicitar <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
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
        title={selectedForm ? selectedForm.title : ''}
        size="md"
      >
        {selectedForm && (
          <DynamicForm 
            formDef={selectedForm} 
            category={activeTab}
            onClose={() => setSelectedForm(null)} 
          />
        )}
      </Modal>
    </div>
  )
}
