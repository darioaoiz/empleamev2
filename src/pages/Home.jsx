import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, FileText, RefreshCcw, ChevronLeft, ChevronRight,
  Star, Quote, ArrowRight, Users, Briefcase, Heart
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

// ── Hero Images (provided by user) ──────────────────────────────────────────
const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
]

// ── Differentiators ──────────────────────────────────────────────────────────
const differentiators = [
  {
    icon: ShieldCheck,
    title: 'Personal Verificado',
    desc: 'Cada candidata pasa por un riguroso proceso de selección, antecedentes y referencias personales.',
    color: 'from-pink-100 to-pink-200',
    iconColor: 'text-pink-500',
  },
  {
    icon: FileText,
    title: 'Contrato Legal',
    desc: 'Trabajamos con contratos formales que protegen tanto al empleador como al personal contratado.',
    color: 'from-mauve-100 to-mauve-200',
    iconColor: 'text-mauve-500',
  },
  {
    icon: RefreshCcw,
    title: 'Garantía de Sustitución',
    desc: 'Si el personal no cumple tus expectativas en los primeros 30 días, hacemos la sustitución sin costo.',
    color: 'from-blue-50 to-blue-100',
    iconColor: 'text-blue-500',
  },
]

// ── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'María González',
    role: 'Madre de familia · Santa Cruz',
    text: 'Encontré a la mejor persona para cuidar a mis hijos. El proceso fue rápido, transparente y el personal es increíble. ¡100% recomendado!',
    stars: 5,
    avatar: 'MG',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Empresario · Santa Cruz',
    text: 'Contratamos personal de limpieza para nuestra empresa y el servicio superó todas las expectativas. Profesionalismo total.',
    stars: 5,
    avatar: 'CR',
  },
  {
    name: 'Ana Belén Torres',
    role: 'Ama de casa · La Paz',
    text: 'La garantía de sustitución me dio mucha confianza. Todo el proceso fue fácil y el personal está perfectamente capacitado.',
    stars: 5,
    avatar: 'AB',
  },
  {
    name: 'Roberto Méndez',
    role: 'Padre de familia · Cochabamba',
    text: 'Excelente agencia. La empleada que nos enviaron es puntual, honesta y muy trabajadora. Gracias Empleame!',
    stars: 5,
    avatar: 'RM',
  },
]

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: '500+', label: 'Familias Satisfechas', icon: Heart },
  { value: '300+', label: 'Postulantes Verificadas', icon: Users },
  { value: '5 años', label: 'De Experiencia', icon: Briefcase },
  { value: '98%', label: 'Tasa de Satisfacción', icon: ShieldCheck },
]

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export default function Home() {
  const { heroImageUrl } = useSettings()
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [localHeroImage, setLocalHeroImage] = useState('')
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, 'contenido_inicio', 'hero')
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data()
          if (data.titulo_hero) setHeroTitle(data.titulo_hero)
          if (data.subtitulo_hero) setHeroSubtitle(data.subtitulo_hero)
          if (data.heroImageUrl) setLocalHeroImage(data.heroImageUrl)
        }
      } catch (error) {
        console.error('Error fetching hero data:', error)
      }
    }
    fetchHeroData()
  }, [])

  useEffect(() => {
    if (!autoplay) return
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoplay])

  const nextTestimonial = () => {
    setAutoplay(false)
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setAutoplay(false)
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 hero-bg overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-mauve-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">
            {/* Left: Text */}
            <motion.div
              className="relative z-10 py-12 lg:py-20"
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-card border border-pink-100 mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-gray-600">Agencia disponible ahora</span>
              </motion.div>

              {/* Title */}
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-600 leading-[1.1] mb-6">
                {heroTitle || (
                  <>
                    El personal{' '}
                    <span className="relative">
                      <span className="text-gradient">de confianza</span>
                      <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                        <path d="M0 4 Q100 8 200 4" stroke="#F2B8CE" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </span>
                    {' '}que tu hogar merece
                  </>
                )}
              </motion.h1>

              <motion.p variants={fadeUp} className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
                {heroSubtitle || (
                  <>Conectamos a familias y empresas bolivianas con el mejor personal doméstico y empresarial.{' '}
                  <strong className="text-navy-600">Verificado, legal y con garantía.</strong></>
                )}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link to="/formularios" className="btn-primary text-base px-8 py-4">
                  <Heart className="w-5 h-5" />
                  Contratar Personal
                </Link>
                <Link to="/postulantes" className="btn-secondary text-base px-8 py-4">
                  <Briefcase className="w-5 h-5" />
                  Buscar Trabajo
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['MG','CR','AB','RM'].map((initials, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${
                      ['bg-pink-400','bg-mauve-400','bg-blue-400','bg-purple-400'][i]
                    }`}>
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_,i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">+500 familias confían en nosotros</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Main image card */}
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-soft-lg">
                  <img
                    src={localHeroImage || heroImageUrl || '/images/hero1.jpg'}
                    alt="Personal doméstico profesional de Empleame"
                    className="w-full h-[520px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-600/20 to-transparent" />
                </div>

                {/* Floating stats card */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-soft-lg p-4 z-20 border border-pink-100"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Personal</p>
                      <p className="text-sm font-bold text-navy-600">100% Verificado</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating score card */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-soft-lg p-3 z-20 border border-pink-100"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <div className="text-center">
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_,i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-lg font-black text-navy-600">4.9</p>
                    <p className="text-[10px] text-gray-400">Calificación</p>
                  </div>
                </motion.div>

                {/* Deco circles */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-pink-200/40 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-mauve-200/30 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-12 fill-white">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center p-6 rounded-2xl bg-gradient-pink border border-pink-100/50"
              >
                <stat.icon className="w-6 h-6 text-pink-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-navy-600 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ──────────────────────────────────────────────────── */}
      <section className="bg-white pb-20 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
              ¿Por qué elegirnos?
            </span>
            <h2 className="section-title mb-4">Todo lo que necesitas,<br />en un solo lugar</h2>
            <p className="section-subtitle mx-auto text-center">
              Trabajamos con estándares profesionales para garantizarte la mejor experiencia.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {differentiators.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="card p-8 text-center group hover:-translate-y-1"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-navy-600 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT / FOUNDER ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-mauve-100/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-mauve-200/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-soft-lg">
                  <img
                    src="/images/founder.jpg"
                    alt="Roxana Hurtado – Fundadora de Empleame"
                    className="w-full h-[480px] object-cover object-center"
                    onError={(e) => {
                      e.target.src = '/images/hero2.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-600/30 to-transparent" />
                </div>
                {/* Founder badge */}
                <div className="absolute -bottom-5 left-6 bg-white rounded-2xl shadow-soft-lg px-5 py-3 border border-pink-100">
                  <p className="text-xs text-gray-500">Fundadora & Directora</p>
                  <p className="font-bold text-navy-600">Roxana Hurtado</p>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
                Nuestra Historia
              </span>
              <h2 className="section-title mb-6">
                Una agencia con<br />
                <span className="text-gradient">corazón y propósito</span>
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  Hola, soy <strong className="text-navy-600">Roxana Hurtado</strong>, y fundé Empleame con una misión clara: 
                  crear puentes de confianza entre familias que necesitan ayuda y personas trabajadoras que buscan una oportunidad digna.
                </p>
                <p>
                  Entiendo lo difícil que es dejar tu hogar y tus hijos en manos de alguien desconocido. 
                  Por eso, cada persona que forma parte de nuestra red pasa por un proceso de verificación riguroso 
                  y personalizado. <strong className="text-navy-600">Tu tranquilidad es nuestra prioridad.</strong>
                </p>
                <p>
                  Operamos desde Santa Cruz de la Sierra, con cobertura en La Paz y Cochabamba, 
                  llevando más de 5 años conectando personas y transformando hogares.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/formularios" className="btn-pink">
                  Comenzar ahora <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES QUICK VIEW ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
              Nuestros Servicios
            </span>
            <h2 className="section-title mb-4">¿Qué necesitas hoy?</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { emoji: '🏠', title: 'Empleada Doméstica', desc: 'Organización y limpieza del hogar con profesionalismo.' },
              { emoji: '👶', title: 'Niñera / Babysitter', desc: 'Cuidado amoroso y responsable de tus pequeños.' },
              { emoji: '🍳', title: 'Cocinera', desc: 'Preparación de alimentos nutritivos y deliciosos.' },
              { emoji: '🏥', title: 'Enfermera / Cuidadora', desc: 'Atención especializada para adultos mayores.' },
              { emoji: '🌿', title: 'Jardinero', desc: 'Mantenimiento y cuidado de jardines y áreas verdes.' },
              { emoji: '🏢', title: 'Personal Empresarial', desc: 'Limpieza y asistencia para tu negocio u oficina.' },
            ].map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                className="card p-6 group hover:-translate-y-1 cursor-pointer"
                onClick={() => window.location.href = '/formularios'}
              >
                <div className="text-3xl mb-4">{service.emoji}</div>
                <h3 className="font-bold text-navy-600 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.desc}</p>
                <span className="text-pink-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Solicitar ahora <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-navy-600 to-navy-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-mauve-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
              Testimonios
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Lo que dicen nuestras familias
            </h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/20"
              >
                <Quote className="w-10 h-10 text-pink-300/40 mb-4" />
                <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center text-white font-bold">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white">{testimonials[currentTestimonial].name}</p>
                      <p className="text-pink-300/70 text-sm">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonials[currentTestimonial].stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setAutoplay(false); setCurrentTestimonial(i) }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentTestimonial ? 'w-6 bg-pink-400' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="bg-gradient-brand rounded-3xl px-8 py-12 md:py-16 shadow-soft-lg relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                ¿Listo para encontrar al personal ideal?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Completa nuestro formulario en minutos y te conectamos con el candidato perfecto.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/formularios" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-600 font-bold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Contratar Personal
                </Link>
                <Link to="/postulantes" className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all">
                  Ver Postulantes
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
