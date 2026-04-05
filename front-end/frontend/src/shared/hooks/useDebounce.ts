import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing values
 * Returns a debounced version of the input value after a specified delay
 * Usage:
 *   const debouncedEmail = useDebounce(email, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
