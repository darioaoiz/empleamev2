import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Loader2, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update display name
      await updateProfile(user, { displayName: nombre });

      // 3. Create document in Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        email,
        esMiembro: false,
        createdAt: serverTimestamp(),
      });

      // Redirect to home or a welcome page
      navigate('/');
    } catch (err) {
      console.error(err);
      let mensajeError = 'Hubo un error al crear la cuenta. Verifica tus datos e inténtalo de nuevo.';
      
      if (err.code === 'auth/email-already-in-use') {
        mensajeError = 'Este correo electrónico ya está registrado. Intenta iniciar sesión.';
      } else if (err.code === 'auth/weak-password') {
        mensajeError = 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        mensajeError = 'El formato del correo electrónico no es válido.';
      }
      
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-soft-lg border border-pink-100"
      >
        <div>
          <h2 className="text-center text-3xl font-black text-navy-600">
            Únete a Empleame
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Regístrate para solicitar servicios de manera rápida y segura
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <label className="sr-only" htmlFor="nombre">Nombre Completo</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-shadow"
                placeholder="Nombre Completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="email">Correo Electrónico</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-shadow"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="password">Contraseña</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-shadow"
                placeholder="Contraseña (mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-pink-600 hover:text-pink-500 transition-colors">
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
