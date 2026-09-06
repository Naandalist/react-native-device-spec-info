export type DeviceSpec = 'low' | 'mid' | 'high';

export interface DeviceSpecInfo {
  spec: DeviceSpec;
  score: number;
  details: {
    totalMemory: number;
    screenSize: number;
    pixelDensity: number;
    osVersion: string;
    isTablet: boolean;
    cpuCores: number;
  };
}

export interface UseDeviceSpecReturn {
  spec: DeviceSpec | null;
  score: number | null;
  details: DeviceSpecInfo['details'] | null;
  isLoading: boolean;
  error: Error | null;
}
