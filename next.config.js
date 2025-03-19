/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['ik.imagekit.io', 'res.cloudinary.com', 'storage.googleapis.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    config.module.rules.push({ test: /\.md$/, use: 'raw-loader' })
    config.module.rules.push({ test: /\.yml$/, use: 'raw-loader' })

    return config;
  },
}

module.exports = nextConfig
