/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol : 'https',
        hostname : 'drive.google.com',
        port     : '',
        pathname : '**',
      },
      {
        protocol : 'https',
        hostname : '**.googleusercontent.com',
        port     : '',
        pathname : '**',
      },
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
