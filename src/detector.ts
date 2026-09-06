import { Platform, Dimensions, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import type { DeviceSpec, DeviceSpecInfo } from './types';
import { getCpuCoreCount } from './native/RNCpuInfo';
import {
  configureDeviceSpec as applyConfig,
  getDeviceSpecConfig,
  resetDeviceSpecConfig as resetConfig,
} from './config';
import type { ScoreThresholds, ScoreWeights } from './scoring';
import {
  calculateScore as scoreHardware,
  estimateScreenSizeInches,
  getSpecFromScore as specFromScore,
} from './scoring';

export { calculateScore, getSpecFromScore, estimateScreenSizeInches } from './scoring';
export { getDeviceSpecConfig } from './config';

export const getScreenSize = (): number => {
  const { width, height } = Dimensions.get('screen');
  return estimateScreenSizeInches(width, height, Platform.OS);
};

let inFlight: Promise<DeviceSpecInfo> | null = null;
let cached: DeviceSpecInfo | null = null;

const detectDeviceSpec = async (): Promise<DeviceSpecInfo> => {
  const totalMemoryBytes = await DeviceInfo.getTotalMemory();
  const totalMemoryGB = totalMemoryBytes / 1024 ** 3;
  const cpuCores = await getCpuCoreCount();
  const screenSize = getScreenSize();
  const pixelDensity = PixelRatio.get();
  const osVersion = DeviceInfo.getSystemVersion();
  const isTablet = DeviceInfo.isTablet();
  const { weights, thresholds } = getDeviceSpecConfig();

  const details = {
    totalMemory: parseFloat(totalMemoryGB.toFixed(2)),
    screenSize: parseFloat(screenSize.toFixed(2)),
    pixelDensity,
    osVersion,
    isTablet,
    cpuCores,
  };

  const score = scoreHardware(
    totalMemoryGB,
    cpuCores,
    screenSize,
    pixelDensity,
    osVersion,
    isTablet,
    Platform.OS,
    weights
  );

  return { spec: specFromScore(score, thresholds), score, details };
};

export const getDeviceSpec = async (): Promise<DeviceSpecInfo> => {
  if (cached) {
    return cached;
  }

  if (!inFlight) {
    inFlight = detectDeviceSpec()
      .then((result) => {
        cached = result;
        inFlight = null;
        return result;
      })
      .catch((error) => {
        inFlight = null;
        console.error(
          '[react-native-device-spec-info] Error detecting device spec:',
          error
        );
        throw error instanceof Error
          ? error
          : new Error('Failed to detect device spec');
      });
  }

  return inFlight;
};

export const clearDeviceSpecCache = (): void => {
  cached = null;
  inFlight = null;
};

export const configureDeviceSpec = (options: {
  weights?: Partial<ScoreWeights>;
  thresholds?: Partial<ScoreThresholds>;
}) => {
  const next = applyConfig(options);
  clearDeviceSpecCache();
  return next;
};

export const resetDeviceSpecConfig = (): void => {
  resetConfig();
  clearDeviceSpecCache();
};

export const getDeviceSpecSimple = async (): Promise<DeviceSpec> => {
  const result = await getDeviceSpec();
  return result.spec;
};
