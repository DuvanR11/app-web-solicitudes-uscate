'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { 
  MoreVertical, 
  PlusCircle, 
  List, 
  CheckCircle2,
  Bell,
  LogOut,
  ClipboardCheck, // <--- Nuevo icono importado
  ArrowRight      // <--- Usaremos este para el botón del banner
} from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Usuario');
  const [mounted, setMounted] = useState(false);

  // Equivalente a ngOnInit
  useEffect(() => {
    setMounted(true);
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUserName(userCookie);
    }
  }, []);

  // Navegación
  const irANuevaSolicitud = () => router.push('/solicitudes/crear');
  const irASolicitudes = () => router.push('/solicitudes');

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  // Si no está montado (hidratación)
  if (!mounted) return null;

  return (
    <div className={`min-h-screen w-full relative bg-[#002244] overflow-x-hidden flex flex-col items-center ${poppins.className}`}>
      
      {/* --- FONDO DECORATIVO --- */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#002244] to-[#0a2e5c] -z-20" />
      {/* Círculos más grandes para Desktop */}
      <div className="fixed -top-[100px] -left-[150px] w-[400px] h-[400px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-10 blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[120px] -right-[50px] w-[200px] h-[200px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-10 blur-3xl -z-10 pointer-events-none" />

      {/* --- TOP BAR (Visible en Móvil y Desktop) --- */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center p-6 lg:py-8 text-white z-20">
        <div className="flex items-center gap-3">
          {/* Logo visible solo en PC para reforzar marca */}
          <div className="hidden lg:block w-10 h-10 bg-white/10 rounded-full p-2 backdrop-blur-sm border border-white/10">
             <Image src="/assets/img/bot.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold leading-tight">Panel Principal</h1>
            <p className="text-[#FFCC00] text-sm font-medium">Plataforma de Reportes Ciudadanos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleLogout} className="text-white/70 hover:text-red-400 hover:bg-white/10 p-2 rounded-full transition-colors lg:flex items-center gap-2">
             <LogOut size={24} />
             <span className="hidden lg:inline text-sm font-semibold">Salir</span>
          </button>
        </div>
      </header>

      {/* --- MAIN LAYOUT (GRID RESPONSIVO) --- */}
      <main className="w-full max-w-7xl mx-auto px-5 pb-24 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start h-full">
        
        {/* === COLUMNA IZQUIERDA: PERFIL === */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Tarjeta de Perfil (Glassmorphism en Desktop) */}
          <div className="bg-transparent lg:bg-white/5 lg:backdrop-blur-xl lg:border lg:border-white/10 lg:p-8 lg:rounded-3xl lg:shadow-2xl flex flex-col items-center animate-fade-in-down">
            
            <div className="relative mb-4">
               {/* Avatar */}
              <div className="w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] rounded-full p-[4px] bg-[#FFCC00] shadow-[0_0_0_6px_rgba(255,204,0,0.2),0_8px_25px_rgba(0,0,0,0.4)] overflow-hidden transition-all hover:scale-105">
                 <Image 
                  src="/assets/img/bot.png" 
                  alt="Avatar" 
                  width={140} 
                  height={140} 
                  className="w-full h-full object-cover rounded-full bg-white"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 border-4 border-[#002244] rounded-full"></div>
            </div>
            
            <h2 className="text-3xl font-bold mt-2 text-white drop-shadow-md text-center">Hola, {userName.split(' ')[0]}</h2>
            <p className="text-white/60 text-sm mb-4">{userName}</p>
            
            <div className="flex items-center gap-2 text-[#a0f0a0] text-sm font-bold bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
              <CheckCircle2 size={16} />
              <span>Ciudadano Activo</span>
            </div>

          </div>
        </div>

        {/* === COLUMNA DERECHA: ACCIONES === */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* ========================================== */}
          {/* --- NUEVO MÓDULO: TESTIGO ELECTORAL --- */}
          {/* ========================================== */}
          <div 
            className="w-full bg-gradient-to-r from-[#FFCC00] to-[#FDB931] rounded-[24px] p-6 lg:p-8 relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 animate-fade-in-up"
          >
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="bg-[#002244] p-4 rounded-2xl shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <ClipboardCheck size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[#002244] font-bold text-xl md:text-2xl leading-tight">
                    ¿Quieres ser testigo electoral?
                  </h3>
                  <p className="text-[#002244]/80 text-sm font-semibold mt-1 max-w-md">
                    Únete a la defensa del voto. Tu presencia garantiza la transparencia.
                  </p>
                </div>
              </div>

              <a 
                href="https://forms.gle/7n5D9wEx3MzsobpR7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto whitespace-nowrap bg-[#002244] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl hover:bg-[#003366] transition-colors flex items-center justify-center gap-2 group/btn"
              >
                Inscribirme
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
          {/* ========================================== */}


          <h3 className="text-white/80 text-lg font-bold hidden lg:block border-b border-white/10 pb-2">
            Acciones Rápidas
          </h3>

          {/* Grid de Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
            
            {/* CARD 1: CREAR NUEVO REPORTE */}
            <div 
              onClick={irANuevaSolicitud}
              className="group bg-white rounded-[24px] p-6 lg:p-8 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,204,0,0.3)] animate-fade-in-up border border-transparent hover:border-[#FFCC00]/50 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#e6eff7] p-4 rounded-2xl group-hover:bg-[#d0e1f0] transition-colors">
                    <PlusCircle size={36} className="text-[#2ecc71] group-hover:text-[#27ae60] transition-colors" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                    <ArrowRightIcon />
                  </div>
                </div>
                <h3 className="text-[#004080] font-bold text-xl m-0 mb-2">Crear Nuevo Reporte</h3>
                <p className="text-[#718096] text-sm lg:text-base leading-relaxed">
                  Genera una nueva solicitud de asistencia, incluyendo detalles, evidencia fotográfica y tu ubicación GPS.
                </p>
              </div>
              <div className="mt-4 text-xs font-bold text-[#2ecc71] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Comenzar ahora
              </div>
            </div>

            {/* CARD 2: HISTORIAL */}
            <div 
              onClick={irASolicitudes}
              className="group bg-white rounded-[24px] p-6 lg:p-8 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,204,0,0.3)] animate-fade-in-up delay-100 border border-transparent hover:border-[#FFCC00]/50 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#e6eff7] p-4 rounded-2xl group-hover:bg-[#d0e1f0] transition-colors">
                    <List size={36} className="text-[#e6b800] group-hover:text-[#FFCC00] transition-colors" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                    <ArrowRightIcon />
                  </div>
                </div>
                <h3 className="text-[#004080] font-bold text-xl m-0 mb-2">Historial de Reportes</h3>
                <p className="text-[#718096] text-sm lg:text-base leading-relaxed">
                  Consulta el estado y gestiona todas las solicitudes que has generado hasta la fecha.
                </p>
              </div>
              <div className="mt-4 text-xs font-bold text-[#e6b800] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Ver mis reportes
              </div>
            </div>

            {/* Placeholder Cards */}
            <div className="hidden lg:flex group bg-white/5 border border-white/10 rounded-[24px] p-6 items-center justify-center text-center cursor-not-allowed hover:bg-white/10 transition-colors">
               <div className="opacity-50">
                 <p className="text-white font-bold text-lg">Próximamente</p>
                 <p className="text-white/60 text-sm">Noticias y Alertas</p>
               </div>
            </div>
             <div className="hidden lg:flex group bg-white/5 border border-white/10 rounded-[24px] p-6 items-center justify-center text-center cursor-not-allowed hover:bg-white/10 transition-colors">
               <div className="opacity-50">
                 <p className="text-white font-bold text-lg">Próximamente</p>
                 <p className="text-white/60 text-sm">Mapa de Calor</p>
               </div>
            </div>

          </div>
        </div>

      </main>

      {/* --- FOOTER FIJO --- */}
      <footer className="fixed bottom-0 w-full py-4 bg-[#002244]/95 backdrop-blur-md text-center border-t border-white/5 z-50">
        <p className="text-white/50 text-xs">© 2025 Equipo de la Seguridad | Todos los derechos reservados</p>
      </footer>

    </div>
  );
}

// Icono simple para reutilizar
function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}