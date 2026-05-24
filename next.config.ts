import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "joocare.com",
          },
        ],
        destination: "https://www.joocare.com/:path*",
        permanent: true,
        basePath: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "joocare.nami-tec.com",
      },
      {
        protocol: "https",
        hostname: "admin.joocare.com",
      },
      {
        protocol: "http",
        hostname: "admin.joocare.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};


const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
