/** @type {import('next').NextConfig} */
const nextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   ];
  // },
  images: {
    domains: ['localhost', '13.235.73.233', 'wbpassportverify.link'], // Add 'localhost' as a valid domain for next/image
  },
};

export default nextConfig;
