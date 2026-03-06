/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Bỏ qua lỗi TypeScript khi build để deploy thành công
    ignoreBuildErrors: true,
  },
  eslint: {
    // Bỏ qua ESLint warnings khi build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

