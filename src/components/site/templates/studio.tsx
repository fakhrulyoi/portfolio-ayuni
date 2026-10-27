import { ArrowDown, Download, FileText, MapPin, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime, formatRange, initials, parseStep, storageUrl } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ContactForm } from "../contact-form";
import { externalProps, type TemplateProps } from "../model";
import { BackToTop, Magnetic, Reveal, ScrollProgress } from "../motion";
import { StudioHeader } from "../studio/header";
import { DesignCanvas } from "../studio/canvas";
import { ProcessRiver } from "../studio/process";
import { ExperienceTabs } from "../studio/experience-tabs";
import { ProjectTile } from "../studio/project-tile";
import { GradeRing } from "../studio/grade-ring";
import { CopyEmail } from "../studio/copy-email";
import { JsonLd, SkipLink } from "./shared";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

function Section({ id, title, intro, children, className }: { id: string; title: string; intro?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("relative py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-10 max-w-2xl sm:mb-14">
          <h2 id={`${id}-title`} className="font-serif-soft text-[2.1rem] leading-[1.08] tracking-[-0.015em] text-ink sm:text-[2.75rem]">
            {title}
          </h2>
          {intro && <p className="mt-3 text-[17px] leading-relaxed text-muted">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function gradeNumber(grade: string) {
  const m = /(\d\.\d{1,2})/.exec(grade);
  const v = m ? Number(m[1]) : NaN;
  return v > 0 && v <= 4 ? v : null;
}

/** Studio: light and calm. A live design canvas in the hero; soft blue throughout. */
export function StudioTemplate({ data, model, resumeHref, previewBanner, contactDisabled }: TemplateProps) {
  const { settings, experiences, projects, skill_groups, education } = data;
  const { profile, about, resume, contact, theme } = settings;
  const { show, nav, photo, contactLinks, hasResume } = model;
  const steps = profile.process_steps.map(parseStep).filter((s) => s.label);
  const shortName = profile.short_name || profile.full_name.split(" ")[0] || "";
  const initial = (shortName[0] ?? "•").toUpperCase();
  const chips = [...new Set(experiences.flatMap((e) => e.tools))].filter((t) => t.length <= 10).slice(0, 3);
  const notes = steps.length ? steps.map((s) => s.label).filter((l) => l.length <= 26) : skill_groups.flatMap((g) => g.items).slice(0, 4);
  const words = profile.full_name.split(/\s+/).filter(Boolean);
  const [lead, ...rest] = about.summary;
  const extras = (
    [
      ["Looking for", about.interests],
      ["Languages", about.languages],
      ["Leadership and activities", about.activities],
    ] as [string, string[]][]
  ).filter(([, v]) => v.length);

  return (
    <div id="top" className="studio studio-bg min-h-dvh text-ink">
      <SkipLink />
      <ScrollProgress />
      {previewBanner}
      <StudioHeader
        name={shortName}
        initial={initial}
        nav={steps.length > 1 ? [{ id: "process", label: "Process" }, ...nav] : nav}
        allowToggle={theme.allow_toggle}
      />

      <main id="main">
        {/* Hero */}
        <section aria-label="Introduction" className="relative">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:gap-14 lg:pb-20 lg:pt-6">
            <div>
              {profile.availability.enabled && profile.availability.text && (
                <p className="soft-up inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] text-ink-2 shadow-sm" style={d(0)}>
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 rounded-full bg-success opacity-40 motion-safe:animate-ping" />
                    <span className="relative size-2 rounded-full bg-success" />
                  </span>
                  {profile.availability.text}
                </p>
              )}
              <h1 className="font-serif-soft mt-6 text-balance text-[clamp(2.5rem,5.6vw,4.6rem)] leading-[1.02] tracking-[-0.025em] text-ink">
                {words.map((w, i) => (
                  <span key={i}>
                    <span className="soft-word" style={d(120 + i * 85)}>
                      {w}
                    </span>
                    {i < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </h1>
              {profile.title && (
                <p className="soft-up mt-4 text-[1.05rem] font-medium text-accent-ink" style={d(500)}>
                  {profile.title}
                  {profile.location && <span className="font-normal text-muted">, {profile.location}</span>}
                </p>
              )}
              {profile.headline && (
                <p className="soft-up mt-6 max-w-xl text-[1.3rem] leading-snug text-ink sm:text-[1.5rem]" style={d(620)}>
                  {profile.headline}
                </p>
              )}
              {profile.intro && (
                <p className="soft-up mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2" style={d(720)}>
                  {profile.intro}
                </p>
              )}
              <div className="soft-up mt-9 flex flex-wrap gap-3" style={d(840)}>
                {show.projects && (
                  <Magnetic>
                    <a href="#projects" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "press group/cta h-12 px-6 shadow-[0_14px_30px_-14px_var(--accent)]")}>
                      View my work
                      <ArrowDown className="transition-transform duration-300 group-hover/cta:translate-y-0.5" aria-hidden />
                    </a>
                  </Magnetic>
                )}
                {hasResume ? (
                  <a href={`${resumeHref}?download=1`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "press h-12 px-6")}>
                    <Download aria-hidden />
                    Download resume
                  </a>
                ) : (
                  show.contact && (
                    <a href="#contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "press h-12 px-6")}>
                      <Send aria-hidden />
                      Get in touch
                    </a>
                  )
                )}
              </div>
            </div>

            <div className="soft-up mx-auto w-full max-w-[31rem] lg:mx-0" style={d(300)}>
              <DesignCanvas
                fullName={profile.full_name}
                shortName={shortName}
                initial={initials(profile.full_name).slice(0, 2)}
                title={profile.title}
                location={profile.location}
                status={profile.availability.enabled ? profile.availability.text : ""}
                photo={photo}
                chips={chips}
                notes={notes}
              />
            </div>
          </div>
        </section>

        {steps.length > 1 && (
          <Section id="process" title="How I work" intro="From the first conversation with stakeholders to the day users take over the system." className="studio-band">
            <ProcessRiver steps={steps} />
          </Section>
        )}

        {show.about && (
          <Section id="about" title="About">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
              <Reveal className="max-w-[64ch]">
                {lead && <p className="font-serif-soft text-[1.35rem] leading-[1.5] text-ink sm:text-[1.5rem]">{lead}</p>}
                {rest.map((p, i) => (
                  <p key={i} className="mt-5 text-[17px] leading-relaxed text-ink-2">
                    {p}
                  </p>
                ))}
              </Reveal>
              {about.strengths.length > 0 && (
                <Reveal delay={120} className="studio-checklist self-start rounded-[1.75rem] border border-line bg-surface p-6 shadow-[0_24px_50px_-36px_rgb(15_27_56/0.4)]">
                  <h3 className="text-[15px] font-semibold text-ink">Strengths</h3>
                  <ul className="mt-4 space-y-3">
                    {about.strengths.map((s, i) => (
                      <li key={s} className="flex items-start gap-3 text-[15px] leading-snug text-ink-2" style={{ "--i": i } as React.CSSProperties}>
                        <svg viewBox="0 0 20 20" aria-hidden className="studio-check mt-px size-5 shrink-0">
                          <rect className="box" x="1" y="1" width="18" height="18" rx="5" />
                          <path className="tick" d="M5.5 10.5 8.5 13.5 14.5 6.5" />
                        </svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
            {extras.length > 0 && (
              <Reveal delay={80}>
                <dl className="mt-14 grid grid-cols-1 gap-8 border-t border-line pt-8 md:grid-cols-3">
                  {extras.map(([t, v]) => (
                    <div key={t}>
                      <dt className="text-[14px] font-semibold text-ink">{t}</dt>
                      {v.map((x) => (
                        <dd key={x} className="mt-2 text-[15px] leading-relaxed text-ink-2">
                          {x}
                        </dd>
                      ))}
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </Section>
        )}

        {show.experience && (
          <Section id="experience" title="Experience" className="studio-band">
            <Reveal variant="fade">
              <ExperienceTabs items={experiences} />
            </Reveal>
          </Section>
        )}

        {show.projects && (
          <Section id="projects" title="Projects" intro="Select a project to see exactly what I was responsible for.">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {projects.map((p, i) => {
                const wide = i === 0 && projects.length !== 2;
                return (
                  <Reveal key={p.id} delay={wide ? 0 : ((i - 1) % 2) * 120} className={wide ? "md:col-span-2" : ""}>
                    <ProjectTile p={p} wide={wide} />
                  </Reveal>
                );
              })}
            </div>
          </Section>
        )}

        {show.skills && (
          <Section id="skills" title="Skills" className="studio-band">
            <div className="divide-y divide-line border-y border-line">
              {skill_groups.map((g) => (
                <Reveal key={g.id} variant="fade" className="studio-skillrow grid grid-cols-1 gap-4 py-6 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-8">
                  <h3 className="font-serif-soft text-[1.2rem] leading-snug text-ink">{g.name}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((s, i) => (
                      <li
                        key={s}
                        className="studio-chip rounded-full border border-line bg-surface px-3.5 py-1.5 text-[14px] text-ink-2"
                        style={{ "--i": i } as React.CSSProperties}
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
            <ol className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {education.map((e, i) => {
                const g = gradeNumber(e.grade);
                return (
                  <Reveal as="li" key={e.id} delay={(i % 2) * 120} className="flex flex-col gap-5 rounded-[1.75rem] border border-line bg-surface p-6 sm:flex-row sm:p-7">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] tabular-nums text-muted">{formatRange(e.start_date, e.end_date)}</p>
                      <h3 className="font-serif-soft mt-2 text-[1.3rem] leading-snug text-ink">{e.qualification}</h3>
                      <p className="mt-1 text-[15px] text-ink-2">{e.institution}</p>
                      {e.field && e.field !== e.qualification && <p className="mt-0.5 text-[14px] text-muted">{e.field}</p>}
                      {!g && e.grade && <p className="mt-3 text-[14px] font-medium text-accent-ink">{e.grade}</p>}
                      {e.details.length > 0 && (
                        <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-ink-2">
                          {e.details.map((x) => (
                            <li key={x} className="flex gap-2.5">
                              <span aria-hidden className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-accent" />
                              {x}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {g && <GradeRing value={g} label={e.grade} />}
                  </Reveal>
                );
              })}
            </ol>
          </Section>
        )}

        {show.resume && (
          <Section id="resume" title="Resume" className="studio-band">
            <Reveal className="flex flex-col items-start gap-6 rounded-[1.75rem] border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
              <span aria-hidden className="studio-paper relative flex h-24 w-20 shrink-0 items-center justify-center">
                <span className="absolute inset-0 rotate-[-6deg] rounded-lg border border-line bg-sunken" />
                <span className="absolute inset-0 rounded-lg border border-line bg-surface shadow-sm" />
                <FileText className="relative size-7 text-accent-ink" />
              </span>
              <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                <p className="font-serif-soft truncate text-[1.3rem] text-ink">{resume.file_name || "Resume (PDF)"}</p>
                {resume.updated_at && <p className="mt-1 text-[14px] text-muted">Updated {formatDateTime(resume.updated_at)}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={resumeHref} target="_blank" rel="noopener" className={buttonVariants({ variant: "outline" })}>
                  Open
                </a>
                <a href={`${resumeHref}?download=1`} className={buttonVariants({ variant: "primary" })}>
                  <Download aria-hidden /> Download PDF
                </a>
              </div>
            </Reveal>
            {resume.show_preview && (
              <div className="mt-6 hidden overflow-hidden rounded-[1.75rem] border border-line bg-surface lg:block">
                <iframe src={`${storageUrl(resume.path)}#view=FitH`} title="Resume preview" loading="lazy" className="h-[44rem] w-full" />
              </div>
            )}
          </Section>
        )}

        {show.contact && (
          <Section id="contact" title="Contact">
            <Reveal className="studio-contact grid grid-cols-1 gap-10 overflow-hidden rounded-[2rem] border border-line p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-14">
              <div>
                <p className="font-serif-soft max-w-md text-[1.6rem] leading-snug text-ink sm:text-[2rem]">{contact.intro || "Send a message and I'll reply by email."}</p>
                {profile.email && (
                  <div className="mt-8">
                    <CopyEmail email={profile.email} />
                  </div>
                )}
                <ul className="mt-8 space-y-1">
                  {contactLinks
                    .filter((l) => l.name !== "Email")
                    .map(({ href, label, icon: Icon, name }) => (
                      <li key={href}>
                        <a href={href} {...externalProps(href)} className="group inline-flex items-center gap-3 rounded-full py-2 pr-3 text-[15px] text-ink">
                          <span className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors group-hover:border-accent group-hover:text-accent-ink">
                            <Icon className="size-4" aria-hidden />
                          </span>
                          <span className="sr-only">{name}: </span>
                          <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">{label}</span>
                        </a>
                      </li>
                    ))}
                  {profile.location && (
                    <li className="inline-flex items-center gap-3 py-2 text-[15px] text-muted">
                      <span className="flex size-9 items-center justify-center rounded-full border border-line bg-surface">
                        <MapPin className="size-4" aria-hidden />
                      </span>
                      {profile.location}
                    </li>
                  )}
                </ul>
              </div>
              <div className="studio-form">
                {contact.form_enabled ? <ContactForm disabled={contactDisabled} /> : <p className="text-[15px] text-ink-2">The best way to reach me is by email.</p>}
              </div>
            </Reveal>
          </Section>
        )}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
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
