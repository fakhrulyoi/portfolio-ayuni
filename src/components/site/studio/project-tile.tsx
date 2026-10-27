"use client";
import { useRef } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProjectVisual } from "../project-visual";
import { Links, ProjectDetails, Tech } from "../project-card";
import type { Project } from "@/lib/schemas";
import { storageUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Project card whose preview tilts toward the pointer. Opens the full details in a dialog. */
export function ProjectTile({ p, wide = false }: { p: Project; wide?: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const meta = [p.category, p.year].filter(Boolean).join(", ");

  const onMove = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || e.pointerType !== "mouse" || !document.documentElement.classList.contains("motion-ok")) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
  };
  const onLeave = () => {
    stage.current?.style.setProperty("--rx", "0deg");
    stage.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <Dialog>
      <article
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={cn(
          "studio-tile group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[0_30px_60px_-36px_rgb(15_27_56/0.45)]",
          wide && "lg:flex-row",
        )}
      >
        <div className={cn("studio-stage relative overflow-hidden p-6 sm:p-8", wide ? "lg:w-[56%] lg:p-10" : "")}>
          <div ref={stage} className="studio-stage-inner relative aspect-[5/3] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_40px_-26px_rgb(15_27_56/0.5)]">
            {p.image_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={storageUrl(p.image_path)} alt={p.image_alt || `Screenshot of ${p.title}`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            ) : (
              <div className="h-full w-full p-3">
                <ProjectVisual kind={p.visual} />
              </div>
            )}
          </div>
          {p.confidential && (
            <span className="absolute left-9 top-9 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/95 px-2.5 py-1 text-[12px] text-ink-2 shadow-sm sm:left-11 sm:top-11">
              <Lock className="size-3" aria-hidden />
              Illustration, client work
            </span>
          )}
        </div>
        <div className={cn("flex flex-1 flex-col gap-3 px-6 pb-6 sm:px-8 sm:pb-8", wide && "lg:justify-center lg:py-10 lg:pl-2 lg:pr-10")}>
          {meta && <p className="text-[13px] text-muted">{meta}</p>}
          <h3 className={cn("font-serif-soft leading-snug text-ink", wide ? "text-[1.5rem] sm:text-[1.75rem]" : "text-[1.35rem]")}>{p.title}</h3>
          {p.summary && <p className="text-[15px] leading-relaxed text-ink-2">{p.summary}</p>}
          <div className="mt-auto space-y-4 pt-3">
            <Tech items={p.tech} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative z-[2]">
                <Links p={p} />
              </div>
              <DialogTrigger className="studio-open relative z-[1] inline-flex items-center gap-1.5 rounded-full bg-sunken px-4 py-2 text-sm font-medium text-ink transition-colors after:absolute after:inset-[-100vmax] after:content-[''] hover:bg-[color-mix(in_oklab,var(--accent)_14%,var(--sunken))]">
                See my role
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                <span className="sr-only">in {p.title}</span>
              </DialogTrigger>
            </div>
          </div>
        </div>
      </article>
      <DialogContent>
        <ProjectDetails p={p} />
      </DialogContent>
    </Dialog>
  );
}
