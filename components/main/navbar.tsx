"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CONTENTS, useBook } from "@/components/main/book-context";
import { ThemeToggle } from "@/components/main/theme-toggle";
import { SOCIALS } from "@/constants";

export const Navbar = () => {
  const { page, go } = useBook();
  const pathname = usePathname();
  const router = useRouter();
  // only matters below md, where the rail is a drawer tucked off the left edge
  const [open, setOpen] = useState(false);
  // true while the Projects section at the foot of Home fills the view
  const [inProjects, setInProjects] = useState(false);

  const onBook = pathname === "/";

  // the book only lives on "/", so from any other route (e.g. /watch) a
  // chapter pick has to navigate home as well as flip to that page
  const pick = (p: number, section?: string) => {
    go(p);
    setOpen(false);
    if (!onBook) router.push("/");
    // wait for the chapter (or the whole book, coming from /watch) to mount,
    // then scroll to the section, or back to the top for a plain chapter
    let tries = 0;
    const find = () => {
      const el = section
        ? document.getElementById(section)
        : document.getElementById("prologue")?.parentElement;
      if (el) {
        if (section) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else el.scrollTo({ top: 0, behavior: "smooth" });
      } else if (tries++ < 40) window.setTimeout(find, 50);
    };
    // a short head start, so the book's own scroll-to-top on a chapter change
    // has already run and can't cancel this scroll
    if (section || p === 0) window.setTimeout(find, 80);
  };

  // light up Projects instead of Home once that section reaches mid-screen
  useEffect(() => {
    setInProjects(false);
    if (!onBook || page !== 0) return;
    const el = document.getElementById("projects");
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInProjects(e.isIntersecting),
      { rootMargin: "0px 0px -50% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onBook, page]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* phone: tapping anywhere off the open drawer puts it away */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/25 md:hidden"
        />
      )}

      {/* the table of contents, pinned down the left of every page. On a phone
          it slides off-screen and leaves only its tab showing. */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col border-r border-[color:var(--hair)] bg-[color-mix(in_srgb,var(--paper)_94%,transparent)] backdrop-blur-md transition-transform duration-300 ease-out md:translate-x-0 md:bg-[color-mix(in_srgb,var(--paper)_72%,transparent)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* the tab: rides the drawer's edge, so it is the handle both ways */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close contents" : "Open contents"}
          aria-expanded={open}
          className="absolute left-full top-1/2 flex h-16 w-6 -translate-y-1/2 items-center justify-center rounded-r-md border border-l-0 border-[color:var(--hair)] bg-[color-mix(in_srgb,var(--paper)_94%,transparent)] text-[color:var(--accent)] backdrop-blur-md md:hidden"
        >
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <path d="M1 1l6 6-6 6" />
          </svg>
        </button>

        {/* the rail's contents scroll on their own when the window is too
            short for them; the tab above stays outside so it is never clipped */}
        <div className="scrollbar-hidden flex h-full flex-col overflow-y-auto px-7 py-10">
          <button
            onClick={() => pick(0)}
            className="text-left text-[40px] leading-[0.92] tracking-[-0.03em] text-[color:var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
            aria-label="Lila Zhang, back to Home"
          >
            Lila
            <br />
            Zhang
          </button>
          <p
            className="mt-4 text-[12px] italic tracking-[0.02em] text-[color:var(--muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Software Engineer
          </p>

          <nav className="mt-12 flex flex-col gap-1">
            {CONTENTS.map((row) => {
              const section = "section" in row ? row.section : undefined;
              const active =
                onBook &&
                page === row.page &&
                (row.page !== 0 || inProjects === Boolean(section));
              return (
                <button
                  key={row.key}
                  onClick={() => pick(row.page, section)}
                  aria-current={active ? "page" : undefined}
                  className="group flex items-baseline gap-3 py-2 text-left"
                >
                  <span
                    className={`text-[16px] uppercase tracking-[0.06em] transition-colors ${
                      active
                        ? "text-[color:var(--accent)]"
                        : "text-[color:var(--ink)] group-hover:text-[color:var(--accent)]"
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {row.label}
                  </span>
                  <span
                    aria-hidden
                    className="mb-[5px] flex-1 self-end border-b border-dotted border-[color:var(--muted)] opacity-60 transition-opacity group-hover:opacity-100"
                  />
                  <span
                    className={`text-[14px] tracking-[0.1em] transition-colors ${
                      active
                        ? "text-[color:var(--accent)]"
                        : "text-[color:var(--muted)] group-hover:text-[color:var(--accent)]"
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {"roman" in row ? row.roman : "\u00a7"}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* colophon */}
          <div className="mt-auto flex flex-col items-start gap-5 pt-12">
            <div className="flex items-center gap-5">
              {SOCIALS.map(({ link, name, icon: Icon }) => (
                <Link
                  key={name}
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={name}
                  className="text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)]"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </Link>
              ))}
              <ThemeToggle variant="bare" className="[&_svg]:h-[18px] [&_svg]:w-[18px]" />
            </div>
            <span
              className="text-[11px] tracking-[0.22em] text-[color:var(--muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              v.&nbsp;<span className="text-[color:var(--ink-soft)]">I</span>
              &nbsp;&middot;&nbsp;MMXXVI
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
