import { Link } from 'react-router-dom'
import { Instagram, Facebook, Linkedin, Phone, Mail, MapPin, Shield } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const footerLinks = {
  servicios: [
    { label: 'Contratar Personal', to: '/formularios' },
    { label: 'Ver Postulantes', to: '/postulantes' },
    { label: 'Academia', to: '/academia' },
    { label: 'Pagos', to: '/pagos' },
    { label: 'Únete al Equipo', to: '/unete' },
  ],
}

export default function Footer() {
  const { instagram, facebook, linkedin, phone, email, address, whatsappNumber } = useSettings()

  return (
    <footer className="bg-navy-600 text-white">
      {/* Wave divider */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 40" className="w-full h-10 fill-gray-50">
          <path d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-brand rounded-2xl flex items-center justify-center">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <div>
                <span className="font-black text-xl tracking-tight">
                  EMPLE<span className="text-pink-300">â</span>ME
                </span>
                <p className="text-[9px] font-semibold text-pink-300/70 tracking-widest uppercase mt-0.5">
                  Gestión Hogar · Empresa
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm mb-4">
              Conectamos familias y empresas con el personal de confianza que necesitan.{' '}
              Personal verificado, contrato legal y garantía de sustitución.
            </p>
            <div className="flex gap-3">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-pink-400/30 transition-colors" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-blue-400/30 transition-colors" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-sky-400/30 transition-colors" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {whatsappNumber && (
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-green-400/30 transition-colors" title="WhatsApp">
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-pink-300 mb-4">Servicios</h4>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-gray-300 text-sm hover:text-pink-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-pink-300 mb-4">Contacto</h4>
            <div className="space-y-2">
              {phone && (
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Phone className="w-3.5 h-3.5 text-pink-300 flex-shrink-0" />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Mail className="w-3.5 h-3.5 text-pink-300 flex-shrink-0" />
                  <span>{email}</span>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-2 text-gray-300 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-pink-300 flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Empleame. Todos los derechos reservados. Roxana Hurtado.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 text-xs hover:text-gray-300 transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-400 text-xs hover:text-gray-300 transition-colors">
              Términos
            </a>
            {/* Discrete admin shield */}
            <Link
              to="/admin"
              className="text-pink-500/40 hover:text-pink-400 transition-colors ml-4"
              title="Admin"
            >
              <Shield size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

