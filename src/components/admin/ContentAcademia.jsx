import React, { useState } from 'react';
import { Pencil, Trash2, Plus, BookOpen, Save, X, Video, PlayCircle } from 'lucide-react';

const MOCK_COURSES = [
  { id: 1, title: 'Niñera', description: 'Capacitación en cuidado infantil y estimulación.', duration: '2 horas', category: 'Cuidado Infantil', modules: [{ id: 1, title: 'Básico', url: 'https://youtu.be/test', order: 1 }] },
  { id: 2, title: 'Limpieza', description: 'Técnicas profesionales para limpieza profunda.', duration: '3 horas', category: 'Limpieza', modules: [] },
  { id: 3, title: 'Adulto Mayor', description: 'Atención y cuidado de adultos mayores.', duration: '3 horas', category: 'Adulto Mayor', modules: [] },
  { id: 4, title: 'Trabajadora de Hogar', description: 'Gestión eficiente de tareas del hogar.', duration: '2 horas', category: 'Gestión del Hogar', modules: [] }
];

export default function ContentAcademia() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  // Módulos locales para el curso que se está editando
  const [editingModules, setEditingModules] = useState([]);

  const handleEdit = (course) => {
    setCurrentCourse({ ...course });
    setEditingModules([...(course.modules || [])]);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este curso?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleAddCourse = () => {
    setCurrentCourse({ title: '', description: '', duration: '', category: '' });
    setEditingModules([]);
    setIsEditing(true);
  };

  const handleSaveCourse = () => {
    if (currentCourse.id) {
      setCourses(courses.map(c => c.id === currentCourse.id ? { ...currentCourse, modules: editingModules } : c));
    } else {
      setCourses([...courses, { ...currentCourse, id: Date.now(), modules: editingModules }]);
    }
    setIsEditing(false);
    setCurrentCourse(null);
  };

  const handleAddModule = () => {
    setEditingModules([...editingModules, { id: Date.now(), title: '', url: '', order: editingModules.length + 1 }]);
  };

  const handleUpdateModule = (id, field, value) => {
    setEditingModules(editingModules.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleRemoveModule = (id) => {
    setEditingModules(editingModules.filter(m => m.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-6xl mx-auto">
      
      {!isEditing ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Gestión de Academia
            </h2>
            <button
              onClick={handleAddCourse}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Añadir Curso
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700 border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 font-bold text-navy-950">Curso</th>
                  <th className="px-6 py-4 font-bold text-navy-950">Categoría</th>
                  <th className="px-6 py-4 font-bold text-navy-950">Duración</th>
                  <th className="px-6 py-4 font-bold text-center text-navy-950">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-navy-950">{course.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{course.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">
                      {course.duration}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 bg-pink-50 text-pink-500 hover:bg-pink-100 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No hay cursos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* FORMULARIO DE EDICIÓN / CREACIÓN */
        <div>
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-600" />
              {currentCourse.id ? 'Editar Curso' : 'Nuevo Curso'}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Título del Curso</label>
              <input
                type="text"
                value={currentCourse.title}
                onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow"
                placeholder="Ej. Niñera Profesional"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
              <input
                type="text"
                value={currentCourse.category}
                onChange={(e) => setCurrentCourse({ ...currentCourse, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow"
                placeholder="Ej. Cuidado Infantil"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
              <textarea
                value={currentCourse.description}
                onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow resize-none"
                rows="3"
                placeholder="Breve descripción del curso..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Duración</label>
              <input
                type="text"
                value={currentCourse.duration}
                onChange={(e) => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow"
                placeholder="Ej. 2 horas"
              />
            </div>
          </div>

          {/* GESTIÓN DE MÓDULOS / VIDEOS */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                Módulos del Curso
              </h3>
              <button
                onClick={handleAddModule}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir Módulo
              </button>
            </div>

            <div className="space-y-4">
              {editingModules.length === 0 ? (
                <div className="p-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center text-gray-500 text-sm">
                  No hay módulos agregados. Haz clic en "Añadir Módulo" para empezar.
                </div>
              ) : (
                editingModules.map((modulo, index) => (
                  <div key={modulo.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center relative group">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
                      <div className="md:col-span-5">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Título del Módulo</label>
                        <input
                          type="text"
                          value={modulo.title}
                          onChange={(e) => handleUpdateModule(modulo.id, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow text-sm"
                          placeholder="Ej. Introducción"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label className="block text-xs font-bold text-gray-500 mb-1">URL del Video (YouTube/Vimeo)</label>
                        <input
                          type="url"
                          value={modulo.url}
                          onChange={(e) => handleUpdateModule(modulo.id, 'url', e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Orden</label>
                        <input
                          type="number"
                          value={modulo.order}
                          onChange={(e) => handleUpdateModule(modulo.id, 'order', e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow text-sm"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveModule(modulo.id)}
                      className="absolute top-2 right-2 md:static p-2 text-gray-400 hover:text-pink-500 bg-gray-50 hover:bg-pink-50 rounded-lg transition-colors"
                      title="Eliminar módulo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCourse}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Guardar Curso
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
