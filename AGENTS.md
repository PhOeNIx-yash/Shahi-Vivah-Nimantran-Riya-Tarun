# AGENTS.md

## Project overview

This repository is a static, single-page wedding invitation site. The website is authored directly in HTML, CSS, and JavaScript and is meant to be served as a simple static project from the repository root.

The project is design-heavy and asset-driven, with custom animation, audio, glyph styling, and a personalized invitation flow. Treat it as an experience-first front-end rather than a framework-based app.

## Primary files

- `index.html`: overall page structure, invitation sections, text blocks, and asset references
- `css/style.css`: all visual design, layout, motion, gradients, and luxury wedding styling
- `js/app.js`: app orchestration, invitation interactions, default wedding data, customizer behavior, and persistence
- `js/audio.js`: wedding music and audio fallback logic
- `js/petals.js`: particle animation for rose and marigold petals
- `assets/`: local images and audio files used throughout the site

## Working conventions

- Prefer keeping the project static. Do not add a framework, package manager, or build pipeline unless the user explicitly asks for it.
- Use relative asset paths like `assets/images/...` and `assets/audio/...` rather than introducing new CDN-based dependencies for core functionality.
- Preserve the existing visual language: dark royal palette, gold accents, ceremonial imagery, and celebratory floral motion.
- Maintain compatibility with the current DOM structure and IDs/classes already used by the site. Changing them without updating the corresponding script can break the invitation flow.
- When editing text content, keep the tone ceremonial and wedding-themed. Names, dates, venues, and family details are often personalized via the customizer logic.
- Favor minimal edits that match the existing design system and animation style.

## Important behavioral notes

- The invitation contains a cinematic envelope opening sequence. Any changes to the overlay, button logic, or transitions should keep the experience smooth and intentional.
- Audio playback is browser-gated and may require a user interaction before playing. Do not remove the autoplay safety fallback without understanding the UX impact.
- The page stores personalization data in `localStorage` under the wedding invitation key. Preserve this behavior when modifying the customization flow.
- Petal animation and audio are initialized on page load in `app.js`; this is the main integration point for interactive effects.

## Editing guidance

- HTML changes should focus on content and section layout while preserving the ceremony storytelling flow.
- CSS changes should remain consistent with the luxury North Indian wedding aesthetic already established in `style.css`.
- JavaScript changes should be small, explicit, and aligned with the existing functions and custom classes already defined in the project.
- If new media assets are added, place them in `assets/` and reference them with project-relative paths.

## Verification

This repository does not include automated tests or a package.json file. The primary verification is to preview the site in a browser and check that:

1. The page loads without console-breaking errors.
2. The envelope interaction and main invitation flow still work.
3. Audio controls, petal effects, and customizer updates behave as expected.
4. Styling remains visually consistent across major sections.

A simple local preview command is:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## When making changes

- Prefer surgical updates over rewrites.
- Keep the site fast and single-file friendly.
- Respect the project’s aesthetic identity and existing script connections before adding new features.
