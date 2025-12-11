'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, Mail, Phone, CreditCard, MapPin, 
  Lock, ShieldCheck, ArrowLeft, ChevronDown, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { Poppins } from 'next/font/google';

// Configuración de fuente
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

// Lista de Localidades
const LOCALIDADES = [
  { id: 1, nombre: "Usaquén" }, { id: 2, nombre: "Chapinero" }, { id: 3, nombre: "Santa Fe" },
  { id: 4, nombre: "San Cristóbal" }, { id: 5, nombre: "Usme" }, { id: 6, nombre: "Tunjuelito" },
  { id: 7, nombre: "Bosa" }, { id: 8, nombre: "Kennedy" }, { id: 9, nombre: "Fontibón" },
  { id: 10, nombre: "Engativá" }, { id: 11, nombre: "Suba" }, { id: 12, nombre: "Barrios Unidos" },
  { id: 13, nombre: "Teusaquillo" }, { id: 14, nombre: "Los Mártires" }, { id: 15, nombre: "Antonio Nariño" },
  { id: 16, nombre: "Puente Aranda" }, { id: 17, nombre: "La Candelaria" }, { id: 18, nombre: "Rafael Uribe Uribe" },
  { id: 19, nombre: "Ciudad Bolívar" }, { id: 20, nombre: "Sumapaz" }
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    documentNumber: '',
    locality: '', 
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_AUTH_URL || 'http://tu-api.com';

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          documentNumber: formData.documentNumber,
          locality: Number(formData.locality),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      setMessage({ text: 'Registro exitoso. Redirigiendo...', type: 'success' });
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (error: any) {
      setMessage({ text: error.message || 'Ocurrió un error inesperado', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full relative flex items-center justify-center bg-[#002244] overflow-x-hidden ${poppins.className}`}>
      
      {/* --- FONDO DEGRADADO --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002244] via-[#003366] to-[#0a2e5c] -z-20" />
      
      {/* --- ELEMENTOS DECORATIVOS (Más sutiles y grandes para PC) --- */}
      <div className="fixed -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-20 blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[0px] -left-[100px] w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#004080] to-transparent opacity-15 blur-3xl -z-10 pointer-events-none" />

      {/* --- BOTÓN ATRÁS FLOTANTE --- */}
      <div className="absolute top-6 left-6 z-30">
        <button 
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium hidden md:inline">Volver al Login</span>
        </button>
      </div>

      {/* --- CONTENEDOR GRID PRINCIPAL --- */}
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-screen">

        {/* --- COLUMNA IZQUIERDA: BRANDING (Visible en Desktop) --- */}
        <div className="hidden lg:flex lg:col-span-5 flex-col text-white animate-fade-in-down pl-8">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 shadow-xl mb-8">
            <Image src="/assets/img/bot.png" alt="Logo" width={70} height={70} className="object-contain" />
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Únete a la <br />
            <span className="text-[#FFCC00]">Seguridad</span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-8 max-w-md">
            Crea tu cuenta en segundos y empieza a reportar novedades en tu localidad. Juntos hacemos una ciudad más segura.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="p-2 bg-green-500/20 rounded-full text-green-400"><CheckCircle2 size={18} /></div>
              <span>Registro rápido y sencillo</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="p-2 bg-blue-500/20 rounded-full text-blue-400"><ShieldCheck size={18} /></div>
              <span>Tus datos están protegidos</span>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO --- */}
        <div className="col-span-1 lg:col-span-7 w-full flex justify-center lg:justify-end">
          
          <div className="w-full max-w-[600px] bg-white/95 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-2xl relative">
            
            {/* Header Móvil (Solo visible en < LG) */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-slate-100 mb-3 shadow-inner">
                <Image src="/assets/img/bot.png" alt="Logo" width={50} height={50} className="object-contain" />
              </div>
              <h2 className="text-[#002244] font-bold text-2xl">Crear Cuenta</h2>
              <p className="text-slate-500 text-sm">Completa tus datos personales</p>
            </div>

            {/* Header Desktop (Dentro de la card) */}
            <h2 className="hidden lg:block text-[#002244] font-bold text-2xl mb-1">Formulario de Registro</h2>
            <p className="hidden lg:block text-slate-500 text-sm mb-8">Ingresa tus datos para darte de alta en el sistema.</p>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              
              {/* --- GRID DE INPUTS (2 Columnas en Desktop) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Nombre (Ancho completo) */}
                <div className="md:col-span-2 relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={20} /></div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre Completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Email (Ancho completo) */}
                <div className="md:col-span-2 relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={20} /></div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Celular */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={20} /></div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Celular"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Documento */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><CreditCard size={20} /></div>
                  <input
                    type="number"
                    name="documentNumber"
                    placeholder="No. Documento"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all placeholder:text-slate-400 remove-arrow"
                  />
                </div>

                {/* Localidad (Ancho completo en móvil, compartido en PC si quisieras, aquí lo dejo full para que se lea bien el texto) */}
                <div className="md:col-span-2 relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={20} /></div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={20} /></div>
                  <select
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-10 outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all appearance-none text-base invalid:text-slate-400"
                  >
                    <option value="" disabled>Seleccionar Localidad</option>
                    {LOCALIDADES.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Divider Seguridad */}
                <div className="md:col-span-2 pt-2">
                  <h3 className="text-[#004080] text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-2 mb-2">
                    Seguridad de la Cuenta
                  </h3>
                </div>

                {/* Password */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={20} /></div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Confirm Password */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><ShieldCheck size={20} /></div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repetir Contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all placeholder:text-slate-400"
                  />
                </div>

              </div>

              {/* Terms */}
              <div className="text-center md:text-left text-xs text-slate-500 mt-2 px-1">
                Al registrarte aceptas nuestra{' '}
                <a href="#" className="text-[#004080] font-bold hover:underline">Política de Privacidad</a>.
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FFCC00] to-[#ffdb4d] hover:to-[#ffc000] active:scale-[0.99] text-[#002244] font-extrabold text-base py-4 rounded-xl shadow-lg shadow-orange-500/20 mt-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
              </button>

              {/* Mensajes */}
              {message.text && (
                <div className={`p-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 ${
                  message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                }`}>
                  {message.type === 'error' && <AlertCircle size={16} />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Login Link */}
              <div className="mt-2 text-center text-sm text-slate-500">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-[#004080] font-bold hover:underline">
                  Iniciar Sesión
                </Link>
              </div>

            </form>
          </div>

          {/* Copyright Móvil */}
          <div className="lg:hidden mt-8 text-white/40 text-xs text-center">
            © 2025 Equipo de la Seguridad
          </div>

        </div>

      </div>
    </div>
  );
}