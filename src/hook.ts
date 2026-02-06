import { useState, useEffect } from 'react';
import { getDeviceSpec } from './detector';
import type { DeviceSpec, DeviceSpecInfo, UseDeviceSpecReturn } from './types';

/**
 * React hook to detect and categorize device specifications
 * 
 * @returns {UseDeviceSpecReturn} Device specification information with loading and error states
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { spec, details, isLoading } = useDeviceSpec();
 *   
 *   if (isLoading) return <Loading />;
 *   
 *   return (
 *     <View>
 *       <Text>Device Spec: {spec}</Text>
 *       {spec === 'low' && <SimplifiedUI />}
 *       {spec === 'mid' && <StandardUI />}
 *       {spec === 'high' && <EnhancedUI />}
 *     </View>
 *   );
 * }
 * ```
 */
export const useDeviceSpec = (): UseDeviceSpecReturn => {
  const [spec, setSpec] = useState<DeviceSpec | null>(null);
  const [details, setDetails] = useState<DeviceSpecInfo['details'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const detectDeviceSpec = async () => {
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
          // Fallback to mid-spec on error
          setSpec('mid');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    detectDeviceSpec();

    return () => {
      isMounted = false;
    };
  }, []);

  return { spec, details, isLoading, error };
};

/**
 * Simplified hook that returns only the spec category
 * 
 * @returns {DeviceSpec | null} Device specification category
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const spec = useDeviceSpecSimple();
 *   
 *   if (!spec) return <Loading />;
 *   
 *   return <View>{spec === 'high' && <HighQualityFeature />}</View>;
 * }
 * ```
 */
export const useDeviceSpecSimple = (): DeviceSpec | null => {
  const { spec } = useDeviceSpec();
  return spec;
};
