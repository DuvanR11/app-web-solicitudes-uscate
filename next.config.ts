/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'estaticos.elcolombiano.com',
        port: '',
        pathname: '/**',
      },
      // Si tu backend también sirve imágenes (ej: localhost o tu servidor), agrégalo aquí también:
      {
        protocol: 'http',
        hostname: 'localhost', // O tu dominio de backend real
        port: '', // Si usas puerto específico como :3000 ponlo aquí, si no déjalo vacío
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;