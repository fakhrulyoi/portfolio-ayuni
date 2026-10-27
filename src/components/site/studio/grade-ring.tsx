"use client";
import { useEffect, useRef, useState } from "react";

/** Circular gauge for a grade such as "CGPA 3.61" (out of 4.00). Counts up when it scrolls into view. */
export function GradeRing({ value, max = 4, label }: { value: number; max?: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);
  const [on, setOn] = useState(true);
  const pct = Math.max(0, Math.min(1, value / max));
  const C = 2 * Math.PI * 34;

  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("motion-ok")) return;
    setOn(false);
    setShown(0);
    let raf = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        setOn(true);
        const t0 = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / 1400);
          const eased = 1 - Math.pow(1 - k, 3);
          setShown(value * eased);
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={ref} className="relative size-[5.5rem] shrink-0" role="img" aria-label={label}>
      <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r="34" fill="none" stroke="var(--sunken)" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={on ? C * (1 - pct) : C}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <span aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif-soft text-[1.3rem] leading-none tabular-nums text-ink">{shown.toFixed(2)}</span>
        <span className="mt-1 text-[11px] text-muted">of {max.toFixed(2)}</span>
      </span>
    </div>
  );
}
