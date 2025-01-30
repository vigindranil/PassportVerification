/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['localhost'], // Add 'localhost' as a valid domain for next/image
  },
};

export default nextConfig;
