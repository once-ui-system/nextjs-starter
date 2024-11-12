/** 
 * @type {import('next').NextConfig} */
export default {
  basePath:'/src/app',
  //serverExternalPackages: ['@dsv911/ez'],
  //transpilePackages: ['@dsv911/ez'],
  //reactCompiler: true,
  //minify: true,
  assetPrefix: process.env.NODE_ENV == "production" ? 'https://cdn.harleenquin.com' : undefined,
  async headers()
  {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      }
    ]
  },
  reactStrictMode: false,

  httpAgentOptions: {
    keepAlive: false,
  },
/*   eslint: {
      ignoreDuringBuilds: true,
  }, */
  experimental: {
    optimizePackageImports: ['@dsv911/ez'],
   // ppr: 'incremental',
    //dynamicIO: false,
    serverActions: {
      allowedOrigins: [
        '*.darin.bet',
        'darin.bet',
        'localhost:3000',
        '*.localhost:3000',
        '*.betflix579.com',
        'betflix579.com',
        '*.bflix579.net',
        'bflix579.net',
        '*.bflix579.com',
        'bflix579.com',
        'harleenquin.com',
        '*.harleenquin.com',
        '*.ufacopp.com',
        'ufacopp.com',
      ],

    },
  },

  images: {
    //unoptimized: process.env.NODE_ENV == "production" ? true : undefined,
    loader: 'custom',
    loaderFile: '/app/api/image/loader.tsx',
    formats: ['image/avif', 'image/webp'],

    localPatterns: [
      {
        pathname: '/image/**',
        search: '',
      }, {
        pathname: '/api/image/**',
        search: '',
      }
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.dragongaming.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.imagedelivery.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.mrslotty.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.spinix.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.x-gaming.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ocrazeckyunc.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.bflix579.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bflix579.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.bflix579.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.line.me",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.betflix579.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "betflix579.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.bflix579.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ufacopp.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ufacopp.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.pic.in.th",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.darin.bet",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "darin.bet",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.line-scdn.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.prerelease-env.biz",
        port: "",
        pathname: "/**",
      },

    ],

  }

}



