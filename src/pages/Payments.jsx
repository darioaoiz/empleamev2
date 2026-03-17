import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ZoomIn, X, CreditCard } from 'lucide-react'

// ── Bank Info ─────────────────────────────────────────────────────────────────
const banks = [
  {
    id: 'bcp',
    name: 'Banco de Crédito BCP',
    logo: '🏦',
    color: 'from-blue-600 to-blue-800',
    lightColor: 'from-blue-50 to-blue-100',
    accent: 'blue',
    titular: 'Roxana Hurtado',
    ci: '4730251 SC',
    cuenta: '70151022335399',
    tipo: 'Cuenta de Ahorro',
    moneda: 'Bolivianos (Bs)',
    qr: null, // set real QR image URL when available
  },
]

// Account field component
function AccountField({ label, value }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-navy-950 mt-0.5 font-mono">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
          copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 hover:bg-pink-100 text-gray-500 hover:text-pink-600'
        }`}
        title="Copiar"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

// ── Bank Card Component ───────────────────────────────────────────────────────
function BankCard({ bank }) {
  const [qrOpen, setQrOpen] = useState(false)

  return (
    <>
      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Card Header */}
        <div className={`bg-gradient-to-br ${bank.color} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Datos de Pago</p>
                <h3 className="text-lg font-black mt-0.5">{bank.name}</h3>
              </div>
              <span className="text-4xl">{bank.logo}</span>
            </div>
            <div>
              <p className="text-white/60 text-xs">N° de Cuenta</p>
              <p className="text-2xl font-mono font-bold tracking-wider mt-0.5">
                {bank.cuenta.replace(/(\d{4})(?=\d)/g, '$1 ')}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs">Titular</p>
                <p className="text-sm font-semibold">{bank.titular}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Tipo</p>
                <p className="text-sm font-semibold">{bank.tipo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5">
          <div className="space-y-0 divide-y divide-gray-50">
            <AccountField label="Nombre completo del Titular" value={bank.titular} />
            <AccountField label="Número de cuenta" value={bank.cuenta} />
            <AccountField label="Cédula de Identidad" value={bank.ci} />
            <AccountField label="Tipo de cuenta" value={bank.tipo} />
            <AccountField label="Moneda" value={bank.moneda} />
          </div>

          {/* QR Code */}
          <div className="mt-4 pt-4 border-t border-pink-100">
            <button
              onClick={() => setQrOpen(true)}
              className="flex items-center gap-2 w-full justify-center px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-2xl text-sm font-semibold transition-colors border border-pink-100"
            >
              <ZoomIn className="w-4 h-4" />
              Ver Código QR para pago
            </button>
          </div>
        </div>
      </motion.div>

      {/* QR Modal */}
      <AnimatePresence>
        {qrOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy-600/50 backdrop-blur-sm"
              onClick={() => setQrOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl shadow-soft-lg p-8 max-w-sm w-full text-center"
            >
              <button
                onClick={() => setQrOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-navy-950 mb-2">{bank.name}</h3>
              <p className="text-sm text-gray-500 mb-6">Escanea para transferir</p>
              
              {bank.qr ? (
                <img src={bank.qr} alt="QR de pago" className="w-56 h-56 mx-auto rounded-2xl border border-gray-100" />
              ) : (
                <div className="w-56 h-56 mx-auto rounded-2xl bg-gradient-to-br from-pink-50 to-mauve-100 border-2 border-dashed border-pink-200 flex flex-col items-center justify-center">
                  <CreditCard className="w-12 h-12 text-pink-300 mb-2" />
                  <p className="text-xs text-gray-400 font-medium">QR próximamente</p>
                  <p className="text-xs text-gray-300 mt-1">Usa la transferencia bancaria</p>
                </div>
              )}
              
              <div className="mt-6 bg-pink-50 rounded-2xl p-4 border border-pink-100">
                <p className="text-xs text-gray-500 mb-1">Cuenta destino</p>
                <p className="font-mono font-bold text-navy-950">{bank.cuenta}</p>
                <p className="text-xs text-gray-400 mt-1">{bank.titular}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Main Payments Page ─────────────────────────────────────────────────────────
export default function Payments() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-50 to-mauve-100/50 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-white text-pink-600 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 shadow-card border border-pink-100">
              Pagos y Transferencias
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-navy-950 mb-4">
              Información de Pago
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Realiza tu pago de forma segura. Copia el número de cuenta y envía tu comprobante por WhatsApp.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Banks Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banks.map((bank) => (
            <BankCard key={bank.id} bank={bank} />
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          className="mt-10 card p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-bold text-navy-950 mb-4 flex items-center gap-2">
            <span className="text-xl">📋</span> Instrucciones de pago
          </h3>
          <ol className="space-y-3">
            {[
              'Realiza la transferencia al número de cuenta indicado.',
              'Guarda el comprobante de pago (captura de pantalla).',
              'Envía el comprobante por WhatsApp al +591 68669000.',
              'Indica tu nombre completo y el servicio contratado.',
              'Recibirás confirmación en máximo 2 horas hábiles.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="w-6 h-6 bg-gradient-brand text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-6 pt-4 border-t border-pink-100">
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                '¡Hola! Acabo de realizar un pago y quiero enviar mi comprobante.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold transition-all shadow-md"
            >
              📱 Enviar comprobante por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
