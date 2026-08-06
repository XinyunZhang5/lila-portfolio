import {
  RxEnvelopeClosed,
  RxGithubLogo,
  RxLinkedinLogo,
} from "react-icons/rx";

export const SKILL_DATA = [
  {
    skill_name: "Rust",
    image: "rust.svg",
    width: 70,
    height: 70,
  },
  {
    skill_name: "C++",
    image: "cpp.svg",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Python",
    image: "python.svg",
    width: 70,
    height: 70,
  },
  {
    skill_name: "TypeScript",
    image: "ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JavaScript",
    image: "js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "Java",
    image: "java.svg",
    width: 65,
    height: 65,
  },
  {
    skill_name: "HTML",
    image: "html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "CSS",
    image: "css.png",
    width: 80,
    height: 80,
  },
] as const;

export const SOCIALS = [
  {
    name: "GitHub",
    icon: RxGithubLogo,
    link: "https://github.com/XinyunZhang5",
  },
  {
    name: "LinkedIn",
    icon: RxLinkedinLogo,
    link: "https://www.linkedin.com/in/xinyun-lila-zhang/",
  },
  {
    name: "Email",
    icon: RxEnvelopeClosed,
    link: "mailto:lilazh2026@gmail.com",
  },
] as const;

export const FRONTEND_SKILL = [
  {
    skill_name: "React",
    image: "react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Vue.js",
    image: "vue.svg",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Redux",
    image: "redux.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Next.js",
    image: "next.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Tailwind CSS",
    image: "tailwind.png",
    width: 80,
    height: 80,
  },
] as const;

export const BACKEND_SKILL = [
  {
    skill_name: "Node.js",
    image: "node.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Express.js",
    image: "express.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "FastAPI",
    image: "fastapi.svg",
    width: 70,
    height: 70,
  },
  {
    skill_name: "PostgreSQL",
    image: "postgresql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "MySQL",
    image: "mysql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "MongoDB",
    image: "mongodb.png",
    width: 40,
    height: 40,
  },
  {
    skill_name: "Redis",
    image: "redis.svg",
    width: 60,
    height: 60,
  },
] as const;

export const FULLSTACK_SKILL = [
  {
    skill_name: "Docker",
    image: "docker.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Kubernetes",
    image: "kubernetes.svg",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Git",
    image: "git.svg",
    width: 65,
    height: 65,
  },
  {
    skill_name: "Google Cloud",
    image: "gcp.svg",
    width: 70,
    height: 70,
  },
] as const;

export const PROJECTS = [
  {
    title: "Whisper Helper",
    description:
      "A free, fully-offline voice-input companion for macOS — a floating mic button that lets you speak and have it typed into Claude Code or any app. Powered by Whisper.cpp with OpenCC: Simplified Chinese by default, English too. Local-first: no cloud, no accounts.",
    image: "/projects/shuoba.png",
    link: "https://github.com/XinyunZhang5/whisper-helper",
  },
  {
    title: "Danceflux",
    description:
      "Compare your dance take against a reference video and get plain-language coaching tips on exactly what to fix. On-device pose estimation, audio alignment, and a phrase-bank coaching engine that degrades gracefully to an LLM fallback. Built with Swift and Vision.",
    image: "/projects/danceflux.png",
    link: "https://github.com/XinyunZhang5/danceflux",
  },
  {
    title: "Nebular Design",
    description:
      "Upload a photo of a building, convert it to 3D, match it to real LEGO bricks, and generate step-by-step assembly instructions — plus a social layer to share your builds. TypeScript, Python, and AI working together.",
    image: "/projects/nebular-design.png",
    link: "https://github.com/XinyunZhang5/nebular-design",
  },
  {
    title: "Chatcurso",
    description:
      "A Chrome extension that quietly captures every prompt you send to ChatGPT and lists them in a collapsible side panel — search, revisit, and reuse your best prompts. 100% local: no backend, no accounts, no network calls.",
    image: "/projects/Chatcurso.png",
    link: "https://github.com/XinyunZhang5/Chatcurso",
  },
] as const;

export const FOOTER_DATA = [
  {
    title: "Projects",
    data: [
      {
        name: "Whisper Helper",
        icon: RxGithubLogo,
        link: "https://github.com/XinyunZhang5/whisper-helper",
      },
      {
        name: "Danceflux",
        icon: RxGithubLogo,
        link: "https://github.com/XinyunZhang5/danceflux",
      },
      {
        name: "Nebular Design",
        icon: RxGithubLogo,
        link: "https://github.com/XinyunZhang5/nebular-design",
      },
    ],
  },
  {
    title: "Connect",
    data: [
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: "https://github.com/XinyunZhang5",
      },
      {
        name: "LinkedIn",
        icon: RxLinkedinLogo,
        link: "https://www.linkedin.com/in/xinyun-lila-zhang/",
      },
      {
        name: "Email",
        icon: RxEnvelopeClosed,
        link: "mailto:lilazh2026@gmail.com",
      },
    ],
  },
] as const;

export const NAV_LINKS = [
  {
    title: "Prologue",
    link: "#prologue",
  },
  {
    title: "Projects",
    link: "#projects",
  },
  {
    title: "More Me",
    link: "#more-me",
  },
] as const;

export const LINKS = {
  sourceCode: "https://github.com/XinyunZhang5",
};
