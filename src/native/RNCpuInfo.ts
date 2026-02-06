import { NativeModules, Platform } from 'react-native';

interface RNCpuInfoType {
  getCpuCoreCount(): Promise<number>;
  cpuCoreCount?: number;
}

const LINKING_ERROR =
  `The package 'react-native-device-spec-info' doesn't seem to be linked. ` +
  `Make sure:\n\n` +
  (Platform.OS === 'ios' ? "- You have run 'pod install' in the ios/ directory\n" : '') +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go (native modules require a custom build)\n';

const RNCpuInfo: RNCpuInfoType = NativeModules.RNCpuInfo
  ? (NativeModules.RNCpuInfo as RNCpuInfoType)
  : (new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    ) as RNCpuInfoType);

/**
 * Gets the CPU core count from native module
 * @returns Promise resolving to number of CPU cores
 */
export const getCpuCoreCount = async (): Promise<number> => {
  try {
    return await RNCpuInfo.getCpuCoreCount();
  } catch (error) {
    if (RNCpuInfo.cpuCoreCount && RNCpuInfo.cpuCoreCount > 0) {
      return RNCpuInfo.cpuCoreCount;
    }
    console.error('[react-native-device-spec-info] Error getting CPU cores:', error);
    return 4; // Default fallback
  }
};

/**
 * Gets CPU core count synchronously from cached constant
 * Returns 4 as fallback if unavailable
 */
export const getCpuCoreCountSync = (): number => {
  return RNCpuInfo.cpuCoreCount ?? 4;
};

export default RNCpuInfo;
