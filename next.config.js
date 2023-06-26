/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'drive.google.com',
    ],
  },
  
  experimental: {
    appDir: true,
    esmExternals: 'loose',
  },
  
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      ...{topLevelAwait: true}
    }
    return config
  },
}

module.exports = nextConfig
