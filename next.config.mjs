// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
        webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
            config.module.rules.push({
            test: /\.html$/,
            use: 'html-loader',
          });
          return config;
        },
};

export default nextConfig;


  