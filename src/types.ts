/**
 * Device specification category
 */
export type DeviceSpec = 'low' | 'mid' | 'high';

/**
 * Detailed device specification information
 */
export interface DeviceSpecInfo {
  /** Device specification category */
  spec: DeviceSpec;
  /** Detailed hardware information */
  details: {
    /** Total memory in GB */
    totalMemory: number;
    /** Screen size in inches (diagonal) */
    screenSize: number;
    /** Pixel density scale */
    pixelDensity: number;
    /** Operating system version */
    osVersion: string;
    /** Whether device is a tablet */
    isTablet: boolean;
    /** Number of CPU cores */
    cpuCores: number;
  };
}

/**
 * Return type for useDeviceSpec hook
 */
export interface UseDeviceSpecReturn {
  /** Device specification category */
  spec: DeviceSpec | null;
  /** Detailed hardware information */
  details: DeviceSpecInfo['details'] | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
}
