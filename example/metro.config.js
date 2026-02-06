const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const libraryPath = path.resolve(__dirname, '..');

const config = {
  watchFolders: [libraryPath],
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (name === 'react-native-device-spec-info') {
            return path.join(libraryPath, 'lib');
          }
          return path.join(process.cwd(), `node_modules/${name}`);
        },
      }
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
