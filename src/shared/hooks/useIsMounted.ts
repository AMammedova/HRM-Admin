import { useEffect, useState } from 'react';

/**
 * Hook to check if component is mounted (client-side only)
 * Useful for preventing hydration errors with browser APIs
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMounted = useIsMounted();
 *   
 *   if (!isMounted) {
 *     return <Skeleton />;
 *   }
 *   
 *   return <div>{window.innerWidth}</div>;
 * }
 * ```
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}


