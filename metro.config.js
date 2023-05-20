// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Adding `.mjs` to the list of source extensions as some external libraries use this module type (e.g., immer.js)
defaultConfig.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'mjs'];

module.exports = defaultConfig;
