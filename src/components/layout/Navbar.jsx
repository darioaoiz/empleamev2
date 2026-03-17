import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Inicio', exact: true },
  { to: '/formularios', label: 'Formularios' },
  { label: 'Postulantes', isDropdown: true, subLinks: [
    { to: '/postulantes', label: 'Ver Postulantes' },
    { to: '/unete', label: 'Únete al Equipo' },
  ]},
  { to: '/academia', label: 'Academia' },
  { to: '/pagos', label: 'Pagos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-pink-100/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-300 rounded-full" />
            </div>
            <div className="leading-none">
              <span className="font-black text-xl text-blue-600 tracking-tight">
                EMPLE<span className="text-pink-500">â</span>ME
              </span>
              <p className="text-[9px] font-semibold text-gray-400 tracking-widest uppercase mt-0.5">
                Gestión Hogar · Empresa
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isDropdown ? (
                <div 
                  key={link.label}
                  className="relative group py-2"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-pink-500 transition-all">
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-pink-50 overflow-hidden z-50"
                      >
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className="block px-5 py-3 text-sm text-navy-950 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all duration-200 px-1 py-0.5 relative group ${
                      isActive ? 'text-pink-500 font-semibold' : 'text-gray-600 hover:text-pink-500'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-pink-400 rounded-full transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                    </>
                  )}
                </NavLink>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20 hover:-translate-y-0.5"
                >
                  Iniciar Sesión
                </Link>
                <button
                  onClick={() => navigate('/registro')}
                  className="flex flex-row items-center justify-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20 hover:-translate-y-0.5"
                >
                  <Heart className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>¡Hazte Miembro!</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-pink-500/20 hover:-translate-y-0.5"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-pink-50 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden bg-white/98 backdrop-blur-md border-t border-pink-100 shadow-soft-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                link.isDropdown ? (
                  <div key={link.label} className="space-y-1">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {link.label}
                    </div>
                    {link.subLinks.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive ? 'text-pink-500 bg-pink-50' : 'text-gray-600 hover:bg-gray-50'
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                        isActive
                          ? 'text-pink-500 font-semibold'
                          : 'text-gray-600 hover:text-pink-500'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <span className={`absolute bottom-2 left-4 h-0.5 bg-pink-400 rounded-full transition-all duration-300 ${
                          isActive ? 'w-8' : 'w-0'
                        }`} />
                      </>
                    )}
                  </NavLink>
                )
              ))}
              <div className="pt-4">
                {!currentUser ? (
                  <div className="flex flex-row items-center gap-4 px-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/20 text-xs font-bold rounded-xl transition-all whitespace-nowrap"
                    >
                      Iniciar Sesión
                    </Link>
                    <button
                      onClick={() => navigate('/registro')}
                      className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20 flex flex-row items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 flex-shrink-0" />
                      <span>¡Hazte Miembro!</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
