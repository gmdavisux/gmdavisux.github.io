# Portfolio Roadmap

## Completed

- **Phase 1** — JS/HTML bug fixes
- **Phase 2** — JavaScript module refactor (`js/modules/`, `js/app.js`)
- **Phase 3** — Local admin dashboard (`tools/admin/`)
- **Phase 4** — Jekyll removed (static site + `.nojekyll`)
- **Phase 6** — Visual identity / de-Bootstrap (design tokens, project grid, pilot case study)

---

## Phase 5: Accessibility (WCAG 2.2 AA) — DEFERRED

Revisit when ready. Original outline:

- Shell fixes (skip link, ARIA labels, contact links, live region)
- Content pass (headings, alt text, external link rel)
- Accessible lightbox
- Brand contrast decisions (yellow on blue)

---

## Phase 6: Visual Identity — Done (partial)

**Implemented:**

- Design tokens in `style.css` (`--brand-primary`, `--brand-accent`, `--brand-surface`, Bootstrap overrides)
- `.site-footer` replaces default Bootstrap blue footer
- `.project-tile` + `.project-grid` home grid (in `templates.js`)
- `.workmenu-tile` offcanvas menu
- `.case-study`, `.case-study__split`, `.screenshot-frame` layout classes
- Pilot migration: `pages/suppliers.html`
- `.hero-accent` replaces inline yellow style on home hero

**Remaining (optional):**

- Migrate remaining `pages/*.html` to `.case-study` pattern
- Replace Bootstrap Icons with inline SVG
- Drop full Bootstrap CSS once components are migrated

---

## Phase 7: Motion (Optional)

- Subtle section fade-in and tile hover (hover lift already on `.project-tile`)
- Gated by `prefers-reduced-motion`