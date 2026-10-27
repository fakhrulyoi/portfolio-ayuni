"use client";
import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

/** Email address as a large link, with a copy button that confirms in place. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${email}`}
        className="group inline-flex min-w-0 items-center gap-3 rounded-full border border-line bg-surface py-2 pl-2 pr-5 text-[15px] font-medium text-ink transition-colors hover:border-line-strong sm:text-base"
      >
        <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-transform duration-300 group-hover:-rotate-12">
          <Mail className="size-4" />
        </span>
        <span className="truncate">{email}</span>
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard not available */
          }
        }}
        className="press inline-flex h-[3.25rem] items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-line-strong"
      >
        {copied ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
