/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol : 'https',
        hostname : 'res.cloudinary.com',
        port     : '',
        pathname : '**',
      },
      {
        protocol : 'https',
        hostname : '**.public.blob.vercel-storage.com',
        port     : '',
      },
      {
        protocol : 'https',
        hostname : '**.amazonaws.com',
        port     : '',
      },
    ],
  },
  
  experimental: {
    // appDir: true,
    esmExternals: 'loose',
  },
  
  // reactStrictMode: true,
  // // swcMinify: false,
  // 
  // webpack: (config) => {
  //   config.experiments = {
  //     ...config.experiments,
  //     ...{topLevelAwait: true}
  //   }
  //   return config
  // },
}

module.exports = nextConfig
