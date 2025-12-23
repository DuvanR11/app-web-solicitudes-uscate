'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';
import { Poppins } from 'next/font/google';
import api from '../lib/api'; // <--- Usamos tu instancia configurada de Axios
import { useAuthStore } from '../store/auth-store';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state: any) => state.setAuth); // <--- Hook del Store

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // Usamos api.post en lugar de fetch para aprovechar la configuración base
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });

      // NestJS devuelve: { access_token: "...", user: { ... } }
      const { access_token, user } = response.data;

      // 1. Guardar en Zustand (Estado Global)
      setAuth(access_token, user);

      // 2. Guardar en Cookies (Para Middleware / Persistencia extra)
      Cookies.set('auth-token', access_token, { expires: 7 }); 
      // Opcional: Cookies.set('user-role', user.role, { expires: 7 });

      // 3. Redireccionar según el rol (Opcional, por ahora todos al dashboard)
      if (user.role === 'CITIZEN') {
          router.push('/'); 
      } else {
        const msg = 'No cuenta con los permisos para crear reportes';
        setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
      }

    } catch (error: any) {
      console.error('❌ Error login:', error);
      // Capturamos el mensaje de error del backend si existe
      const msg = error.response?.data?.message || 'Credenciales incorrectas o error de conexión.';
      // Si es un array (validación de NestJS), tomamos el primero
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full relative flex items-center justify-center bg-[#002244] overflow-hidden ${poppins.className}`}>
      
      {/* --- FONDO DEGRADADO --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002244] via-[#003366] to-[#0a2e5c] z-0" />
      
      {/* Decoración */}
      <div className="absolute -top-[50px] -right-[50px] md:-top-[100px] md:-right-[100px] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-20 z-0 pointer-events-none blur-2xl" />
      <div className="absolute -bottom-[20px] -left-[50px] md:-bottom-[100px] md:-left-[100px] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-t from-[#004080] to-transparent opacity-20 z-0 pointer-events-none blur-2xl" />

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="relative z-10 w-full container max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full min-h-[inherit]">

        {/* --- COLUMNA IZQUIERDA: BRANDING --- */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left animate-fade-in-down">
          
          <div className="inline-block p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl mb-6 md:mb-8">
            <Image 
              src="/assets/img/bot.png" // Asegúrate que esta ruta exista
              alt="Logo" 
              width={100} 
              height={100} 
              className="drop-shadow-lg object-contain w-20 h-20 md:w-28 md:h-28"
            />
          </div>
          
          <h1 className="text-white font-extrabold text-3xl md:text-5xl tracking-tight leading-tight mb-2 md:mb-4">
            Equipo de la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC00] to-[#ffd633]">
              Seguridad
            </span>
          </h1>
          
          <p className="text-[#aabbd1] text-sm md:text-lg font-medium max-w-md mx-auto md:mx-0">
            Gestiona reportes, coordina respuestas y mantén segura a tu comunidad desde nuestra plataforma integral.
          </p>

          <div className="hidden md:flex gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-white/80 text-sm">
              <ShieldCheck size={18} className="text-[#FFCC00]" />
              <span>Datos Encriptados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-white/80 text-sm">
              <AlertCircle size={18} className="text-[#FFCC00]" />
              <span>Reportes 24/7</span>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO --- */}
        <div className="w-full flex justify-center md:justify-end">
          
          <div className="w-full max-w-[380px] md:max-w-[420px] bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FFCC00] to-[#e6b800]" />

            <h2 className="text-[#002244] font-bold text-xl md:text-2xl mb-1 text-center md:text-left">Bienvenido de nuevo</h2>
            <p className="text-slate-500 text-sm mb-6 text-center md:text-left">Ingresa tus credenciales para acceder.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004080] transition-colors">
                  <Mail size={22} />
                </div>
                <input
                  type="email"
                  placeholder="Correo Institucional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#004080] focus:bg-white focus:ring-4 focus:ring-[#004080]/10 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004080] transition-colors">
                  <Lock size={22} />
                </div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#f4f7fa] border border-slate-200 text-[#002244] font-semibold rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#004080] focus:bg-white focus:ring-4 focus:ring-[#004080]/10 transition-all placeholder:text-slate-400"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-3 bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium animate-pulse border border-red-100">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FFCC00] to-[#ffdb4d] hover:to-[#ffc000] active:scale-[0.98] text-[#002244] font-extrabold text-base py-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5 text-[#002244]" />
                    Validando...
                  </span>
                ) : (
                  <>
                    INGRESAR
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="mt-2 text-center">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />
                <p className="text-slate-500 text-sm mb-2">¿No tienes cuenta?</p>
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="text-[#004080] font-bold text-sm hover:text-[#002244] hover:underline transition-colors"
                >
                  Registrarse como Ciudadano
                </button>
              </div>

            </form>
          </div>
          
          <div className="absolute bottom-4 left-0 w-full text-center text-white/30 text-xs md:hidden">
            <p>© 2025 Equipo de la Seguridad v2.0</p>
          </div>

        </div>

      </div>

      <div className="hidden md:block absolute bottom-6 right-8 text-white/30 text-xs text-right">
        <p>© 2025 Equipo de la Seguridad</p>
        <p>Todos los derechos reservados</p>
      </div>

    </div>
  );
}

// Icono Loader2 simple por si no lo tienes importado de lucide
function Loader2(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    )
}