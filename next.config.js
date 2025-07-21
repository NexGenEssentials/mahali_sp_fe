/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "107.23.87.13",
      "207.180.253.55",
      "api.mahaliafrica.com",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "207.180.253.55",
        port: "8090",
        pathname: "/media/car_images/**",
      },
    ],
  },
};

module.exports = nextConfig
