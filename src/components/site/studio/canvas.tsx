"use client";
import { useEffect, useRef } from "react";
import { Frame, MapPin, MessageCircle, MousePointer2, PenTool, Type } from "lucide-react";

type Props = {
  fullName: string;
  shortName: string;
  initial: string;
  title: string;
  location: string;
  status: string;
  photo: string;
  chips: string[];
  notes: string[];
};

const NOTE_SPOTS = [
  { x: 62, y: 3, r: 4, tone: "a" },
  { x: 3, y: 58, r: -4, tone: "b" },
  { x: 71, y: 51, r: -3, tone: "c" },
  { x: 35, y: 62, r: 2, tone: "b" },
] as const;

/**
 * Hero illustration: a design canvas where a profile card is drawn with a
 * frame tool, filled in, and annotated with sticky notes. The notes can be
 * dragged around. Purely decorative (the same facts are in the page text).
 */
export function DesignCanvas({ fullName, shortName, initial, title, location, status, photo, chips, notes }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const z = useRef(10);
  const readyAt = useRef(Infinity);

  useEffect(() => {
    // The named cursor starts following the visitor's pointer once the intro has played.
    if (document.documentElement.classList.contains("motion-ok") && matchMedia("(hover: hover)").matches) readyAt.current = performance.now() + 4300;
  }, []);

  const follow = (e: React.PointerEvent) => {
    const board = boardRef.current;
    const cur = cursorRef.current;
    if (!board || !cur || e.pointerType !== "mouse" || performance.now() < readyAt.current || board.querySelector("[data-drag]")) return;
    const r = board.getBoundingClientRect();
    const x = Math.min(r.width - 70, e.clientX - r.left + 16);
    const y = Math.min(r.height - 40, e.clientY - r.top + 18);
    cur.style.transform = `translate(${x}px, ${y}px)`;
  };
  const rest = () => {
    if (cursorRef.current) cursorRef.current.style.transform = "";
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const board = boardRef.current;
    if (!board) return;
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = String(++z.current);
    el.dataset.drag = "";
    const startX = e.clientX;
    const startY = e.clientY;
    const baseX = Number(el.dataset.dx || 0);
    const baseY = Number(el.dataset.dy || 0);
    const b = board.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    // Keep the note inside the board.
    const minX = baseX - (r.left - b.left);
    const maxX = baseX + (b.right - r.right);
    const minY = baseY - (r.top - b.top);
    const maxY = baseY + (b.bottom - r.bottom);
    const move = (ev: PointerEvent) => {
      const dx = Math.max(minX, Math.min(maxX, baseX + ev.clientX - startX));
      const dy = Math.max(minY, Math.min(maxY, baseY + ev.clientY - startY));
      el.dataset.dx = String(dx);
      el.dataset.dy = String(dy);
      el.style.setProperty("--dx", `${dx}px`);
      el.style.setProperty("--dy", `${dy}px`);
    };
    const up = () => {
      delete el.dataset.drag;
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  return (
    <div className="studio-canvas-wrap relative">
      <div aria-hidden className="studio-canvas">
        {/* Window bar */}
        <div className="flex items-center gap-[1.6cqw] border-b border-line px-[3cqw] py-[2.2cqw]">
          <span className="size-[1.9cqw] rounded-full bg-line-strong" />
          <span className="size-[1.9cqw] rounded-full bg-line-strong" />
          <span className="size-[1.9cqw] rounded-full bg-line-strong" />
          <span className="ml-[2cqw] truncate text-[2.3cqw] text-muted">
            Portfolio <span className="text-line-strong">/</span> <span className="text-ink">Profile card</span>
          </span>
          <span className="ml-auto rounded-[1cqw] bg-sunken px-[1.4cqw] py-[0.5cqw] text-[2cqw] tabular-nums text-muted">100%</span>
        </div>

        <div ref={boardRef} onPointerMove={follow} onPointerLeave={rest} className="studio-board relative h-[80cqw] overflow-hidden">
          {/* Tools */}
          <div className="absolute left-[3cqw] top-[16cqw] flex flex-col gap-[0.8cqw] rounded-[2.4cqw] border border-line bg-surface p-[0.9cqw] shadow-sm">
            {[
              { Icon: MousePointer2, cls: "tool-move" },
              { Icon: Frame, cls: "tool-frame" },
              { Icon: PenTool, cls: "" },
              { Icon: Type, cls: "" },
              { Icon: MessageCircle, cls: "" },
            ].map(({ Icon, cls }, i) => (
              <span key={i} className={`studio-tool ${cls} flex size-[5.4cqw] items-center justify-center rounded-[1.6cqw] text-muted`}>
                <Icon className="size-[2.8cqw]" strokeWidth={1.8} />
              </span>
            ))}
          </div>

          {/* Frame being drawn */}
          <span className="studio-frame-label absolute left-[22cqw] top-[12.6cqw] text-[2.1cqw] font-medium text-accent-ink">Profile card</span>
          <div className="studio-frame absolute left-[22cqw] top-[17cqw] h-[38cqw] w-[54cqw] rounded-[1.2cqw] bg-surface shadow-[0_2cqw_6cqw_-3cqw_rgb(15_27_56/0.25)]">
            <div className="flex items-center gap-[2.6cqw] px-[4cqw] pt-[4cqw]">
              <span className="studio-pop relative size-[11cqw] shrink-0 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,var(--surface))]" style={{ "--i": 0 } as React.CSSProperties}>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt={`Portrait of ${fullName}`} className="size-full object-cover" />
                ) : (
                  <span className="font-serif-soft flex size-full items-center justify-center text-[5cqw] text-accent-ink">{initial}</span>
                )}
              </span>
              <span className="min-w-0">
                <span className="studio-pop font-serif-soft block truncate text-[4cqw] leading-tight text-ink" style={{ "--i": 1 } as React.CSSProperties}>
                  {shortName}
                </span>
                {title && (
                  <span className="studio-pop mt-[0.6cqw] block truncate text-[2.4cqw] text-ink-2" style={{ "--i": 2 } as React.CSSProperties}>
                    {title}
                  </span>
                )}
              </span>
            </div>
            <div className="mt-[3.2cqw] space-y-[1.6cqw] px-[4cqw]">
              {location && (
                <span className="studio-pop flex items-center gap-[1cqw] text-[2.2cqw] text-muted" style={{ "--i": 3 } as React.CSSProperties}>
                  <MapPin className="size-[2.4cqw]" /> {location}
                </span>
              )}
              {status && (
                <span className="studio-pop inline-flex max-w-full items-center gap-[1cqw] truncate rounded-full bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-[1.6cqw] py-[0.5cqw] text-[2cqw] text-ink-2" style={{ "--i": 4 } as React.CSSProperties}>
                  <span className="size-[1.2cqw] shrink-0 rounded-full bg-success" />
                  <span className="truncate">{status}</span>
                </span>
              )}
            </div>
            {chips.length > 0 && (
              <div className="absolute inset-x-[4cqw] bottom-[3.4cqw] flex gap-[1cqw]">
                {chips.map((c, i) => (
                  <span key={c} className="studio-pop truncate rounded-[1cqw] border border-line px-[1.4cqw] py-[0.5cqw] text-[1.9cqw] text-ink-2" style={{ "--i": 5 + i } as React.CSSProperties}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Selection */}
          <div className="studio-select pointer-events-none absolute left-[22cqw] top-[17cqw] h-[38cqw] w-[54cqw] rounded-[1.2cqw] border-[0.3cqw] border-accent">
            {["-left-[0.9cqw] -top-[0.9cqw]", "-right-[0.9cqw] -top-[0.9cqw]", "-bottom-[0.9cqw] -left-[0.9cqw]", "-bottom-[0.9cqw] -right-[0.9cqw]"].map((p) => (
              <span key={p} className={`absolute ${p} size-[1.5cqw] rounded-[0.3cqw] border-[0.3cqw] border-accent bg-surface`} />
            ))}
            <span className="absolute left-1/2 top-full mt-[1.4cqw] -translate-x-1/2 rounded-[0.8cqw] bg-accent px-[1.2cqw] py-[0.3cqw] text-[1.8cqw] font-medium tabular-nums text-accent-fg">
              540 × 380
            </span>
          </div>

          {/* Sticky notes (draggable) */}
          {notes.slice(0, NOTE_SPOTS.length).map((n, i) => {
            const s = NOTE_SPOTS[i];
            return (
              <div
                key={n}
                onPointerDown={onDown}
                className={`studio-note tone-${s.tone} absolute w-[22cqw] cursor-grab touch-none select-none`}
                style={{ left: `${s.x}cqw`, top: `${s.y}cqw`, "--r": `${s.r}deg`, "--i": i } as React.CSSProperties}
              >
                <span className="block rounded-[1.2cqw] px-[2cqw] pb-[2.6cqw] pt-[1.8cqw] text-[2.3cqw] font-medium leading-snug">{n}</span>
              </div>
            );
          })}

          {/* Cursor */}
          <div ref={cursorRef} className="studio-cursor pointer-events-none absolute left-0 top-0">
            <div className="studio-cursor-float">
              <svg viewBox="0 0 24 24" className="size-[4.4cqw] drop-shadow-sm">
                <path d="M4 2.5 20 11l-7.2 1.8L9.6 20z" fill="var(--accent)" stroke="var(--surface)" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              <span className="absolute left-[3.4cqw] top-[3.6cqw] whitespace-nowrap rounded-full bg-accent px-[1.6cqw] py-[0.5cqw] text-[2cqw] font-medium text-accent-fg">
                {shortName}
              </span>
            </div>
          </div>
        </div>
      </div>
      {notes.length > 0 && (
        <p aria-hidden className="studio-hint mt-3 text-center text-[13px] text-muted">
          Try dragging the sticky notes.
        </p>
      )}
    </div>
  );
}
