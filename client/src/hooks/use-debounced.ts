import { useEffect, useState } from "react";

export const useDebounced = <T>(value: T, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timeout);
  }, [delay, value]);

  return debounced;
};
