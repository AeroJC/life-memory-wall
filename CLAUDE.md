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
- **Deployment**: Railway (project: lifememorywall)
- **Repo**: https://github.com/AeroJC/life-memory-wall

## Testing

- Test framework: Vitest + @testing-library/react
- Run tests: `npm test` or `npx vitest run`
- All tests must pass before pushing
- Pre-push hook runs tests automatically

## Code Conventions

- Use Tailwind theme classes (gold, coral, warmDark, warmWhite, etc.)
- Font classes: `font-serif` for headings, `font-sans` for body, `font-handwriting` for decorative
- Use `framer-motion` for animations
- Preserve `whitespace-pre-wrap` on content divs for line breaks
- Inline editing uses render functions (not component definitions) to avoid focus loss
