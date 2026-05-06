/** @type {import('next').NextConfig} */
const nextConfig = {
  // API routes use Node.js runtime (required by postgres package).
  // Do not set `runtime = 'edge'` in any route that touches the DB.

  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',          value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // 'unsafe-eval' needed by Next.js dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      {
        // Cache-Control for API routes (also set per-route for finer control)
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=30, stale-while-revalidate=60' },
        ],
      },
    ];
  },
};

export default nextConfig;
