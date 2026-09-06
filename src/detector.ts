import { Platform, Dimensions, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import type { DeviceSpec, DeviceSpecInfo } from './types';
import { getCpuCoreCount } from './native/RNCpuInfo';

/**
 * Estimated diagonal screen size in inches.
 *
 * RN `Dimensions` are in density-independent units (dp on Android, points on iOS).
 * A point/dp is ~1/163" on iOS and ~1/160" on Android. Do not divide by scale;
 * that double-counts pixel density and under-reports inches on retina devices.
 *
 * This is an estimate, not a vendor-advertised panel size.
 */
export const getScreenSize = (): number => {
  const { width, height } = Dimensions.get('screen');
  const ppiBase = Platform.OS === 'ios' ? 163 : 160;
  const widthInches = width / ppiBase;
  const heightInches = height / ppiBase;
  return Math.sqrt(widthInches ** 2 + heightInches ** 2);
};

/**
 * Scoring weights: RAM 35%, CPU cores 25%, display 25%, OS version 15%.
 */
export const calculateScore = (
  totalMemoryGB: number,
  cpuCores: number,
  screenSize: number,
  pixelDensity: number,
  osVersion: string,
  isTablet: boolean
): number => {
  let score = 0;

  // RAM scoring (35% weight)
  if (totalMemoryGB >= 12) score += 35;
  else if (totalMemoryGB >= 8) score += 30;
  else if (totalMemoryGB >= 6) score += 23;
  else if (totalMemoryGB >= 4) score += 16;
  else if (totalMemoryGB >= 3) score += 10;
  else if (totalMemoryGB >= 2) score += 5;

  // CPU cores scoring (25% weight)
  if (cpuCores >= 8) score += 25;
  else if (cpuCores >= 6) score += 18;
  else if (cpuCores >= 4) score += 10;
  else score += 3;

  // Screen & display scoring (25% weight)
  if (pixelDensity >= 3) score += 13;
  else if (pixelDensity >= 2) score += 8;
  else score += 4;

  if (screenSize >= 6.5 || isTablet) score += 12;
  else if (screenSize >= 6) score += 8;
  else score += 4;

  // OS version scoring (15% weight)
  if (Platform.OS === 'android') {
    const androidVersion = parseInt(osVersion, 10);
    if (androidVersion >= 14) score += 15;
    else if (androidVersion >= 13) score += 12;
    else if (androidVersion >= 11) score += 8;
    else if (androidVersion >= 9) score += 4;
  } else if (Platform.OS === 'ios') {
    const iosVersion = parseFloat(osVersion);
    if (iosVersion >= 17) score += 15;
    else if (iosVersion >= 16) score += 12;
    else if (iosVersion >= 14) score += 8;
    else if (iosVersion >= 12) score += 4;
  }

  return score;
};

export const getSpecFromScore = (score: number): DeviceSpec => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
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

  const details = {
    totalMemory: parseFloat(totalMemoryGB.toFixed(2)),
    screenSize: parseFloat(screenSize.toFixed(2)),
    pixelDensity,
    osVersion,
    isTablet,
    cpuCores,
  };

  const score = calculateScore(
    totalMemoryGB,
    cpuCores,
    screenSize,
    pixelDensity,
    osVersion,
    isTablet
  );

  return { spec: getSpecFromScore(score), details };
};

/**
 * Detects device specification from hardware.
 * Results are cached for the process lifetime. Hardware does not change mid-session.
 *
 * @throws when DeviceInfo or the native CPU module cannot be read
 */
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

/**
 * Clears the in-memory detection cache. Intended for tests.
 */
export const clearDeviceSpecCache = (): void => {
  cached = null;
  inFlight = null;
};

/**
 * Simplified version that returns only the spec category
 */
export const getDeviceSpecSimple = async (): Promise<DeviceSpec> => {
  const result = await getDeviceSpec();
  return result.spec;
};
