/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
    // compiler: {
    //     removeConsole: process.env.NODE_ENV === "production"
    //   },
  experimental: {
    instrumentationHook: true
  },
  // eslint: {
  //   ignoreDuringBuilds: true, // Ignore ESLint during the build process
  // }
};

// Wrap the config with the bundle analyzer
const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'false',
})(nextConfig);

export default config;
// export default nextConfig;