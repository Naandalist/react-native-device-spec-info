module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: './android',
        packageImportPath: 'import com.devicespecdetector.RNCpuInfoPackage;',
        packageInstance: 'new RNCpuInfoPackage()',
      },
      ios: {},
    },
  },
};
