// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'firebase/auth/react-native': require.resolve('./src/shims/firebase/auth/react-native.js'),
};

module.exports = config;
