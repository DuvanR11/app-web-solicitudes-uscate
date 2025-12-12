'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { 
  PlusCircle, 
  MapPin, 
  ArrowRight, 
  FolderOpen, 
  Loader2,
  Filter
} from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Definición de tipos
interface Solicitud {
  id: number | string;
  asunto: string;
  descripcion: string;
  estado: 'Aprobada' | 'Rechazada' | 'Pendiente';
  fotoUrl?: string;
}

export default function SolicitudesPage() {
  const router = useRouter();
  
  // Estados
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const cargarSolicitudes = async () => {
      setCargando(true);
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://tu-api.com';
        
        const response = await fetch(`${apiUrl}/solicitudes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          Cookies.remove('token');
          router.push('/login');
          return;
        }

        if (!response.ok) throw new Error('Error al cargar');

        const data = await response.json();
        setSolicitudes(data);

      } catch (error) {
        console.error("❌ Error cargando solicitudes:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarSolicitudes();
  }, [router]);

  // --- HELPERS ---
  const getImageUrl = (url?: string) => {
    if (!url) return '/assets/img/no-image.png'; 
    if (url.startsWith('http')) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; 
    return `${apiUrl.replace('/api', '')}/uploads/${url}`; 
  };

  const getStatusBadgeStyles = (estado: string) => {
    switch (estado) {
      case 'Aprobada': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rechazada': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className={`min-h-screen w-full relative bg-[#002244] flex flex-col items-center ${poppins.className}`}>
      
      {/* --- FONDO DECORATIVO --- */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#002244] to-[#0a2e5c] -z-20" />
      <div className="fixed -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-10 blur-3xl -z-10" />
      <div className="fixed bottom-[0px] -left-[100px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-10 blur-3xl -z-10" />

      {/* --- HEADER --- */}
      <header className="w-full sticky top-0 z-30 bg-[#002244]/90 backdrop-blur-md border-b border-white/5 shadow-md">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="hidden md:block bg-white/10 p-2 rounded-xl">
                <Image src="/assets/img/bot.png" alt="Logo" width={30} height={30} />
             </div>
             <div>
               <h1 className="text-white font-bold text-lg md:text-xl tracking-wide leading-none">Mis Solicitudes</h1>
               <p className="text-[#FFCC00] text-xs font-medium hidden md:block mt-1">Gestión de reportes</p>
             </div>
          </div>
          
          <div className="flex gap-3">
            {/* Botón Filtro (Visual en este ejemplo) */}
            {/* <button className="hidden md:flex items-center gap-2 text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
               <Filter size={18} />
               <span className="text-sm font-medium">Filtrar</span>
            </button> */}

            <button 
              onClick={() => router.push('/solicitudes/crear')}
              className="flex items-center gap-2 bg-[#FFCC00] hover:bg-[#e6b800] text-[#002244] px-5 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-orange-500/20"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Nueva Solicitud</span>
              <span className="sm:hidden">Nueva</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="w-full max-w-7xl px-5 py-8 pb-24 z-10 flex flex-col items-center">

        {/* Header Móvil (Solo visible en < md si quieres reforzar el branding) */}
        <div className="md:hidden w-full flex items-center gap-4 mb-6 animate-fade-in-down">
          <div className="w-[50px] h-[50px] bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center">
             <Image src="/assets/img/bot.png" alt="Logo" width={30} height={30} />
          </div>
          <h2 className="text-white font-bold text-2xl leading-tight">Historial de <br/> Reportes</h2>
        </div>

        {/* --- ESTADO: CARGANDO --- */}
        {cargando && (
          <div className="flex flex-col items-center justify-center mt-20 text-white/70 gap-3">
            <Loader2 className="animate-spin" size={48} color="#FFCC00" />
            <p className="text-sm font-medium animate-pulse">Cargando información...</p>
          </div>
        )}

        {/* --- ESTADO: LISTA DE DATOS (GRID) --- */}
        {!cargando && solicitudes.length > 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {solicitudes.map((solicitud) => (
              <div 
                key={solicitud.id}
                onClick={() => router.push(`/solicitudes/${solicitud.id}`)}
                className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-white/5 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
              >
                
                {/* Imagen Header de la Card */}
                <div className="h-[200px] w-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${getImageUrl(solicitud.fotoUrl)})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md border backdrop-blur-md ${getStatusBadgeStyles(solicitud.estado)}`}>
                    {solicitud.estado}
                  </div>
                </div>

                {/* Body de la Card */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="text-[#002244] font-bold text-xl leading-tight line-clamp-1 group-hover:text-blue-700 transition-colors">
                      {solicitud.asunto}
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-[#f0f4f8] px-3 py-1.5 rounded-lg text-xs font-bold text-[#004080] w-fit mb-4">
                     <MapPin size={14} />
                     <span>Ubicación registrada</span>
                  </div>

                  <p className="text-[#718096] text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {solicitud.descripcion}
                  </p>

                  <button className="w-full bg-[#002244] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#FFCC00] group-hover:text-[#002244] transition-all shadow-md">
                    Ver Detalle
                    <ArrowRight size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* --- ESTADO: VACÍO --- */}
        {!cargando && solicitudes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center animate-fade-in text-white">
            <div className="bg-white/10 p-6 rounded-full mb-6">
              <FolderOpen size={64} className="text-[#FFCC00] opacity-90" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Sin Reportes</h3>
            <p className="text-slate-300 text-sm mb-8 max-w-[300px]">
              Aún no has realizado ninguna solicitud de seguridad. ¡Tu aporte es importante!
            </p>
            <button 
              onClick={() => router.push('/solicitudes/crear')}
              className="bg-[#FFCC00] text-[#002244] px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-[#e6b800] transition-transform hover:scale-105"
            >
              Crear mi primer reporte
            </button>
          </div>
        )}

      </main>

      {/* --- FOOTER FIXED (Solo móvil) / BOTTOM (PC) --- */}
      <footer className="fixed lg:static bottom-0 w-full py-4 bg-[#002244]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none text-center border-t border-white/5 lg:border-none z-50">
        <p className="text-white/50 text-xs">© 2025 Equipo de la Seguridad</p>
      </footer>

    </div>
  );
}