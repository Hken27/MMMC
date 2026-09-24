# Project Core Rules (Global)

## 1. Core Tech Stack
- Framework: Next.js (App Router, Strict TypeScript)
- Database: PostgreSQL (Prisma ORM)
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

## 4. Access Control Rules (RBAC — Admin vs Buyer)
- **Two roles**: `admin` (operates Admin Dashboard/ERP) and `buyer` (Public Site only). Any new route, page, or API endpoint must declare which role(s) it's for.
- **Server-side enforcement only**: Role checks must happen in middleware or server components/route handlers. Never rely on hiding a button or nav item client-side as the sole protection.
- **Least privilege**: Admin API routes must reject any request without a valid `admin` session/role — no implicit trust based on client-sent flags.
- **Audit trail**: Mutating actions performed by `admin` (create/update/delete on Order, Katalog, Inquiry, etc.) must be logged (who, what, when) once ERP (Phase 5) is built.
- **Design system separation**: Admin Dashboard UI is intentionally decoupled from the Public Site design system (see `ARCHITECTURE.md` §1 & §3). Do not import Public Site components/tokens into admin pages, or vice versa, unless explicitly instructed.