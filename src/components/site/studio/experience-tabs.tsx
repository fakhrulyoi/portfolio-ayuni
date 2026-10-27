"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { Experience } from "@/lib/schemas";
import { formatRange } from "@/lib/format";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Jobs as tabs: a list of employers on the left, the selected job on the right. */
export function ExperienceTabs({ items }: { items: Experience[] }) {
  const [sel, setSel] = useState(0);
  const uid = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const list = listRef.current;
    const bar = barRef.current;
    if (!list || !bar) return;
    const place = () => {
      const t = list.querySelectorAll<HTMLElement>("[role=tab]")[sel];
      if (!t) return;
      bar.style.setProperty("--x", `${t.offsetLeft}px`);
      bar.style.setProperty("--y", `${t.offsetTop}px`);
      bar.style.setProperty("--w", `${t.offsetWidth}px`);
      bar.style.setProperty("--h", `${t.offsetHeight}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [sel]);

  const onKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = sel;
    if (e.key in keys) next = (sel + keys[e.key] + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    setSel(next);
    listRef.current?.querySelectorAll<HTMLElement>("[role=tab]")[next]?.focus();
  };

  const e = items[sel];
  const meta = [e.employment_type, e.work_mode, e.location].filter(Boolean).join(", ");

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Employers"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="studio-tabs relative -mx-5 lg:self-start flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-l lg:border-line lg:pb-0"
      >
        <span ref={barRef} aria-hidden className="studio-tabbar" />
        {items.map((x, i) => (
          <button
            key={x.id}
            id={`${uid}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === sel}
            aria-controls={`${uid}-panel`}
            tabIndex={i === sel ? 0 : -1}
            onClick={() => setSel(i)}
            className={`relative z-[1] shrink-0 rounded-2xl px-4 py-3 text-left transition-colors duration-300 lg:rounded-l-none lg:rounded-r-2xl lg:pl-5 ${
              i === sel ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <span className="block whitespace-nowrap text-[15px] font-medium lg:whitespace-normal">{x.company}</span>
            <span className="mt-0.5 block whitespace-nowrap text-[13px] tabular-nums text-muted">{formatRange(x.start_date, x.end_date, x.is_current)}</span>
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${sel}`} tabIndex={0} className="min-w-0 rounded-3xl focus-visible:outline-offset-8">
        <div key={sel} className="studio-panel-in">
          <h3 className="font-serif-soft text-[1.6rem] leading-tight text-ink sm:text-[1.9rem]">{e.role}</h3>
          <p className="mt-1.5 text-[15px] text-ink-2">
            {e.company}
            {meta && <span className="text-muted">, {meta}</span>}
          </p>
          {e.context && (
            <p className="mt-4 inline-flex rounded-xl bg-[color-mix(in_oklab,var(--accent)_9%,transparent)] px-3.5 py-1.5 text-[14px] text-accent-ink">{e.context}</p>
          )}
          {e.summary && <p className="mt-5 max-w-[65ch] text-[16px] leading-relaxed text-ink-2">{e.summary}</p>}
          {e.highlights.length > 0 && (
            <ul className="mt-6 space-y-3">
              {e.highlights.map((h, i) => (
                <li key={h} className="studio-li flex gap-3 text-[15px] leading-relaxed text-ink-2" style={{ "--i": i } as React.CSSProperties}>
                  <span aria-hidden className="mt-[3px] flex size-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-accent-ink">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="max-w-[68ch]">{h}</span>
                </li>
              ))}
            </ul>
          )}
          {e.tools.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tools and methods">
              {e.tools.map((t) => (
                <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-[13px] text-ink-2">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
