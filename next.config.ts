import type { NextConfig } from 'next';
const config: NextConfig = {
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: { '/api/**/*': ['./projects/**/*'] },
  poweredByHeader: false,
};
export default config;
