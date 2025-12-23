'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, MessageSquare, Map as MapIcon, FileText, Camera, 
  CheckCircle, X, MapPin, RefreshCw, Send, AlertTriangle, ChevronDown, Info, Siren 
} from 'lucide-react';
import { Poppins } from 'next/font/google';
import api from '@/app/lib/api'; 

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

// IDs esperados: Usaquén (1), Chapinero (2), etc.
const LOCALIDADES = [
  "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme", "Tunjuelito",
  "Bosa", "Kennedy", "Fontibón", "Engativá", "Suba", "Barrios Unidos",
  "Teusaquillo", "Los Mártires", "Antonio Nariño", "Puente Aranda", "La Candelaria",
  "Rafael Uribe Uribe", "Ciudad Bolívar", "Sumapaz"
];

export default function NuevaSolicitudPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados del Formulario
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [localidad, setLocalidad] = useState(''); // Ahora guardará el ID como string ("1", "2")
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null); 
  
  // Estado CAI (Priority)
  const [solicitarCai, setSolicitarCai] = useState(false);
  
  // Ubicación
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ text: '', type: '' });
  const [showGpsModal, setShowGpsModal] = useState(false);

  useEffect(() => {
    obtenerUbicacion();
  }, []);

  const obtenerUbicacion = () => {
    setGpsError(false);
    setMensaje({ text: '', type: '' });

    if (!navigator.geolocation) {
      setGpsError(true);
      setMensaje({ text: 'El navegador no soporta geolocalización', type: 'error' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude);
        setLongitud(position.coords.longitude);
        setGpsError(false);
        setShowGpsModal(false);
      },
      (error) => {
        console.error('Error GPS:', error);
        setGpsError(true);
        setLatitud(null);
        setLongitud(null);
        setShowGpsModal(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
          setMensaje({ text: 'La imagen es demasiado grande (Máx 20MB)', type: 'error' });
          return;
      }
      setFotoFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (gpsError || !latitud || !longitud) {
      setShowGpsModal(true);
      return;
    }
    
    if (!asunto || !descripcion || !localidad) {
      setMensaje({ text: '⚠️ Completa todos los campos obligatorios.', type: 'error' });
      return;
    }

    setLoading(true);
    setMensaje({ text: '', type: '' });

    try {
      let uploadedImageUrl = null;
      
      if (fotoFile) {
          const formData = new FormData();
          formData.append('file', fotoFile);
          formData.append('folder', 'app-seguridad');

          const uploadRes = await api.post('/media/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          uploadedImageUrl = uploadRes.data.url; 
      }

      // --- CAMBIO AQUÍ: Enviamos el ID numérico ---
      const payload = {
        type: 'SECURITY_APP', 
        subject: asunto,
        description: descripcion,
        priority: solicitarCai ? 'CRITICAL' : 'MEDIUM', 
        
        // Convertimos el string "1" a número 1 para el backend
        locality: Number(localidad), 
        lat: latitud,
        lng: longitud,
        imageUrl: uploadedImageUrl 
      };

      await api.post('/requests', payload);

      setMensaje({ text: '✅ Reporte enviado exitosamente.', type: 'success' });
      
      setTimeout(() => {
        router.push('/solicitudes'); 
      }, 1500);

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error al enviar la solicitud.';
      setMensaje({ text: `❌ ${Array.isArray(msg) ? msg[0] : msg}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full relative bg-[#002244] flex flex-col items-center lg:justify-center overflow-x-hidden ${poppins.className}`}>
      
      {/* --- FONDO --- */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#002244] to-[#0a2e5c] -z-20" />
      <div className="fixed -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-10 blur-3xl -z-10" />
      <div className="fixed bottom-[0px] -left-[100px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#004080] to-transparent opacity-10 blur-3xl -z-10" />

      {/* --- HEADER --- */}
      <div className="fixed top-0 w-full lg:static lg:w-auto lg:hidden z-20 flex items-center p-4 bg-[#002244]/90 backdrop-blur-md border-b border-white/5">
        <button onClick={() => router.back()} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white font-bold ml-2 text-lg">Nueva Solicitud</h1>
      </div>

      <div className="hidden lg:block absolute top-8 left-8 z-30">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Cancelar y Volver</span>
        </button>
      </div>

      {/* --- GRID PRINCIPAL --- */}
      <div className="w-full max-w-7xl mx-auto px-4 py-20 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

        {/* COLUMNA IZQUIERDA */}
        <div className="hidden lg:flex lg:col-span-5 flex-col text-white animate-fade-in-down pt-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg mb-6">
            <Image src="/assets/img/bot.png" alt="Logo" width={60} height={60} className="object-contain" />
          </div>
          
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Reportar una <br />
            <span className="text-[#FFCC00]">Novedad</span>
          </h1>
          
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Utiliza este formulario para notificar incidencias de seguridad. Recuerda que la ubicación GPS y la evidencia fotográfica son obligatorias.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Info className="text-[#FFCC00] mt-1 shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-sm mb-1">Consejo:</h4>
                <p className="text-xs text-slate-400">
                  Asegúrate de estar en el lugar de los hechos al momento de enviar el reporte para que la geolocalización sea precisa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="col-span-1 lg:col-span-7 w-full">
          
          {/* Header Móvil */}
          <div className="lg:hidden text-center mb-6 animate-fade-in-down">
            <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
              <Image src="/assets/img/bot.png" alt="Logo" width={50} height={50} className="object-contain" />
            </div>
            <h2 className="text-white font-bold text-2xl">Reportar Novedad</h2>
            <p className="text-[#FFCC00] text-sm mt-1">Completa los datos para generar el reporte</p>
          </div>

          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl animate-fade-in-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-[#004080] font-bold text-lg">Detalles del Reporte</h3>
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Nuevo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

              {/* ASUNTO */}
              <div className="md:col-span-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MessageSquare size={20} /></div>
                <input 
                  type="text" placeholder="Asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)}
                  className="w-full bg-[#f4f7fa] border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-[#002244] font-semibold focus:border-[#004080] outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* LOCALIDAD - CAMBIO AQUÍ */}
              <div className="md:col-span-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MapIcon size={20} /></div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={20} /></div>
                <select
                  value={localidad} onChange={(e) => setLocalidad(e.target.value)}
                  className="w-full bg-[#f4f7fa] border border-slate-200 rounded-xl py-3.5 pl-12 pr-10 text-[#002244] font-semibold focus:border-[#004080] outline-none transition-all appearance-none invalid:text-slate-400"
                >
                  <option value="" disabled>Seleccionar Localidad</option>
                  {LOCALIDADES.map((loc, idx) => (
                    // value={idx + 1} para enviar el ID (1, 2, 3...) en lugar del texto
                    <option key={idx} value={idx + 1}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="md:col-span-2 relative group">
                <div className="absolute left-4 top-4 text-slate-400"><FileText size={20} /></div>
                <textarea 
                  rows={4} placeholder="Descripción detallada de la novedad..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-[#f4f7fa] border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-[#002244] font-semibold focus:border-[#004080] outline-none transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              <div className="md:col-span-2 flex items-center text-center text-slate-400 text-xs font-bold uppercase tracking-widest my-2">
                <div className="flex-1 border-b border-slate-100"></div>
                <span className="px-4 bg-white z-10">Evidencia y Ubicación</span>
                <div className="flex-1 border-b border-slate-100"></div>
              </div>

              {/* CÁMARA */}
              <div className="md:col-span-1 flex flex-col h-full">
                <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button 
                  onClick={triggerCamera}
                  className={`flex-1 min-h-[100px] w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 font-bold transition-all relative overflow-hidden group
                    ${fotoBase64 ? 'bg-green-50 border-green-300 text-green-700' : 'bg-slate-50 border-slate-300 text-slate-500 hover:bg-slate-100 hover:border-slate-400'}`}
                >
                  {fotoBase64 ? (
                    <>
                      <Image src={fotoBase64} alt="Preview" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="relative z-10 flex flex-col items-center bg-white/80 p-2 rounded-xl backdrop-blur-sm">
                        <CheckCircle size={24} className="text-green-600" />
                        <span className="text-xs mt-1">Foto Cargada</span>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); setFotoBase64(null); setFotoFile(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full z-20 hover:scale-110 transition-transform shadow-sm">
                        <X size={14} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-white rounded-full shadow-sm"><Camera size={24} /></div>
                      <span className="text-sm">Tomar Fotografía</span>
                    </>
                  )}
                </button>
              </div>

              {/* UBICACIÓN */}
              <div className="md:col-span-1 flex flex-col h-full">
                <div className={`flex-1 min-h-[100px] w-full p-4 rounded-2xl border flex flex-col justify-center gap-2 transition-all ${gpsError ? 'bg-orange-50 border-orange-200' : 'bg-sky-50 border-sky-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${gpsError ? 'bg-white text-orange-500' : 'bg-white text-sky-600'}`}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-sky-800/60">Coordenadas</p>
                      <h4 className={`font-bold text-sm ${gpsError ? 'text-orange-700' : 'text-[#002244]'}`}>
                        {gpsError ? 'Error GPS' : 'Ubicación Actual'}
                      </h4>
                    </div>
                  </div>
                  <div className="mt-2 bg-white/60 rounded-xl p-2 text-center border border-white/50">
                      {gpsError || !latitud ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-bold text-orange-600">{gpsError ? 'No disponible' : 'Detectando...'}</span>
                        <button onClick={obtenerUbicacion} className="text-orange-600 hover:rotate-180 transition-transform duration-500"><RefreshCw size={14} /></button>
                      </div>
                    ) : (
                      <p className="text-xs font-mono font-bold text-slate-600 tracking-tight">
                        {latitud.toFixed(6)}, {longitud?.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* MÓDULO CAI */}
              <div className="md:col-span-2 pt-2">
                <div onClick={() => setSolicitarCai(!solicitarCai)} className={`w-full relative rounded-2xl p-4 cursor-pointer transition-all duration-300 border-2 select-none group ${solicitarCai ? 'bg-[#002244] border-[#002244] shadow-lg shadow-blue-900/20' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${solicitarCai ? 'bg-[#FFCC00] text-[#002244]' : 'bg-white text-slate-400'}`}>
                        <Siren size={24} className={solicitarCai ? 'animate-pulse' : ''} />
                      </div>
                      <div>
                        <h4 className={`font-bold text-base transition-colors ${solicitarCai ? 'text-white' : 'text-slate-700'}`}>Solicitar CAI Móvil</h4>
                        <p className={`text-xs transition-colors ${solicitarCai ? 'text-white/70' : 'text-slate-500'}`}>
                          {solicitarCai ? 'Solicitud de unidad policial activa' : '¿Requiere presencia inmediata de una unidad?'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${solicitarCai ? 'bg-[#FFCC00]' : 'bg-slate-300'}`}>
                      <div className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${solicitarCai ? 'translate-x-6 bg-[#002244]' : 'translate-x-0 bg-white'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTÓN ENVIAR */}
              <div className="md:col-span-2 pt-4">
                <button onClick={handleSubmit} disabled={loading || gpsError || !latitud} className="w-full bg-gradient-to-r from-[#FFCC00] to-[#ffdb4d] hover:to-[#ffc000] active:scale-[0.99] text-[#002244] font-extrabold text-lg py-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                  {loading ? 'ENVIANDO...' : 'ENVIAR REPORTE'}
                  {!loading && <Send size={20} />}
                </button>
                {mensaje.text && (
                  <div className={`mt-4 p-3 rounded-xl text-center font-bold text-sm border ${mensaje.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {mensaje.text}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <footer className="fixed lg:static bottom-0 w-full py-4 bg-[#002244]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none text-center border-t border-white/5 lg:border-none z-20">
        <p className="text-white/50 text-xs">© 2025 Equipo de la Seguridad</p>
      </footer>

      {showGpsModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-[350px] text-center shadow-2xl animate-fade-in-up">
            <div className="mb-4 flex justify-center">
              <div className="bg-red-100 p-4 rounded-full"><AlertTriangle size={40} className="text-red-500" /></div>
            </div>
            <h2 className="text-[#002244] text-xl font-bold mb-3">Ubicación Requerida</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Para garantizar la eficiencia y precisión de su reporte, necesitamos registrar la coordenada exacta.
            </p>
            <button onClick={obtenerUbicacion} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl mb-3 shadow-lg shadow-red-500/30 transition-colors">Reintentar Ubicación</button>
            <button onClick={() => setShowGpsModal(false)} className="w-full text-slate-400 font-semibold text-sm hover:text-slate-600 py-2">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}