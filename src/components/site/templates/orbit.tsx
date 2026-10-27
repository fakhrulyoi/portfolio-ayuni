import { ArrowDown, Download, FileText, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime, formatRange, initials, parseStep, storageUrl } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../header";
import { ExperienceItem } from "../experience-item";
import { ProjectCard } from "../project-card";
import { ContactForm } from "../contact-form";
import { Pipeline } from "../pipeline";
import { SystemMap } from "../system-map";
import { externalProps, type TemplateProps } from "../model";
import { BackToTop, BigEmail, Magnetic, Reveal, RiseWords, ScrollProgress, SpotlightTracker, TimelineRail, Typewriter } from "../motion";
import { JsonLd, SkipLink } from "./shared";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-10 sm:mb-14">
          <div className="flex items-center gap-5">
            <h2 id={`${id}-title`} className="font-display shrink-0 text-[1.85rem] font-semibold tracking-[-0.02em] text-ink sm:text-[2.25rem]">
              {title}
            </h2>
            <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-[color-mix(in_oklab,var(--accent)_60%,transparent)] via-[color-mix(in_oklab,var(--ion)_25%,transparent)] to-transparent" />
          </div>
          {intro && <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted">{intro}</p>}
        </Reveal>
        <Reveal variant="fade" delay={80}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}

/** Orbit: futuristic blue. A live system map behind the hero, glass panels throughout. */
export function OrbitTemplate({ data, model, resumeHref, previewBanner, contactDisabled }: TemplateProps) {
  const { settings, experiences, projects, skill_groups, education } = data;
  const { profile, about, resume, contact, theme } = settings;
  const { show, nav, photo, contactLinks, hasResume } = model;
  const steps = profile.process_steps.map(parseStep);
  const mapLabels = [...new Set([...experiences.flatMap((e) => e.tools), ...projects.flatMap((p) => p.tech)])].filter((t) => t.length <= 14).slice(0, 10);
  const edu = education[0];

  const hud: [string, string][] = (
    [
      ["role", profile.title],
      ["based in", profile.location],
      ["studied", edu ? [edu.institution.replace(/\s*\(.*?\)\s*/g, " ").trim(), edu.grade].filter(Boolean).join(", ") : ""],
      ["status", profile.availability.enabled ? profile.availability.text : ""],
    ] as [string, string][]
  ).filter(([, v]) => v);

  return (
    <div id="top" className="orbit orbit-bg min-h-dvh text-ink">
      <SkipLink />
      <ScrollProgress />
      <SpotlightTracker />
      <SiteHeader
        name={profile.short_name || profile.full_name}
        nav={steps.length > 1 ? [{ id: "process", label: "Process" }, ...nav] : nav}
        allowToggle={theme.allow_toggle}
        banner={previewBanner}
      />

      <main id="main">
        {/* Hero: live system map */}
        <section aria-label="Introduction" className="relative isolate overflow-hidden">
          <SystemMap labels={mapLabels} className="absolute inset-0 -z-10 h-full w-full" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[var(--paper)] to-transparent" />
          <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16">
            <div>
              {profile.availability.enabled && profile.availability.text && (
                <p className="rise-b glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[13px] text-ink-2" style={d(0)}>
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 rounded-full bg-[var(--ion)] opacity-50 motion-safe:animate-ping" />
                    <span className="relative size-2 rounded-full bg-[var(--ion)]" />
                  </span>
                  {profile.availability.text}
                </p>
              )}
              <h1 className="font-display mt-7 text-balance text-[clamp(2.6rem,6.6vw,5.6rem)] font-semibold leading-[1] tracking-[-0.035em]">
                <RiseWords text={profile.full_name} start={150} step={90} wordClass="holo" />
              </h1>
              {profile.headline && (
                <div className="rise-b mt-7 max-w-2xl text-[1.3rem] font-medium leading-snug tracking-[-0.01em] text-ink sm:text-[1.6rem]" style={d(600)}>
                  <Typewriter text={profile.headline} delay={1100} />
                </div>
              )}
              {profile.intro && (
                <p className="rise-b mt-5 max-w-xl text-[16px] leading-relaxed text-ink-2 sm:text-[17px]" style={d(750)}>
                  {profile.intro}
                </p>
              )}
              <div className="rise-b mt-9 flex flex-wrap gap-3" style={d(900)}>
                {show.projects && (
                  <Magnetic>
                    <a
                      href="#projects"
                      className={cn(
                        buttonVariants({ variant: "primary", size: "lg" }),
                        "press group/cta shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent),0_10px_40px_-8px_color-mix(in_oklab,var(--accent)_75%,transparent)]",
                      )}
                    >
                      View my projects
                      <ArrowDown className="transition-transform duration-300 group-hover/cta:translate-y-0.5" aria-hidden />
                    </a>
                  </Magnetic>
                )}
                {hasResume && (
                  <Magnetic>
                    <a href={`${resumeHref}?download=1`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "press glass")}>
                      <Download aria-hidden />
                      Download resume
                    </a>
                  </Magnetic>
                )}
              </div>
            </div>

            {/* HUD profile card */}
            <aside aria-label="Profile summary" className="rise-b glass hud-card relative rounded-2xl p-6" style={d(400)}>
              <span aria-hidden className="hud-corner tl" />
              <span aria-hidden className="hud-corner tr" />
              <span aria-hidden className="hud-corner bl" />
              <span aria-hidden className="hud-corner br" />
              <div className="flex items-center gap-4">
                <div className="relative size-[4.5rem] shrink-0">
                  <span aria-hidden className="holo-ring absolute -inset-[5px] rounded-full" />
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={`Portrait of ${profile.full_name}`} width={72} height={72} className="size-full rounded-full object-cover" />
                  ) : (
                    <span aria-hidden className="font-display flex size-full items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_22%,var(--sunken))] text-xl font-semibold text-ink">
                      {initials(profile.full_name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-display truncate text-lg font-semibold">{profile.short_name || profile.full_name}</p>
                  <div aria-hidden className="mt-2 flex h-4 items-end gap-[3px]">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <span key={i} className="signal-bar w-[3px] rounded-full bg-[var(--ion)]" style={{ "--i": i, height: `${40 + ((i * 37) % 60)}%` } as React.CSSProperties} />
                    ))}
                  </div>
                </div>
              </div>
              <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[14px]">
                {hud.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3">
                    <dt className="font-mono text-[12px] leading-[1.6] text-muted">{k}</dt>
                    <dd className="text-ink-2">{v}</dd>
                  </div>
                ))}
              </dl>
              {contactLinks.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {contactLinks.map(({ href, label, icon: Icon, name }) => (
                    <li key={href}>
                      <a
                        href={href}
                        {...externalProps(href)}
                        title={label}
                        className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] hover:text-ink"
                      >
                        <Icon className="size-4" aria-hidden />
                        <span className="sr-only">
                          {name}: {label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </div>
        </section>

        {steps.length > 1 && <Pipeline steps={steps} />}

        {show.about && (
          <Section id="about" title="About">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
              <div className="max-w-[68ch] space-y-5 text-[17px] leading-relaxed text-ink-2">
                {about.summary.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {about.strengths.length > 0 && (
                <ul className="space-y-2">
                  {about.strengths.map((s, i) => (
                    <li key={s} className="glass glow-edge flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] text-ink-2">
                      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[var(--ion)] shadow-[0_0_10px_2px_var(--ion)]" style={{ opacity: 0.6 + (i % 3) * 0.2 }} />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {(about.interests.length > 0 || about.languages.length > 0 || about.activities.length > 0) && (
              <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                {(
                  [
                    ["Looking for", about.interests],
                    ["Languages", about.languages],
                    ["Leadership and activities", about.activities],
                  ] as [string, string[]][]
                )
                  .filter(([, v]) => v.length)
                  .map(([t, v]) => (
                    <div key={t} className="glass rounded-2xl p-5">
                      <h3 className="text-sm font-semibold text-ink">{t}</h3>
                      <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-ink-2">
                        {v.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
          </Section>
        )}

        {show.experience && (
          <Section id="experience" title="Experience">
            <ol className="relative md:space-y-14">
              <TimelineRail className="left-0 md:left-[15.5rem]" />
              {experiences.map((e) => (
                <ExperienceItem key={e.id} e={e} />
              ))}
            </ol>
          </Section>
        )}

        {show.projects && (
          <Section id="projects" title="Projects" intro="Open a project to see exactly what I was responsible for.">
            <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6", projects.length % 3 === 0 && "lg:grid-cols-3")}>
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 110}>
                  <ProjectCard p={p} />
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {show.skills && (
          <Section id="skills" title="Skills">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skill_groups.map((g, gi) => (
                <Reveal key={g.id} delay={(gi % 3) * 90} className="glass glow-edge rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <span aria-hidden className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_var(--accent)]" />
                    {g.name}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <li
                        key={s}
                        className="rounded-md border border-line bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-2.5 py-1 text-[13px] text-ink-2 transition-colors duration-200 hover:border-[color-mix(in_oklab,var(--accent)_55%,transparent)] hover:text-ink"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {show.education && (
          <Section id="education" title="Education">
            <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {education.map((e) => (
                <li key={e.id} className="glass glow-edge rounded-2xl p-6">
                  <p className="font-mono text-[12px] text-muted">{formatRange(e.start_date, e.end_date)}</p>
                  <h3 className="font-display mt-2 text-lg font-semibold leading-snug">{e.qualification}</h3>
                  <p className="mt-1 text-[15px] text-ink-2">{e.institution}</p>
                  {e.grade && (
                    <p className="mt-3 inline-flex rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-3 py-1 text-[13px] font-medium text-accent-ink">{e.grade}</p>
                  )}
                  {e.details.length > 0 && (
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-ink-2 marker:text-[var(--ion)]">
                      {e.details.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </Section>
        )}

        {show.resume && (
          <Section id="resume" title="Resume">
            <div className="glass flex flex-wrap items-center gap-4 rounded-2xl p-5">
              <FileText className="size-6 text-[var(--ion)]" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{resume.file_name || "Resume (PDF)"}</p>
                {resume.updated_at && <p className="text-[13px] text-muted">Updated {formatDateTime(resume.updated_at)}</p>}
              </div>
              <a href={resumeHref} target="_blank" rel="noopener" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Open
              </a>
              <a href={`${resumeHref}?download=1`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                <Download aria-hidden /> Download PDF
              </a>
            </div>
            {resume.show_preview && (
              <div className="glass mt-5 hidden overflow-hidden rounded-2xl lg:block">
                <iframe src={`${storageUrl(resume.path)}#view=FitH`} title="Resume preview" loading="lazy" className="h-[44rem] w-full" />
              </div>
            )}
          </Section>
        )}

        {show.contact && (
          <Section id="contact" title="Contact" intro={contact.intro || undefined}>
            {profile.email && (
              <div className="mb-14">
                <BigEmail email={profile.email} />
              </div>
            )}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
              <ul className="space-y-1">
                {contactLinks
                  .filter((l) => l.name !== "Email")
                  .map(({ href, label, icon: Icon, name }) => (
                    <li key={href}>
                      <a href={href} {...externalProps(href)} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-ink transition-colors hover:bg-surface">
                        <Icon className="size-4 text-muted group-hover:text-[var(--ion)]" aria-hidden />
                        <span className="sr-only">{name}: </span>
                        <span className="truncate">{label}</span>
                      </a>
                    </li>
                  ))}
                {profile.location && (
                  <li className="flex items-center gap-3 px-3 py-3 text-[15px] text-muted">
                    <MapPin className="size-4" aria-hidden />
                    {profile.location}
                  </li>
                )}
              </ul>
              {contact.form_enabled ? (
                <ContactForm disabled={contactDisabled} />
              ) : (
                <p className="text-[15px] text-ink-2">The best way to reach me is by email.</p>
              )}
            </div>
          </Section>
        )}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 font-mono text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {profile.full_name}
          </p>
          {data.published_at && <p>Last updated {formatDateTime(data.published_at)}</p>}
        </div>
      </footer>
      <BackToTop />
      <JsonLd data={model.personLd} />
    </div>
  );
}
