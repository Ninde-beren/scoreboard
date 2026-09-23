type TimeoutScheduler = (fn: () => void, delayMs: number) => ReturnType<typeof setTimeout>;

export const displayError = (
  setOpenError: any,
  setErrorText: any,
  setError: any,
  message: string,
  scheduleTimeout: TimeoutScheduler
) => {
  setOpenError(true);
  setErrorText(message);
  setError(true);
  scheduleTimeout(() => {
    setOpenError(false);
    setError(false);
  }, 2000);
};

export const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (value === null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};
