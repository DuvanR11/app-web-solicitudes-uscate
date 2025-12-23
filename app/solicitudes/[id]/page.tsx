'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { 
  ArrowLeft, 
  Maximize2, 
  MapPin, 
  ExternalLink, 
  Hourglass,
  X,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Siren,
  PlayCircle // Added specific icon for IN_PROGRESS
} from 'lucide-react';
import { Poppins } from 'next/font/google';
import api from '@/app/lib/api'; // Usamos la instancia api configurada

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Helper para badges con iconos y estilos consistentes
const StatusBadge = ({ estado }: { estado: string }) => {
  const styles = {
    'RESOLVED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'CLOSED': 'bg-slate-100 text-slate-800 border-slate-200',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800 border-blue-200',
    'PENDING': 'bg-amber-100 text-amber-800 border-amber-200',
  };
  
  const labels = {
    'RESOLVED': 'Resuelta',
    'CLOSED': 'Cerrada',
    'IN_PROGRESS': 'En Gestión',
    'PENDING': 'Pendiente',
  };

  const icons = {
    'RESOLVED': <CheckCircle2 size={14} />,
    'CLOSED': <AlertCircle size={14} />,
    'IN_PROGRESS': <PlayCircle size={14} />,
    'PENDING': <Clock size={14} />,
  };

  const statusKey = estado as keyof typeof styles;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${styles[statusKey] || 'bg-slate-100'}`}>
      {icons[statusKey]}
      <span>{labels[statusKey] || estado}</span>
    </div>
  );
};

export default function DetalleSolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Estados
  const [solicitud, setSolicitud] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [modalImagen, setModalImagen] = useState(false);
  const [idSolicitud, setIdSolicitud] = useState<string | null>(null);

  // 1. Obtener ID de los params (Next.js 15+ requiere await params)
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setIdSolicitud(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  // 2. Cargar Datos del Backend
  useEffect(() => {
    if (!idSolicitud) return;

    const cargarDetalle = async () => {
      try {
        // api.get maneja la inyección del token automáticamente
        const response = await api.get(`/requests/${idSolicitud}`);
        
        // Asumiendo que el backend devuelve el objeto directo o dentro de data
        setSolicitud(response.data);

      } catch (error: any) {
        console.error("Error cargando detalle:", error);
        // Si es 404 o error de permisos, redirigir
        if (error.response?.status === 404 || error.response?.status === 403) {
             router.push('/solicitudes');
        }
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [idSolicitud, router]);

  if (cargando) {
    return (
      <div className="min-h-screen w-full bg-[#002244] flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="animate-spin" size={40} color="#FFCC00" />
        <p className="text-sm font-medium animate-pulse">Cargando detalle...</p>
      </div>
    );
  }

  if (!solicitud) return null;

  return (
    <div className={`min-h-screen w-full relative bg-[#002244] flex flex-col items-center pb-20 overflow-x-hidden ${poppins.className}`}>
      
      {/* --- FONDO DECORATIVO --- */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#002244] to-[#0a2e5c] -z-20" />
      <div className="fixed -top-[50px] -right-[50px] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-10 -z-10" />

      {/* --- HEADER (Móvil Fixed) --- */}
      <div className="fixed top-0 w-full lg:hidden z-30 flex items-center p-4 bg-[#002244]/90 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => router.back()} 
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white font-bold ml-3 text-lg">Detalle de Solicitud</h1>
      </div>

      {/* --- BOTÓN VOLVER (Desktop) --- */}
      <div className="hidden lg:block absolute top-8 left-8 z-30">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver al listado</span>
        </button>
      </div>

      {/* --- MAIN CONTAINER (GRID) --- */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-24 lg:pt-20 animate-fade-in-up">
        
        {/* Título Desktop */}
        <div className="hidden lg:flex items-center justify-between mb-8 text-white pl-4 border-l-4 border-[#FFCC00]">
          <div>
            <h1 className="text-3xl font-bold">Reporte {solicitud.publicCode || `#${solicitud.id}`}</h1>
            <p className="text-white/60 text-sm mt-1">Detalle completo de la novedad</p>
          </div>
          <StatusBadge estado={solicitud.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* === COLUMNA IZQUIERDA (Visuales) === */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 1. EVIDENCIA FOTOGRÁFICA */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl relative group">
              <div 
                className="relative h-[300px] lg:h-[350px] bg-slate-200 cursor-pointer"
                onClick={() => solicitud.imageUrl && setModalImagen(true)}
              >
                {solicitud.imageUrl ? (
                    <Image 
                      src={solicitud.imageUrl}
                      alt="Evidencia"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <span className="text-sm italic">Sin imagen adjunta</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                
                {/* Badge Móvil */}
                <div className="lg:hidden absolute top-4 right-4">
                  <StatusBadge estado={solicitud.status} />
                </div>

                {solicitud.imageUrl && (
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors">
                      <Maximize2 size={24} />
                    </div>
                )}
              </div>
            </div>

            {/* 2. MAPA DE UBICACIÓN */}
            {solicitud.lat && solicitud.lng && (
              <div className="bg-white rounded-[24px] p-5 shadow-xl">
                <div className="flex items-center gap-2 text-[#004080] font-bold text-sm mb-4">
                  <MapPin size={18} />
                  <span>Ubicación Registrada</span>
                </div>

                <div className="relative h-[200px] w-full rounded-2xl overflow-hidden border border-slate-200">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${solicitud.lat},${solicitud.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="absolute inset-0"
                  />
                  
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${solicitud.lat},${solicitud.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 bg-white text-[#002244] px-3 py-1.5 rounded-lg shadow-md text-xs font-bold flex items-center gap-1 hover:bg-[#FFCC00] transition-colors"
                  >
                    <span>Ver en Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* === COLUMNA DERECHA (Información y Chat) === */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 3. DETALLES DEL REPORTE */}
            <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-[#002244] font-bold text-2xl leading-tight capitalize">
                  {solicitud.subject}
                </h2>
                {/* Fecha real del registro */}
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md shrink-0">
                   <Calendar size={12} />
                   <span>{new Date(solicitud.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="bg-[#f8fafc] border-l-4 border-[#FFCC00] p-5 rounded-r-xl mb-6">
                <p className="text-slate-600 text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                  {solicitud.description}
                </p>
              </div>

              {/* ====================================================== */}
              {/* --- INDICADOR VISUAL: CAI SOLICITADO --- */}
              {/* ====================================================== */}
              {solicitud.priority === 'CRITICAL' && (
                <div className="bg-[#002244]/5 border border-[#002244]/10 rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up">
                  <div className="bg-[#002244] text-[#FFCC00] p-3 rounded-full shadow-lg shadow-blue-900/20 shrink-0">
                    <Siren size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[#002244] font-bold text-sm uppercase tracking-wide">
                      Unidad Policial Solicitada
                    </h4>
                    <p className="text-slate-600 text-xs mt-0.5">
                      El ciudadano ha marcado explícitamente la necesidad de presencia de un CAI móvil.
                    </p>
                  </div>
                </div>
              )}
              {/* ====================================================== */}

            </div>

            {/* 4. SEGUIMIENTO (RESPUESTA OFICIAL) */}
            <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-xl flex-1">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Hourglass size={20} />
                </div>
                <div>
                  <h3 className="text-[#002244] font-bold text-lg">Historial de Seguimiento</h3>
                  <p className="text-slate-400 text-xs">Respuestas del equipo administrativo</p>
                </div>
              </div>

              <div className="flex flex-col gap-6 pl-2">
                
                {/* Mostramos responseComments si existe */}
                {solicitud.responseComments ? (
                    <div className="relative pl-8 border-l-2 border-slate-200 pb-2">
                      {/* Punto de línea de tiempo */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-[#004080]"></div>
                      
                      <div className="bg-[#f0f4f8] p-4 rounded-2xl rounded-tl-none mt-[-5px]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-[#004080] uppercase tracking-wider">Respuesta Oficial</span>
                          <span className="text-[10px] text-slate-400">
                              {new Date(solicitud.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{solicitud.responseComments}</p>
                      </div>
                    </div>
                ) : (
                  /* Estado Vacío */
                  <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <div className="bg-slate-50 p-3 rounded-full mb-3">
                      <Hourglass className="text-slate-300" size={24} />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No hay respuestas aún.</p>
                    <p className="text-slate-400 text-xs mt-1">Tu solicitud está siendo revisada.</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="fixed lg:static bottom-0 w-full py-4 bg-[#002244]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none text-center border-t border-white/5 lg:border-none z-20">
        <p className="text-white/50 text-xs">© 2025 Equipo de la Seguridad</p>
      </footer>

      {/* --- MODAL DE IMAGEN --- */}
      {modalImagen && solicitud.imageUrl && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalImagen(false)}
        >
          <button className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50">
            <X size={28} />
          </button>
          
          <div className="relative w-full h-full max-w-5xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={solicitud.imageUrl} 
              alt="Evidencia Full" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}