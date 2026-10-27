"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { useActiveSection } from "../active-section";
import { cn } from "@/lib/utils";

type NavItem = { id: string; label: string };
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Floating pill navigation with a highlight that slides to the section in view. */
export function StudioHeader({ name, initial, nav, allowToggle }: { name: string; initial: string; nav: NavItem[]; allowToggle: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inSections, setInSections] = useState(false);
  const active = useActiveSection(nav.map((n) => n.id));
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setInSections(window.scrollY > window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useIsoLayoutEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const place = () => {
      const a = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
      if (!a || !inSections) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.opacity = "1";
      pill.style.width = `${a.offsetWidth}px`;
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, inSections]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="sticky top-3 z-40 px-3 sm:top-4">
      <header
        className={cn(
          "studio-bar mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border pl-2 pr-2 transition-[box-shadow,background-color,border-color] duration-300 lg:w-fit lg:max-w-none",
          scrolled || open ? "border-line bg-surface/90 shadow-[0_12px_40px_-18px_rgb(15_27_56/0.35)] backdrop-blur-md" : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 text-[15px] font-semibold tracking-tight text-ink">
          <span aria-hidden className="font-serif-soft flex size-9 items-center justify-center rounded-full bg-accent text-[17px] font-medium text-accent-fg">
            {initial}
          </span>
          {name}
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul ref={listRef} className="relative flex items-center gap-0.5">
            <span ref={pillRef} aria-hidden className="studio-navpill absolute left-0 top-0 h-full rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] opacity-0" />
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  data-id={n.id}
                  href={`#${n.id}`}
                  aria-current={active === n.id && inSections ? "location" : undefined}
                  className={cn(
                    "block rounded-full px-3.5 py-2 text-sm transition-colors duration-300 hover:text-ink",
                    active === n.id && inSections ? "text-accent-ink" : "text-muted",
                  )}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          {allowToggle && <ThemeToggle />}
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-sunken lg:hidden"
            aria-expanded={open}
            aria-controls="studio-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>
      {open && (
        <nav id="studio-menu" aria-label="Mobile" className="studio-menu mx-auto mt-2 max-w-6xl rounded-3xl border border-line bg-surface p-2 shadow-[0_24px_60px_-24px_rgb(15_27_56/0.4)] lg:hidden">
          <ul className="grid grid-cols-2 gap-1">
            {nav.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties} className="studio-menu-item">
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-[15px] transition-colors hover:bg-sunken",
                    active === n.id && inSections ? "bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-accent-ink" : "text-ink",
                  )}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
