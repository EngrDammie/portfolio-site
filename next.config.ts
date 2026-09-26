import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Authorize your phone and local Wi-Fi devices to run interactive dev scripts
  allowedDevOrigins: ['192.168.19.20', '192.168.*', 'localhost:3000'],
};

export default nextConfig;