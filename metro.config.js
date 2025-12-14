// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for Windows path issues with node:sea
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
};

module.exports = config;


