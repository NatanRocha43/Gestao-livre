/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione esta configuração para resolver o limite de tamanho da Vercel
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;