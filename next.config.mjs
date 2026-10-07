/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  allowedDevOrigins: ['toolstest.prgsn.dev'],
};

export default nextConfig;
