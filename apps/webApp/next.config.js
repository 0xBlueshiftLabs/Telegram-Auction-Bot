const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript:{
    ignoreBuildErrors: true,
  },
  // except for webpack, other parts are left as generated
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 5000,
      followSymlinks:true
    }
    config.plugins.push(
      new webpack.optimize.SplitChunksPlugin({chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 100,
      maxInitialRequests: 100,
      enforceSizeThreshold: 50000,
      maxSize:50000,
    })
    )
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config
  },
  experimental: {
    externalDir: true,
    esmExternals: true,
  },
  basePath:"/webApp",
  transpilePackages: ['shared'],
}

module.exports = nextConfig
