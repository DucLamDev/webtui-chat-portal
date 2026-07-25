const portalBasePath = process.env.NEXT_PUBLIC_PORTAL_BASE_PATH || "";

const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  basePath: portalBasePath,
  reactStrictMode: true
};

export default nextConfig;
