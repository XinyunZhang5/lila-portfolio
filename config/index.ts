import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: "Xinyun (Lila) Zhang | Portfolio",
  description:
    "Math + CS @ UIUC. Aspiring software engineer focused on infra, full-stack, and AI agent architecture. A storybook portfolio of the things I've built.",
  keywords: [
    "Xinyun Zhang",
    "Lila Zhang",
    "software engineer",
    "portfolio",
    "UIUC",
    "full-stack",
    "systems programming",
    "rust",
    "react",
    "nextjs",
    "typescript",
    "ai",
    "machine learning",
  ] as Array<string>,
  authors: {
    name: "Xinyun (Lila) Zhang",
    url: "https://github.com/XinyunZhang5",
  },
} as const;
