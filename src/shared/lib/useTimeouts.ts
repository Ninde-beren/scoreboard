import { useCallback, useEffect, useRef } from 'react';

type TimeoutHandle = ReturnType<typeof setTimeout>;
type TimeoutFn = () => void;

export const useTimeouts = () => {
  const timeoutsRef = useRef<TimeoutHandle[]>([]);

  const setSafeTimeout = useCallback((fn: TimeoutFn, delayMs: number) => {
    const timeoutId = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((id) => id !== timeoutId);
      fn();
    }, delayMs);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  return { setSafeTimeout };
};
