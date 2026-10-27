"use client";
import { useEffect, useRef } from "react";
import { ClipboardCheck, FileText, MessagesSquare, PenTool, Presentation, Workflow, CircleDot, Code2, Database, Search } from "lucide-react";

type Step = { label: string; detail: string };

function iconFor(label: string) {
  const l = label.toLowerCase();
  if (/requirement|stakeholder|interview|discover/.test(l)) return MessagesSquare;
  if (/model|process|flow|dfd|diagram/.test(l)) return Workflow;
  if (/brs|srs|sds|spec|document/.test(l)) return FileText;
  if (/wireframe|prototype|design|ui|ux/.test(l)) return PenTool;
  if (/uat|fat|test|qa|defect/.test(l)) return ClipboardCheck;
  if (/train|handover|present|support/.test(l)) return Presentation;
  if (/develop|build|code|api/.test(l)) return Code2;
  if (/data|database|sql/.test(l)) return Database;
  if (/research|analys/.test(l)) return Search;
  return CircleDot;
}

/**
 * The working process as a winding flow line. The line draws itself as the
 * reader scrolls, and each step lights up when the line reaches it.
 */
export function ProcessRiver({ steps }: { steps: Step[] }) {
  const wrap = useRef<HTMLOListElement>(null);
  const base = useRef<SVGPathElement>(null);
  const fill = useRef<SVGPathElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const list = wrap.current;
    if (!list || !base.current || !fill.current || !svg.current) return;
    const motion = document.documentElement.classList.contains("motion-ok");
    let nodes: { el: HTMLElement; y: number }[] = [];
    let len = 0;
    let h = 1;
    let raf = 0;

    const layout = () => {
      const r = list.getBoundingClientRect();
      h = Math.max(1, r.height);
      svg.current!.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
      const pts = [...list.querySelectorAll<HTMLElement>("[data-node]")].map((el) => {
        const b = el.getBoundingClientRect();
        return { el, x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2 };
      });
      nodes = pts.map(({ el, y }) => ({ el, y }));
      if (!pts.length) return;
      let d = `M ${pts[0].x} ${Math.max(0, pts[0].y - 40)} L ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const dy = (b.y - a.y) / 2;
        d += ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
      }
      const last = pts[pts.length - 1];
      d += ` L ${last.x} ${last.y + 40}`;
      base.current!.setAttribute("d", d);
      fill.current!.setAttribute("d", d);
      len = fill.current!.getTotalLength();
      fill.current!.style.strokeDasharray = `${len}`;
      update();
    };

    const update = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const mark = window.innerHeight * 0.62;
      const p = motion ? Math.max(0, Math.min(1, (mark - r.top) / h)) : 1;
      fill.current!.style.strokeDashoffset = `${len * (1 - p)}`;
      const reach = p * h;
      for (const n of nodes) {
        if (n.y <= reach + 4) n.el.setAttribute("data-on", "");
        else n.el.removeAttribute("data-on");
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(list);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [steps.length]);

  return (
    <ol ref={wrap} className="relative mx-auto max-w-5xl">
      <svg ref={svg} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
        <path ref={base} fill="none" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
        <path ref={fill} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {steps.map((s, i) => {
        const Icon = iconFor(s.label);
        const right = i % 2 === 1;
        return (
          <li key={i} className={`relative grid grid-cols-1 py-5 lg:grid-cols-2 lg:py-0 ${i > 0 ? "lg:-mt-6" : ""}`}>
            <span
              data-node
              aria-hidden
              className={`studio-node absolute left-0 top-5 z-10 flex size-12 items-center justify-center rounded-2xl border border-line-strong bg-surface text-muted lg:top-1/2 lg:-translate-y-1/2 ${
                right ? "lg:left-[calc(50%+1.5rem)]" : "lg:left-[calc(50%-4.5rem)]"
              }`}
            >
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            <div
              className={`studio-step pl-[4.5rem] lg:pl-0 ${
                right ? "lg:col-start-2 lg:pl-[6.5rem]" : "lg:col-start-1 lg:pr-[6.5rem] lg:text-right"
              }`}
            >
              <p className="text-[13px] tabular-nums text-muted">Step {i + 1}</p>
              <h3 className="font-serif-soft mt-1 text-[1.35rem] leading-snug text-ink sm:text-[1.5rem]">{s.label}</h3>
              {s.detail && <p className={`mt-2 max-w-md text-[15px] leading-relaxed text-ink-2 ${right ? "" : "lg:ml-auto"}`}>{s.detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
