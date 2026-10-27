"use client";
import { useEffect, useRef } from "react";

/**
 * Orbit hero background: a living system map. Labelled nodes (the owner's
 * actual artefacts) drift slowly, link up when close, and small data packets
 * travel along the links. Nodes ease away from the pointer. Pauses when off
 * screen; draws a single still frame for reduced-motion visitors.
 */
type Node = { x: number; y: number; vx: number; vy: number; r: number; label?: string; hue: 0 | 1 };
type Packet = { a: number; b: number; t: number; speed: number };

export function SystemMap({ labels, className }: { labels: string[]; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = document.documentElement.classList.contains("motion-ok");
    let accent = "#3B82F6", ion = "#38D9F5", ink = "#E8F0FF";
    const readColors = () => {
      const css = getComputedStyle(canvas);
      accent = css.getPropertyValue("--accent").trim() || accent;
      ion = css.getPropertyValue("--ion").trim() || ion;
      ink = css.getPropertyValue("--ink").trim() || ink;
    };
    readColors();
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "ui-monospace";

    let w = 0, h = 0, dpr = 1, nodes: Node[] = [], packets: Packet[] = [];
    let raf = 0, visible = true, last = performance.now();
    const born = performance.now();
    const pointer = { x: -9999, y: -9999 };

    const build = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(16, Math.min(64, Math.round((w * h) / (w < 640 ? 24000 : 16000))));
      const seed = (i: number) => {
        const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
        return s - Math.floor(s);
      };
      nodes = Array.from({ length: count }, (_, i) => {
        // Labels only where there's room beside the text (wide screens).
        const labelled = w >= 900 && i < labels.length;
        // Labelled nodes sit away from the text column on wide screens.
        const minX = labelled && w > 900 ? 0.5 : 0.04;
        return {
          x: (minX + seed(i + 1) * (0.96 - minX)) * w,
          y: (0.08 + seed(i + 101) * 0.84) * h,
          vx: (seed(i + 201) - 0.5) * 0.12,
          vy: (seed(i + 301) - 0.5) * 0.12,
          r: labelled ? 3.2 : 1.2 + seed(i + 401) * 1.4,
          label: labelled ? labels[i] : undefined,
          hue: (i % 3 === 0 ? 1 : 0) as 0 | 1,
        };
      });
      packets = [];
    };

    const LINK = () => Math.min(170, Math.max(110, w / 9));

    const draw = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const intro = motion ? Math.max(0, Math.min(1, (now - born) / 1400)) : 1;
      ctx.clearRect(0, 0, w, h);
      const link = LINK();

      // Move
      if (motion) {
        for (const n of nodes) {
          const dx = n.x - pointer.x, dy = n.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140 && d2 > 1) {
            const f = (1 - Math.sqrt(d2) / 140) * 0.06;
            n.vx += (dx / Math.sqrt(d2)) * f;
            n.vy += (dy / Math.sqrt(d2)) * f;
          }
          n.vx *= 0.985;
          n.vy *= 0.985;
          const base = 0.05;
          if (Math.abs(n.vx) < base) n.vx += (Math.random() - 0.5) * 0.01;
          if (Math.abs(n.vy) < base) n.vy += (Math.random() - 0.5) * 0.01;
          n.x += n.vx * dt * 0.06;
          n.y += n.vy * dt * 0.06;
          if (n.x < 8 || n.x > w - 8) n.vx *= -1;
          if (n.y < 8 || n.y > h - 8) n.vy *= -1;
          n.x = Math.max(8, Math.min(w - 8, n.x));
          n.y = Math.max(8, Math.min(h - 8, n.y));
        }
      }

      // Links
      const pairs: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            const alpha = (1 - d / link) * 0.5 * intro;
            ctx.strokeStyle = (a.label || b.label ? accent : ion) + Math.round(alpha * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = a.label && b.label ? 1.2 : 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(a.x + (b.x - a.x) * intro, a.y + (b.y - a.y) * intro);
            ctx.stroke();
            pairs.push([i, j]);
          }
        }
        // pointer link
        const n = nodes[i];
        const pd = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        if (pd < 180) {
          ctx.strokeStyle = ion + Math.round((1 - pd / 180) * 0.55 * 255).toString(16).padStart(2, "0");
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      // Packets travel along existing links
      if (motion && intro >= 1) {
        if (packets.length < 7 && pairs.length && Math.random() < 0.04) {
          const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
          packets.push(Math.random() < 0.5 ? { a, b, t: 0, speed: 0.0007 + Math.random() * 0.0006 } : { a: b, b: a, t: 0, speed: 0.0007 + Math.random() * 0.0006 });
        }
        packets = packets.filter((p) => {
          p.t += p.speed * dt;
          const A = nodes[p.a], B = nodes[p.b];
          if (p.t >= 1 || Math.hypot(A.x - B.x, A.y - B.y) > link) return false;
          const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
          g.addColorStop(0, ion);
          g.addColorStop(1, ion + "00");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });
      }

      // Nodes and labels
      ctx.font = `500 11px ${mono}, ui-monospace, monospace`;
      for (const n of nodes) {
        const col = n.hue ? ion : accent;
        if (n.label) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 16);
          g.addColorStop(0, col + "66");
          g.addColorStop(1, col + "00");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, Math.max(0.01, 16 * intro), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = col;
        ctx.globalAlpha = intro;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.label) {
          ctx.fillStyle = ink;
          ctx.globalAlpha = 0.72 * intro;
          ctx.fillText(n.label, n.x + 9, n.y + 4);
        }
        ctx.globalAlpha = 1;
      }

      if (motion && visible && !document.hidden) raf = requestAnimationFrame(draw);
      else raf = 0;
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    build();
    start();

    const ro = new ResizeObserver(() => {
      build();
      if (!motion) draw(performance.now());
      else start();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && motion) start();
    });
    io.observe(canvas);
    const host = canvas.parentElement!;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const leave = () => {
      pointer.x = pointer.y = -9999;
    };
    const onVis = () => !document.hidden && motion && start();
    // Re-read colours when the visitor switches light/dark.
    const mo = new MutationObserver(() => {
      readColors();
      if (!motion) draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [labels]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
