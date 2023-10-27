/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: { appDir: true },
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://table-tennis-three.vercel.app/",
        permanent: true,
      },
    ];
  },
};
