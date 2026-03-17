import React, { useState } from 'react';
import { Search, Sparkles, Baby, BookOpen, Clock, Star, PlayCircle, Heart, Home, ArrowLeft, Video, CheckCircle2, Play, Circle } from 'lucide-react';

const COURSES_DATA = [
  {
    id: 1,
    title: 'Niñera',
    description: 'Capacitación completa en cuidado infantil, estimulación temprana, rutinas diarias y prevención de accidentes para garantizar el bienestar de los más pequeños.',
    category: 'Cuidado Infantil',
    duration: '2 horas',
    rating: 4.9,
    price: 'Gratis',
    modules: [
      { id: 'm1', title: 'Módulo 1: Desarrollo Infantil y Estimulación', duration: '25 min' },
      { id: 'm2', title: 'Módulo 2: Nutrición y Alimentación Básica', duration: '20 min' },
      { id: 'm3', title: 'Módulo 3: Primeros Auxilios Pediátricos', duration: '30 min' },
      { id: 'm4', title: 'Módulo 4: Prevención de Accidentes en Casa', duration: '25 min' },
      { id: 'm5', title: 'Módulo 5: Ética Profesional y Trato con Familias', duration: '20 min' },
    ]
  },
  {
    id: 2,
    title: 'Cuidado de Adulto Mayor',
    description: 'Formación especializada en movilización, aseo, toma de signos vitales, y acompañamiento integral para mejorar la calidad de vida del paciente y su autonomía.',
    category: 'Adulto Mayor',
    duration: '3 horas',
    rating: 4.8,
    price: 'Gratis',
    modules: [
      { id: 'm1', title: 'Módulo 1: Introducción a la Geriatría', duration: '35 min' },
      { id: 'm2', title: 'Módulo 2: Movilización y Traslados Seguros', duration: '40 min' },
      { id: 'm3', title: 'Módulo 3: Higiene y Confort del Paciente', duration: '30 min' },
      { id: 'm4', title: 'Módulo 4: Toma de Signos Vitales Básicos', duration: '35 min' },
      { id: 'm5', title: 'Módulo 5: Acompañamiento Emocional', duration: '40 min' },
    ]
  },
  {
    id: 3,
    title: 'Trabajadora de Hogar',
    description: 'Domina los fundamentos de la organización, gestión eficiente del tiempo, cuidado de prendas delicadas y administración impecable de las tareas domésticas.',
    category: 'Gestión del Hogar',
    duration: '2 horas',
    rating: 4.9,
    price: 'Gratis',
    modules: [
      { id: 'm1', title: 'Módulo 1: Gestión Eficiente de Tareas Diarias', duration: '20 min' },
      { id: 'm2', title: 'Módulo 2: Tratamiento y Cuidados de Lavandería', duration: '30 min' },
      { id: 'm3', title: 'Módulo 3: Protocolo y Servicio en la Mesa', duration: '25 min' },
      { id: 'm4', title: 'Módulo 4: Organización Inteligente de Despensas', duration: '25 min' },
      { id: 'm5', title: 'Módulo 5: Etiqueta y Discreción Profesional', duration: '20 min' },
    ]
  },
  {
    id: 4,
    title: 'Limpieza',
    description: 'Técnicas profesionales para limpieza profunda, uso correcto de productos químicos, aseo de superficies específicas y rutinas para mantener espacios relucientes.',
    category: 'Limpieza',
    duration: '3 horas',
    rating: 4.8,
    price: 'Gratis',
    modules: [
      { id: 'm1', title: 'Módulo 1: Uso Correcto de Herramientas de Aseo', duration: '30 min' },
      { id: 'm2', title: 'Módulo 2: Manejo Seguro de Productos Químicos', duration: '45 min' },
      { id: 'm3', title: 'Módulo 3: Técnicas para Superficies Delicadas', duration: '35 min' },
      { id: 'm4', title: 'Módulo 4: Desinfección Profunda de Baños y Cocinas', duration: '40 min' },
      { id: 'm5', title: 'Módulo 5: Bioseguridad, Orden y Ventilación', duration: '30 min' },
    ]
  }
];

const CATEGORIES = [
  { name: 'Todos', icon: BookOpen },
  { name: 'Cuidado Infantil', icon: Baby },
  { name: 'Adulto Mayor', icon: Heart },
  { name: 'Gestión del Hogar', icon: Home },
  { name: 'Limpieza', icon: Sparkles },
];

export default function Academia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [leccionActiva, setLeccionActiva] = useState(null);

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getBentoClasses = (index) => {
    if (index === 0) return 'md:col-span-2 md:row-span-1 lg:row-span-2';
    if (index === 1) return 'md:col-span-1 md:row-span-2';
    return 'md:col-span-1 md:row-span-1';
  };

  const handleVerCurso = (course) => {
    setCursoSeleccionado(course);
    setLeccionActiva(course.modules[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVolverAtras = () => {
    setCursoSeleccionado(null);
    setLeccionActiva(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera, Buscador y Filtros (Visibles siempre) */}
        {!cursoSeleccionado && (
          <>
            <div className="mb-12 text-center md:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-navy-950 mb-4">
                Academia Empleâme
              </h1>
              <p className="text-gray-600 max-w-2xl text-lg mb-8">
                Capacitación gratuita para profesionales del hogar. Potencia tu perfil con nuestros cursos especializados certificados.
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-4 max-w-3xl">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-4 w-full border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-700 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Categorías */}
            <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.name;
                return (
                   <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap shadow-sm border ${
                        isActive
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:text-blue-600'
                      }`}
                   >
                     <Icon className="w-4 h-4" />
                     {cat.name}
                   </button>
                );
              })}
            </div>
          </>
        )}

        {/* --- VISTA: DETALLE DE MÓDULOS DE CURSO ESTILO SKOOL --- */}
        {cursoSeleccionado ? (
          <div>
            <button 
              onClick={handleVolverAtras}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-6 transition-colors group text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Área Principal (Video) - 70% Aproximado */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Contenedor del Video */}
                <div className="w-full aspect-video bg-navy-950 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-0" />
                  <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all z-10 cursor-pointer" />
                  <div className="absolute bottom-4 right-4 z-10">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg uppercase tracking-wide">
                      {leccionActiva?.duration}
                    </span>
                  </div>
                </div>
                
                {/* Información de la Lección Actual */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl uppercase tracking-wide">
                      Lección Actual
                    </span>
                    <span className="text-sm font-semibold text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {cursoSeleccionado.duration} en total
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-black text-navy-950 mb-4 tracking-tight">
                    {leccionActiva?.title}
                  </h2>
                  
                  <p className="text-gray-600 text-base leading-relaxed">
                    Aprende los conceptos clave de este módulo para mejorar tus habilidades en el área de {cursoSeleccionado.category.toLowerCase()}. Esta lección sienta las bases necesarias para progresar exitosamente en tu capacitación y asegurar un servicio de calidad premium.
                  </p>
                </div>

              </div>

              {/* Lista Lateral de Lecciones - 30% Aproximado */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-navy-950 mb-2 leading-tight">
                      {cursoSeleccionado.title}
                    </h3>
                    <div className="flex items-center gap-2 pb-5 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-500">{cursoSeleccionado.modules.length} lecciones</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                        <Star className="w-4 h-4 text-gray-400" /> {cursoSeleccionado.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {cursoSeleccionado.modules.map((mod) => {
                      const isActiva = leccionActiva?.id === mod.id;

                      return (
                        <button
                          key={mod.id}
                          onClick={() => setLeccionActiva(mod)}
                          className={`w-full flex items-start gap-3 p-3 text-left rounded-xl transition-all ${
                            isActiva 
                              ? 'bg-blue-50 border-l-4 border-blue-600 shadow-sm' 
                              : 'hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isActiva ? (
                              <Play className="w-5 h-5 text-blue-600 fill-blue-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          
                          <div className="flex-grow">
                            <h4 className={`text-sm font-bold leading-tight mb-1 ${isActiva ? 'text-blue-600' : 'text-navy-950'}`}>
                              {mod.title}
                            </h4>
                            <span className="text-xs font-semibold text-gray-400">
                              {mod.duration}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* --- VISTA NORMAL: BENTO GRID --- */
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-min">
              {filteredCourses.map((course, index) => {
                const isFeatured = index === 0;
                const isTall = index === 1;

                return (
                  <div 
                    key={course.id}
                    onClick={() => handleVerCurso(course)}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group cursor-pointer ${getBentoClasses(index)}`}
                  >
                    {/* Placeholder Gris / Decorativo Bento */}
                    <div className={`relative bg-slate-100 flex items-center justify-center flex-shrink-0 ${isFeatured ? 'h-56 md:h-72' : isTall ? 'h-48 md:h-[400px]' : 'h-48 md:h-56'}`}>
                      <PlayCircle className="w-16 h-16 text-slate-300 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-500" />
                      
                      {/* Badges Flotantes */}
                      <div className="absolute top-4 left-4 lg:top-6 lg:left-6 flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold rounded-xl shadow-sm uppercase tracking-wide border border-green-200/50">
                          {course.price}
                        </span>
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-navy-950 text-[10px] sm:text-xs font-bold rounded-xl shadow-sm uppercase tracking-wide">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          {course.rating.toFixed(1)}
                        </div>
                      </div>

                      <h3 className={`font-black text-navy-950 mb-3 line-clamp-2 ${isFeatured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}`}>
                        {course.title}
                      </h3>
                      
                      <p className={`text-gray-500 mb-8 flex-grow ${isFeatured ? 'text-base md:text-lg line-clamp-3 md:line-clamp-4' : 'text-sm line-clamp-3'}`}>
                        {course.description}
                      </p>

                      <div className="mt-auto">
                        <button className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 group-hover:bg-blue-700">
                          Ver contenido del curso
                          <PlayCircle className="w-5 h-5 opacity-80" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm mt-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-navy-950 mb-2">No se encontraron cursos</h3>
                <p className="text-gray-500">
                  Intenta con otra búsqueda o selecciona una categoría diferente.
                </p>
                <button 
                  onClick={() => { setSearchTerm(''); setActiveCategory('Todos'); }}
                  className="mt-6 px-8 py-3 bg-gray-100 text-navy-950 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Ver todos los cursos
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
