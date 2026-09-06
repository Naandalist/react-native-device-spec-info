export {
  getDeviceSpec,
  getDeviceSpecSimple,
  clearDeviceSpecCache,
  calculateScore,
  getSpecFromScore,
  getScreenSize,
} from './detector';
export { useDeviceSpec, useDeviceSpecSimple } from './hook';
export { getCpuCoreCount, getCpuCoreCountSync } from './native/RNCpuInfo';
export type { DeviceSpec, DeviceSpecInfo, UseDeviceSpecReturn } from './types';
