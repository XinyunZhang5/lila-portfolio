"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";

export type Theme = "night" | "day";

/** page 0 = cover / table of contents, 1..3 = the three chapters */
export const PAGES = [
  { key: "cover", label: "Contents", roman: "" },
  { key: "home", label: "Home", roman: "I" },
  { key: "projects", label: "Projects", roman: "II" },
  { key: "more", label: "More Me", roman: "III" },
] as const;

export const LAST_PAGE = PAGES.length - 1;

type BookCtx = {
  page: number;
  dir: 1 | -1; // direction of the last move, for transition sense
  go: (p: number) => void;
  next: () => void;
  prev: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const Ctx = createContext<BookCtx | null>(null);

export const useBook = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBook must be used inside <BookProvider>");
  return v;
};

export const BookProvider = ({ children }: PropsWithChildren) => {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [theme, setThemeState] = useState<Theme>("night");

  // restore theme + reflect it on <html> so the CSS vars switch. A URL like
  // ?chapter=2&theme=day deep-links straight into a page in a given mode.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get("theme");
    const urlChapter = Number(params.get("chapter"));
    const saved = localStorage.getItem("book-theme") as Theme | null;

    if (urlTheme === "day" || urlTheme === "night") setThemeState(urlTheme);
    else if (saved === "day" || saved === "night") setThemeState(saved);

    if (Number.isFinite(urlChapter) && urlChapter >= 1 && urlChapter <= LAST_PAGE)
      setPage(urlChapter);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("book-theme", theme);
    } catch {
      /* ignore private-mode storage errors */
    }
  }, [theme]);

  const go = useCallback((p: number) => {
    const clamped = Math.max(0, Math.min(LAST_PAGE, p));
    setPage((cur) => {
      setDir(clamped >= cur ? 1 : -1);
      return clamped;
    });
  }, []);

  const next = useCallback(() => go(page + 1), [go, page]);
  const prev = useCallback(() => go(page - 1), [go, page]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "night" ? "day" : "night")),
    []
  );

  const value = useMemo(
    () => ({ page, dir, go, next, prev, theme, setTheme, toggleTheme }),
    [page, dir, go, next, prev, theme, setTheme, toggleTheme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
