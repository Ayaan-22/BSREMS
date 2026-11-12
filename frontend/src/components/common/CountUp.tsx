import { useEffect, useRef, useState } from "react";

type CountUpProps = { value: number; decimals?: number; duration?: number; prefix?: string; suffix?: string };

/** Animates from the previous value to `value` with an ease-out curve. */
export function CountUp({ value, decimals = 0, duration = 1400, prefix = "", suffix = "" }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const initial = from.current;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      from.current = value;
      return;
    }
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(initial + (value - initial) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
