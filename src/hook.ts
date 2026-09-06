import { useState, useEffect } from 'react';
import { getDeviceSpec } from './detector';
import type { DeviceSpec, DeviceSpecInfo, UseDeviceSpecReturn } from './types';

/**
 * React hook to detect and categorize device specifications.
 *
 * `spec` stays `null` until detection succeeds. Failures populate `error`
 * and do not invent a `'mid'` category.
 */
export const useDeviceSpec = (): UseDeviceSpecReturn => {
  const [spec, setSpec] = useState<DeviceSpec | null>(null);
  const [details, setDetails] = useState<DeviceSpecInfo['details'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const detect = async () => {
      try {
        setIsLoading(true);
        const result = await getDeviceSpec();

        if (isMounted) {
          setSpec(result.spec);
          setDetails(result.details);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setSpec(null);
          setDetails(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    detect();

    return () => {
      isMounted = false;
    };
  }, []);

  return { spec, details, isLoading, error };
};

/**
 * Simplified hook that returns only the spec category (`null` while loading or on error).
 */
export const useDeviceSpecSimple = (): DeviceSpec | null => {
  const { spec } = useDeviceSpec();
  return spec;
};
