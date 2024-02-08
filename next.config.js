/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "plus.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;
