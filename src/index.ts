export {
  getDeviceSpec,
  getDeviceSpecSimple,
  clearDeviceSpecCache,
  getScreenSize,
  calculateScore,
  getSpecFromScore,
  estimateScreenSizeInches,
  configureDeviceSpec,
  resetDeviceSpecConfig,
  getDeviceSpecConfig,
} from './detector';
export { useDeviceSpec, useDeviceSpecSimple } from './hook';
export { getCpuCoreCount, getCpuCoreCountSync } from './native/RNCpuInfo';
export { DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS } from './scoring';
export type { ScoreWeights, ScoreThresholds, PlatformOS } from './scoring';
export type { DeviceSpec, DeviceSpecInfo, UseDeviceSpecReturn } from './types';
