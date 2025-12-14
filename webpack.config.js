const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['expo-modules-core'],
      },
    },
    argv
  );

  // Add fallbacks for Node.js core modules that Webpack 5 doesn't polyfill by default
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false,
    stream: false,
    buffer: false,
    util: false,
    assert: false,
    http: false,
    https: false,
    os: false,
    url: false,
    zlib: false,
  };

  return config;
};

