import { useEffect, useEffectEvent, useState } from 'react';

const TICK_MS = 1000;

// Seconds left until `deadline` (ms timestamp), ticking every second; null when not running.
export function useCountdown(deadline: number | null, onElapsed?: () => void) {
  const [now, setNow] = useState(() => Date.now());
  const handleElapsed = useEffectEvent(() => onElapsed?.());

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= deadline) {
        window.clearInterval(intervalId);
        handleElapsed();
      }
    };
    const intervalId = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(intervalId);
  }, [deadline]);

  if (deadline === null) return null;
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
