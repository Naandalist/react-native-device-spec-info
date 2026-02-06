import { Platform, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import type { DeviceSpec, DeviceSpecInfo } from './types';
import { getCpuCoreCount } from './native/RNCpuInfo';

/**
 * Calculates screen size in inches (diagonal)
 */
const getScreenSize = (): number => {
  const { width, height } = Dimensions.get('screen');
  const scale = Dimensions.get('screen').scale;
  
  const widthInches = width / (scale * 160); // 160 is Android's baseline DPI
  const heightInches = height / (scale * 160);
  
  return Math.sqrt(widthInches ** 2 + heightInches ** 2);
};

/**
 * Calculates device specification score based on hardware
 * Scoring weights: RAM (35%), CPU Cores (25%), Screen/Display (25%), OS Version (15%)
 */
const calculateScore = (
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
  else score += 0;

  // CPU Cores scoring (25% weight)
  if (cpuCores >= 8) score += 25;
  else if (cpuCores >= 6) score += 18;
  else if (cpuCores >= 4) score += 10;
  else score += 3;

  // Screen & Display scoring (25% weight)
  if (pixelDensity >= 3) score += 13;
  else if (pixelDensity >= 2) score += 8;
  else score += 4;

  if (screenSize >= 6.5 || isTablet) score += 12;
  else if (screenSize >= 6) score += 8;
  else score += 4;

  // OS Version scoring (15% weight)
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

/**
 * Determines device specification category based on score
 */
const getSpecFromScore = (score: number): DeviceSpec => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
};

/**
 * Determines device specification category based on hardware characteristics
 * 
 * @returns {Promise<DeviceSpecInfo>} Device specification information
 * 
 * @example
 * ```typescript
 * const { spec, details } = await getDeviceSpec();
 * console.log(spec); // 'low' | 'mid' | 'high'
 * console.log(details.totalMemory); // 6.5 GB
 * ```
 */
export const getDeviceSpec = async (): Promise<DeviceSpecInfo> => {
  try {
    // Get device information
    const totalMemoryBytes = await DeviceInfo.getTotalMemory();
    const totalMemoryGB = totalMemoryBytes / (1024 ** 3);
    const cpuCores = await getCpuCoreCount();
    const screenSize = getScreenSize();
    const pixelDensity = Dimensions.get('screen').scale;
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

    // Calculate score and determine spec
    const score = calculateScore(
      totalMemoryGB,
      cpuCores,
      screenSize,
      pixelDensity,
      osVersion,
      isTablet
    );
    const spec = getSpecFromScore(score);

    return { spec, details };
  } catch (error) {
    console.error('[react-native-device-spec-info] Error detecting device spec:', error);
    // Default to mid-spec on error
    return {
      spec: 'mid',
      details: {
        totalMemory: 0,
        screenSize: 0,
        pixelDensity: 0,
        osVersion: '',
        isTablet: false,
        cpuCores: 4,
      },
    };
  }
};

/**
 * Simplified version that returns only the spec category
 * 
 * @returns {Promise<DeviceSpec>} Device specification category
 * 
 * @example
 * ```typescript
 * const spec = await getDeviceSpecSimple();
 * if (spec === 'low') {
 *   // Use low-quality assets
 * }
 * ```
 */
export const getDeviceSpecSimple = async (): Promise<DeviceSpec> => {
  const result = await getDeviceSpec();
  return result.spec;
};
