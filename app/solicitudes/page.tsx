'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  PlusCircle, 
  MapPin, 
  ArrowRight, 
  FolderOpen, 
  Loader2,
  Clock, CheckCircle2, AlertCircle, PlayCircle
} from 'lucide-react';
import { Poppins } from 'next/font/google';
import api from '../lib/api'; // <--- Usamos tu instancia de axios configurada

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Definición de tipos ajustada al Backend NestJS
interface Solicitud {
  id: number;
  subject: string;      // Antes 'asunto'
  description: string;  // Antes 'descripcion'
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  imageUrl?: string;    // Antes 'fotoUrl'
  publicCode: string;
  createdAt: string;
}

export default function SolicitudesPage() {
  const router = useRouter();
  
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const cargarSolicitudes = async () => {
      setCargando(true);
      try {
        // api.get inyecta el token automáticamente gracias al interceptor
        // El backend detecta el rol CITIZEN y filtra solo las suyas
        const response = await api.get('/requests');
        
        // NestJS devuelve { data: [], meta: {} }
        setSolicitudes(response.data.data);

      } catch (error: any) {
        console.error("❌ Error cargando solicitudes:", error);
        // Si el interceptor detecta 401, ya redirige al login, 
        // pero por seguridad extra podemos manejarlo aquí si queremos mostrar un toast
      } finally {
        setCargando(false);
      }
    };

    cargarSolicitudes();
  }, []);

  // --- HELPERS VISUALES ---
  
  // Mapeo de estados a estilos visuales
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'RESOLVED': 
        return { 
            style: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
            label: 'Resuelto',
            icon: CheckCircle2
        };
      case 'CLOSED': 
        return { 
            style: 'bg-slate-100 text-slate-800 border-slate-200', 
            label: 'Cerrado',
            icon: AlertCircle
        };
      case 'IN_PROGRESS': 
        return { 
            style: 'bg-blue-100 text-blue-800 border-blue-200', 
            label: 'En Gestión',
            icon: PlayCircle
        };
      default: // PENDING 
        return { 
            style: 'bg-amber-100 text-amber-800 border-amber-200', 
            label: 'Pendiente',
            icon: Clock
        };
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
               <p className="text-[#FFCC00] text-xs font-medium hidden md:block mt-1">Panel Ciudadano</p>
             </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/solicitudes/crear')}
              className="flex items-center gap-2 bg-[#FFCC00] hover:bg-[#e6b800] text-[#002244] px-5 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-orange-500/20"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Nuevo Reporte</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="w-full max-w-7xl px-5 py-8 pb-24 z-10 flex flex-col items-center">

        {/* Header Móvil */}
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
            <p className="text-sm font-medium animate-pulse">Cargando tus solicitudes...</p>
          </div>
        )}

        {/* --- ESTADO: LISTA DE DATOS (GRID) --- */}
        {!cargando && solicitudes.length > 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {solicitudes.map((solicitud) => {
              const statusInfo = getStatusConfig(solicitud.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div 
                  key={solicitud.id}
                  onClick={() => router.push(`/solicitudes/${solicitud.id}`)} // Ajusta esta ruta a tu página de detalle real
                  className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-white/5 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                >
                  
                  {/* Imagen Header de la Card */}
                  <div className="h-[180px] w-full overflow-hidden relative bg-slate-200">
                    {solicitud.imageUrl ? (
                        <Image 
                            src={solicitud.imageUrl} 
                            alt={solicitud.subject}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                            <FolderOpen size={40} />
                        </div>
                    )}
                    
                    {/* Overlay degradado para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    
                    {/* Badge de Estado */}
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md border backdrop-blur-md flex items-center gap-1.5 ${statusInfo.style}`}>
                      <StatusIcon size={12} />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Body de la Card */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {solicitud.publicCode || `#${solicitud.id}`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                            {new Date(solicitud.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="text-[#002244] font-bold text-lg leading-tight line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors">
                      {solicitud.subject}
                    </h3>

                    {/* Descripción truncada */}
                    <p className="text-[#718096] text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {solicitud.description}
                    </p>

                    <button className="w-full bg-[#002244] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#FFCC00] group-hover:text-[#002244] transition-all shadow-md mt-auto">
                      Ver Seguimiento
                      <ArrowRight size={18} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* --- ESTADO: VACÍO --- */}
        {!cargando && solicitudes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 text-center animate-fade-in text-white">
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

      {/* --- FOOTER --- */}
      <footer className="fixed lg:static bottom-0 w-full py-4 bg-[#002244]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none text-center border-t border-white/5 lg:border-none z-50">
        <p className="text-white/50 text-xs">© 2025 Equipo de la Seguridad</p>
      </footer>

    </div>
  );
}