# DNI Demo (modular skeleton)

This is the Phase-1 refactor skeleton for the Marchex DNI demo. It's a zero-build, client-side codebase intended for sales-engineer customization via `config/prospect.json`.

## Quick start

1. Unzip the package and serve the folder with a static server (e.g. `npx http-server` or GitHub Pages).
2. Open `index.html` in the browser. By default it loads `config/prospect.json`.
3. Edit `config/prospect.json` to rebrand and change DNI rules. Reload the page to see changes.

## File layout

- `index.html` — minimal shell that loads modules.
- `config/prospect.json` — single config file to edit for branding, pages, and DNI rules.
- `themes/default.css` — CSS variables and shared layout CSS.
- `scripts/*.js` — ES modules for core functionality (tracking, dni, ui, navigation, marchex loader, simulate-call).

## Next steps

- Replace jQuery with vanilla JS (optional).
- Add an in-browser config editor for non-technical sales engineers (optional).
- Add automated E2E tests for CI if desired.
