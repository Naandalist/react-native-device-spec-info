import { useState, useEffect } from 'react';
import { getDeviceSpec } from './detector';
import type { DeviceSpec, DeviceSpecInfo, UseDeviceSpecReturn } from './types';

export const useDeviceSpec = (): UseDeviceSpecReturn => {
  const [spec, setSpec] = useState<DeviceSpec | null>(null);
  const [score, setScore] = useState<number | null>(null);
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
          setScore(result.score);
          setDetails(result.details);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setSpec(null);
          setScore(null);
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

  return { spec, score, details, isLoading, error };
};

export const useDeviceSpecSimple = (): DeviceSpec | null => {
  const { spec } = useDeviceSpec();
  return spec;
};
