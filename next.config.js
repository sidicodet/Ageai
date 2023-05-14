/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.devakimis5989.workers.dev", "replicate.delivery"],
  },
  async redirects() {
    return [
      {
        source: "/launch",
        destination: "https://twitter.com/mathogram",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://github.com/sidicodet/Ageai",
        permanent: false,
      },
      {
        source: "/p",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
