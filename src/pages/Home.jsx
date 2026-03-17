import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// --- ANIMACIONES (Arreglo definitivo del error stagger) ---
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  const [heroData, setHeroData] = useState(null);
  const [serviciosData, setServiciosData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar Hero
        const heroRef = doc(db, 'ajustes_home', 'hero');
        const heroSnap = await getDoc(heroRef);
        
        if (heroSnap.exists()) {
          setHeroData(heroSnap.data());
        } else {
          setHeroData({
            titulo: "El personal de confianza que tu hogar merece",
            subtitulo: "Conectamos a familias y empresas bolivianas con el mejor personal doméstico y empresarial. Verificado, legal y con garantía.",
            imagenUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80"
          });
        }

        // Cargar Servicios
        const servRef = doc(db, 'ajustes_home', 'servicios');
        const servSnap = await getDoc(servRef);
        
        if (servSnap.exists()) {
          const data = servSnap.data();
          if (Array.isArray(data.lista)) {
            setServiciosData(data.lista);
          }
        } else {
          // Defaults si no hay en DB
          setServiciosData([
            { id: 'hogar', titulo: 'Gestión Hogar', descripcion: 'El personal ideal para el cuidado de tu familia y el mantenimiento de tu hogar.', botonTexto: 'Solicitar Personal' },
            { id: 'empresa', titulo: 'Gestión Empresa', descripcion: 'Soluciones profesionales de limpieza, asistencia y personal especializado para tu oficina o negocio.', botonTexto: 'Solicitar Personal' }
          ]);
        }
      } catch (err) {
        console.error("Error al cargar datos desde Firestore:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !heroData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-2xl animate-pulse font-light mb-4">Cargando Empleâme...</div>
          <div className="text-sm text-gray-500">Optimizando la experiencia</div>
        </div>
      </div>
    );
  }

  const { titulo, subtitulo, imagenUrl } = heroData;

  return (
    <motion.div initial="initial" animate="animate" className="bg-white text-gray-900 min-h-screen">
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#fff5f7] to-white pt-20 lg:pt-0">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div variants={stagger} className="space-y-8 order-2 lg:order-1 text-left">
            {/* Columna Izquierda */}
            <div className="space-y-6">
              <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-full uppercase tracking-wide">
                ● Agencia disponible ahora
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-navy-950 leading-tight">
                {titulo}
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-gray-700 leading-relaxed max-w-xl">
                {subtitulo}
              </motion.p>
            </div>
            <motion.div variants={stagger} className="flex flex-wrap gap-4 mt-8">
              <Link to="/formularios" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1">
                Contratar Personal
              </Link>
              <Link to="/unete" className="px-8 py-4 bg-white border border-pink-200 text-navy-950 rounded-full font-bold hover:bg-pink-50 transition-all shadow-sm hover:-translate-y-1">
                Buscar Trabajo
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-3 mt-10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-[10px]">👤</div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px]">👤</div>
                <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[10px]">👤</div>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                ⭐⭐⭐⭐⭐ <span className="text-gray-900">+500 familias</span> confían en nosotros
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end h-full"
          >
            {/* Columna Derecha */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white w-full max-w-md aspect-[9/16] lg:aspect-auto lg:h-[650px]">
              <img 
                src={imagenUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80"} 
                alt="Personal de confianza" 
                className="w-full h-full object-cover rounded-2xl shadow-inner"
              />
              
              {/* Tarjeta Flotante: Calificación */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-6 right-6 bg-white p-4 shadow-xl rounded-2xl flex flex-col items-center gap-1 border border-pink-50"
              >
                <span className="text-xl font-bold text-navy-950">4.9</span>
                <div className="text-yellow-400 text-xs">⭐⭐⭐⭐⭐</div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Calificación</span>
              </motion.div>

              {/* Tarjeta Flotante: Verificación */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute bottom-10 left-6 bg-white p-4 shadow-xl rounded-2xl flex items-center gap-3 border border-pink-50"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-950">Personal 100%</p>
                  <p className="text-xs text-green-600 font-semibold">Verificado</p>
                </div>
              </motion.div>
            </div>
            
            {/* Decoraciones de fondo (Blops) */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 italic">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-around items-center gap-8 text-gray-500 font-medium text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xs shadow-sm">✓</div>
              <span>+1000 Talentos Verificados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xs shadow-sm">✓</div>
              <span>Garantía de Sustitución</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xs shadow-sm">✓</div>
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xs shadow-sm">✓</div>
              <span>Líderes en Bolivia</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-navy-950 text-center mb-16">
            Servicios a tu medida
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviciosData?.map((servicio) => {
              const isHogar = servicio.id === 'hogar';
              return (
                <div key={servicio.id} className="bg-white rounded-3xl shadow-sm p-10 flex flex-col items-center text-center space-y-6 hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 ${isHogar ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'} rounded-full flex items-center justify-center`}>
                    {isHogar ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-navy-950">{servicio.titulo}</h3>
                  
                  <p className="text-gray-600">
                    {servicio.descripcion}
                  </p>

                  <Link to={`/formularios#${servicio.id}`} className={`px-8 py-3 ${isHogar ? 'bg-pink-500 hover:bg-pink-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-full font-bold shadow-md transition-all hover:-translate-y-1`}>
                    {servicio.botonTexto}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl font-bold text-navy-950 mb-4">
              Talentos Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Personal verificado y capacitado listo para integrarse a tu hogar o empresa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Talent Card 1 - Ariana Ortiz */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col space-y-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-100">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" 
                      alt="Ariana Ortiz" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy-950">Ariana Ortiz</h4>
                    <p className="text-sm text-gray-500">Niñera / Babysitter</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                  ✓ Verificada
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📍</span> Santa Cruz
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🏠</span> Cama adentro
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🎂</span> 24 años
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">💼</span> 3 años de exp.
                </div>
              </div>

              <div className="py-2 px-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Teléfono:</span>
                <span className="text-sm font-semibold text-gray-900 blur-sm select-none">+591 760...</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="py-2 bg-pink-100 text-pink-600 text-sm font-bold rounded-xl hover:bg-pink-200 transition-colors">
                  Ver CV
                </button>
                <button className="py-2 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors shadow-sm">
                  Me interesa
                </button>
              </div>
            </div>
            {/* Talent Card 2 - Carlos Méndez */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col space-y-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-100">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" 
                      alt="Carlos Méndez" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy-950">Carlos Méndez</h4>
                    <p className="text-sm text-gray-500">Chofer / Mensajero</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                  ✓ Verificado
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📍</span> Santa Cruz
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🚗</span> Por horas
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🎂</span> 35 años
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">💼</span> 10 años de exp.
                </div>
              </div>

              <div className="py-2 px-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Teléfono:</span>
                <span className="text-sm font-semibold text-gray-900 blur-sm select-none">+591 765...</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="py-2 bg-pink-100 text-pink-600 text-sm font-bold rounded-xl hover:bg-pink-200 transition-colors">
                  Ver CV
                </button>
                <button className="py-2 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors shadow-sm">
                  Me interesa
                </button>
              </div>
            </div>

            {/* Talent Card 3 - María Luz */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col space-y-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-100">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" 
                      alt="María Luz" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy-950">María Luz</h4>
                    <p className="text-sm text-gray-500">Cocina Saludable</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                  ✓ Verificada
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📍</span> Cochabamba
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🍳</span> Mensual
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🎂</span> 42 años
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">💼</span> 15 años de exp.
                </div>
              </div>

              <div className="py-2 px-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Teléfono:</span>
                <span className="text-sm font-semibold text-gray-900 blur-sm select-none">+591 654...</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="py-2 bg-pink-100 text-pink-600 text-sm font-bold rounded-xl hover:bg-pink-200 transition-colors">
                  Ver CV
                </button>
                <button className="py-2 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors shadow-sm">
                  Me interesa
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-950 mb-4">Academia Empleâme</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Capacitamos a nuestro personal para garantizar la excelencia en cada servicio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Curso 1 - Primeros Auxilios */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md group hover:shadow-xl transition-all">
              <div className="h-56 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80" 
                  alt="Primeros Auxilios" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 space-y-4">
                <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                  Certificado Incluido
                </span>
                <h3 className="text-2xl font-bold text-navy-950">Primeros Auxilios para el Hogar</h3>
                <p className="text-gray-600">
                  Capacitación vital para reaccionar ante emergencias domésticas, garantizando la máxima seguridad para tu familia.
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all">
                  Ver detalles
                </button>
              </div>
            </div>

            {/* Curso 2 - Etiqueta y Protocolo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md group hover:shadow-xl transition-all">
              <div className="h-56 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&q=80" 
                  alt="Etiqueta y Protocolo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 space-y-4">
                <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                  Curso Premium
                </span>
                <h3 className="text-2xl font-bold text-navy-950">Etiqueta, Protocolo y Servicio</h3>
                <p className="text-gray-600">
                  Excelencia en el trato al cliente, modales y organización profesional para personal de alto nivel.
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-navy-950 mb-4">Tu tranquilidad en 3 simples pasos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un proceso transparente diseñado para tu seguridad y la de tu familia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            {/* Paso 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-serif font-bold text-pink-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-4">Elige tu perfil</h3>
              <p className="text-gray-600">
                Explora nuestra base de talentos verificados y selecciona los que mejor se adapten a tu hogar.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-serif font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-4">Entrevista y verifica</h3>
              <p className="text-gray-600">
                Coordina una cita y revisa sus certificaciones de la Academia Empleâme con total transparencia.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-serif font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-4">Contrata con seguridad</h3>
              <p className="text-gray-600">
                Finaliza el proceso con el respaldo de nuestra garantía de sustitución y soporte constante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero CTA Finale */}
      <section className="pb-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto bg-navy-900 rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              ¿Listo para encontrar el <br className="hidden md:block" /> personal ideal?
            </h2>
            <p className="text-blue-100/80 text-lg mb-12 max-w-xl mx-auto">
              Únete a las cientos de familias que ya confían en Empleâme para gestionar su personal de confianza.
            </p>
            <button className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1 active:scale-95">
              Comenzar Ahora
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home; 