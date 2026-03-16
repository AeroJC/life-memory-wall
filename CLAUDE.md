# CLAUDE.md — Project Instructions

## Diary Logging (MANDATORY)

- At the end of **every session** or **before every push**, write/update a diary entry at `docs/diary/YYYY-MM-DD.md`.
- If the file already exists for today, **append** new Q&A entries and update the Files Changed table.
- If it's a new day, **create** a new file.
- Do this **automatically** without the user asking.

### Diary Format

```markdown
# Diary — YYYY-MM-DD

## Summary
One-line summary of the session.

## Q&A Log
**Q:** User request
**A:** What was done and how.

## Files Changed
| File | Change |
|------|--------|
| `path/to/file` | Brief description |
```

## Project Info

- **App**: My Inner Circle — a memory/moment sharing platform
- **Stack**: React + TypeScript + Vite, Tailwind CSS, Framer Motion, Zustand, Capacitor (iOS/Android)
- **Theme colors**: gold=#d4a574, coral=#e8927c, warmDark=#4a3728, warmWhite=#fffbf5
- **Image hosting**: Cloudinary
- **Backend**: External API (configured via VITE_API_URL)
- **Backend repo**: https://github.com/AeroJC/Life-memory-backend
- **Deployment**: Railway (project: lifememorywall)
- **Repo**: https://github.com/AeroJC/life-memory-wall

## Git Push Policy (MANDATORY)

- **NEVER push code to frontend or backend without explicit user confirmation.**
- Always ask the user before running `git push` — even if they asked to commit.
- Committing and pushing are separate actions. Only push when the user says to push.
- **Never force push to main** — always use regular push.
- **Never commit secrets** — no `.env`, API keys, tokens, or credentials files.

## Git Conventions

- Use **conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Commit messages must be descriptive — explain the "why", not just the "what".

## Pre-Push Checklist (MANDATORY)

Before every push or after resolving merge conflicts, **always** run:

1. **TypeScript check**: `npx tsc --noEmit` — fix ALL type errors before proceeding
2. **Tests**: `npm test` — all tests must pass
3. **Build**: `npm run build` — ensure production build succeeds

Do NOT push code with TypeScript errors. If merge conflicts are resolved, re-run the full checklist before committing.

## Testing

- Test framework: Vitest + @testing-library/react
- Run tests: `npm test` or `npx vitest run`
- All tests must pass before pushing
- Pre-push hook runs tests automatically

## Test Maintenance (MANDATORY)

- When a **new feature** is added, write corresponding test cases.
- When a feature is **modified**, update the related test cases to match.
- When a feature is **deleted**, remove the related test cases.
- Tests must always reflect the current state of the code.

## Code Quality (MANDATORY)

- **No `any` types** — use proper TypeScript types. Extend existing interfaces in `src/types/index.ts`.
- **No unused imports/variables** — clean up after refactoring.
- **No hardcoded strings** — API URLs, colors, etc. should use env vars or theme constants.
- **Read existing code before modifying** — understand context first.
- **Don't overengineer** — solve the current problem, not hypothetical future ones.
- **Check both frontend and backend** when a feature spans both repos.

## Security (MANDATORY)

- **Sanitize user inputs** — prevent XSS in contentEditable, form fields.
- **Use `sanitizeHtml()` from `src/utils/sanitize.ts`** before any `dangerouslySetInnerHTML` — never render raw user HTML.
- **Use `sanitizeText()` for plain text fields** — strips ALL HTML tags (titles, names, locations).
- **Backend uses DOMPurify** (`isomorphic-dompurify`) in `src/middleware/sanitize.ts` — rich text fields allow safe formatting tags only, all other fields strip ALL HTML.
- **Validate API responses** — don't trust external data blindly.
- **Validate request body** on all backend API routes.
- **SQL injection**: Protected by Prisma parameterized queries — never use raw SQL string concatenation.

## Performance

- **Lazy load heavy components** — use `React.lazy()` + `Suspense`.
- **Optimize images** — use Cloudinary transforms, don't load full-res unnecessarily.
- **Avoid unnecessary re-renders** — use `useMemo`/`useCallback` where needed.

## Accessibility

- **Add alt text to all images.**
- **Ensure keyboard navigation works** for interactive elements.
- **Use semantic HTML** — `button`, `nav`, `main`, `section`, etc.

## Backend Specific

- **Always run `prisma generate`** after schema changes.
- **Add database migrations** for schema changes before deploying.
- **Validate request body** on all API routes — never trust client data.

## Code Conventions

- **UI features must match the project theme** — never use default/generic styles. Always use the project's design language:
  - Colors: `gold`, `coral`, `warmDark`, `warmWhite`, `lavender`, `peach`, `teal` (Tailwind theme classes)
  - Fonts: `font-serif` for headings, `font-sans` for body, `font-handwriting` for decorative
  - Rounded corners: `rounded-2xl` or `rounded-xl` (soft, warm feel)
  - Gradients: `bg-gradient-to-br from-gold/80 to-coral/70` style
  - Animations: `framer-motion` with smooth, subtle transitions
  - Shadows: soft shadows (`shadow-md`, `shadow-lg`)
- Preserve `whitespace-pre-wrap` on content divs for line breaks
- Inline editing uses render functions (not component definitions) to avoid focus loss
