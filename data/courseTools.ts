/**
 * Tools used in the Academy (hero + copy). Optional logos: `public/course-tools/{id}.svg`.
 */
export type CourseTool = {
  /** File slug: `public/course-tools/${id}.svg` (or .png) */
  id: string;
  /** Shown in UI */
  name: string;
  /** Optional: override path if you use a different name */
  logoSrc?: string;
};

export const COURSE_TOOLS: CourseTool[] = [
  { id: "cursor", name: "Cursor" },
  { id: "neon", name: "Neon" },
  { id: "prisma", name: "Prisma" },
  { id: "nextjs", name: "Next.js" },
  { id: "vercel", name: "Vercel" },
  { id: "openai", name: "OpenAI" },
  { id: "typescript", name: "TypeScript" },
  { id: "react", name: "React" },
  { id: "github", name: "GitHub" },
  { id: "tailwind-css", name: "Tailwind CSS" },
  { id: "docker", name: "Docker" },
  { id: "azure", name: "Azure" },
  { id: "stripe", name: "Stripe" },
  { id: "langchain", name: "LangChain" },
  { id: "postgresql", name: "PostgreSQL" },
  { id: "zod", name: "Zod" },
];
