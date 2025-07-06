/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configurações para o Vercel
  images: {
    domains: [],
  },
  // Configuração para funcionar bem no Vercel
  trailingSlash: false,
  // Remove console.log em produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig