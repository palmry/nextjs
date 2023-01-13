/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["wsc"],
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
