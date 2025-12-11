'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';
import { Poppins } from 'next/font/google';

// Configuración de la fuente Poppins
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function LoginPage() {
  const router = useRouter();

  // 1. ESTADOS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. LÓGICA DE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_AUTH_URL || 'http://tu-api.com'; 

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      Cookies.set('token', data.token, { expires: 7 }); 
      Cookies.set('user', data.name, { expires: 7 });

      router.push('/'); 

    } catch (error: any) {
      console.error('❌ Error login:', error);
      setErrorMessage('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // CAMBIO: 'min-h-screen' y flex para centrar. En PC usamos grid de 2 columnas opcional o flex centrado.
    <div className={`min-h-screen w-full relative flex items-center justify-center bg-[#002244] overflow-hidden ${poppins.className}`}>
      
      {/* --- FONDO DEGRADADO GLOBAL --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002244] via-[#003366] to-[#0a2e5c] z-0" />
      
      {/* --- ELEMENTOS DECORATIVOS RESPONSIVOS --- */}
      {/* Círculo 1: Arriba derecha en móvil, más grande y centrado en PC */}
      <div className="absolute -top-[50px] -right-[50px] md:-top-[100px] md:-right-[100px] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-20 z-0 pointer-events-none blur-2xl" />
      
      {/* Círculo 2: Abajo izquierda */}
      <div className="absolute -bottom-[20px] -left-[50px] md:-bottom-[100px] md:-left-[100px] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-t from-[#004080] to-transparent opacity-20 z-0 pointer-events-none blur-2xl" />

      {/* --- CONTENEDOR PRINCIPAL (GRID RESPONSIVO) --- */}
      {/* Móvil: Flex vertical simple.
          Tablet/PC (md/lg): Grid de 2 columnas. Izquierda info, Derecha form.
          'container': Centra y limita el ancho máximo.
      */}
      <div className="relative z-10 w-full container max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full min-h-[inherit]">

        {/* --- COLUMNA IZQUIERDA: BRANDING (Visible destacado en Tablet/PC) --- */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left animate-fade-in-down">
          
          <div className="inline-block p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl mb-6 md:mb-8">
             {/* Logo un poco más grande en PC */}
            <Image 
              src="/assets/img/bot.png" 
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

          {/* Feature Badges (Solo visible en PC/Tablet para llenar espacio) */}
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

        {/* --- COLUMNA DERECHA: FORMULARIO (Tarjeta) --- */}
        <div className="w-full flex justify-center md:justify-end">
          
          {/* Tarjeta: En móvil ancho completo (max-350px), en PC ancho fijo de 400px+ */}
          <div className="w-full max-w-[380px] md:max-w-[420px] bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden">
            
            {/* Decoración sutil interna de la tarjeta */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FFCC00] to-[#e6b800]" />

            <h2 className="text-[#002244] font-bold text-xl md:text-2xl mb-1 text-center md:text-left">Bienvenido de nuevo</h2>
            <p className="text-slate-500 text-sm mb-6 text-center md:text-left">Ingresa tus credenciales para acceder.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              
              {/* Input Correo */}
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

              {/* Input Contraseña */}
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

              {/* Mensaje de Error */}
              {errorMessage && (
                <div className="flex items-center gap-3 bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium animate-pulse border border-red-100">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Botón Principal */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FFCC00] to-[#ffdb4d] hover:to-[#ffc000] active:scale-[0.98] text-[#002244] font-extrabold text-base py-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#002244]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validando...
                  </span>
                ) : (
                  <>
                    INGRESAR
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Footer de la tarjeta */}
              <div className="mt-2 text-center">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />
                <p className="text-slate-500 text-sm mb-2">¿No tienes acceso?</p>
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="text-[#004080] font-bold text-sm hover:text-[#002244] hover:underline transition-colors"
                >
                  Solicitar una cuenta nueva
                </button>
              </div>

            </form>
          </div>
          
          {/* Footer Info (Móvil) - Fuera de la tarjeta para PC */}
          <div className="absolute bottom-4 left-0 w-full text-center text-white/30 text-xs md:hidden">
            <p>© 2025 Equipo de la Seguridad v1.0.2</p>
          </div>

        </div>

      </div>

      {/* Footer Info (PC) - Esquina inferior */}
      <div className="hidden md:block absolute bottom-6 right-8 text-white/30 text-xs text-right">
        <p>© 2025 Equipo de la Seguridad</p>
        <p>Todos los derechos reservados</p>
      </div>

    </div>
  );
}