# Project Core Rules (Global)

## 1. Core Tech Stack
- Framework: Next.js (App Router, Strict TypeScript)
- Database: PostgreSQL (via Prisma / Drizzle ORM)
- UI/UX & Style: Tailwind CSS + Shadcn UI
- Animations: React Bits

## 2. Global AI Constraints
- ALWAYS write complete, production-ready code. No `// implement logic here` placeholders.
- Maintain absolute type safety (Strict TypeScript). Avoid `any`.
- Keep components modular. Separate business logic from UI display.
- Refer to `architecture.md` for visual guidelines and `tasks.md` for project progress.

## 3. Strict Supply Chain Security Rules (Anti-Hacker Injection)
- **Zero Blind Install**: Never install or recommend a new npm library without first conducting a reputation analysis and vulnerability check.
- **Lockfile Enforcement**: Always make sure that `package-lock.json` or `pnpm-lock.yaml` is committed to Git to lock in valid dependency versions.