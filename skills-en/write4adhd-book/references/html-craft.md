# HTML page craft

## Choosing a format (decide before you write)

| Format | When to use it | Template | Resource layout |
|---|---|---|---|
| **Single self-contained page** | One short piece, or a small 1–3 page article (main piece + a couple of bonus pages) | `assets/skeleton.html` | All CSS/JS inlined per page, zero dependencies, opens with a double-click |
| **Book site (multi-page)** | A chaptered long-form explainer book, or a multi-chapter piece written after exploring a technical project | the whole `assets/site/` directory | Shared `style.css` + `shared.js`, one HTML file per chapter |

Rule of thumb: **3 pages or fewer → single self-contained page; more than that → book site**, so the same CSS/JS isn't copy-pasted into a dozen files (a waste of tokens and a maintenance trap). Both formats share exactly the same design language: `site/style.css` and `site/shared.js` are the same source as the inlined versions in `skeleton.html`, so **when you change one, sync the other**.

Either way: no external resources of any kind (no fonts, no images, no CDNs). The whole page/site must work offline.

Starting point: copy the matching template and replace the placeholder content only. Never hand-write a page from scratch.

## Book site file layout

```text
book/
├── index.html        # cover + table of contents (one .toc-item card per chapter)
├── ch1.html          # chapter page, copied from the chapter.html template
├── ch2.html
├── …
├── side-xxx.html     # bonus page, same chapter template, badge switched to "Bonus"
├── style.css         # shared stylesheet
└── shared.js         # shared script (Canvas helpers, animation scaffolding, theme switching)
```

Book site conventions:

- **Page split**: 1–3 sections per page. Don't cram every chapter into one page; each page must still read on its own (do the soft recap in its intro).
- **The three navigation pieces**: `← Contents` (`.back-link`) at the top of every chapter page, `.pager` at the bottom (Previous / Contents / Next), and one hooky blurb per chapter on the TOC page. This is how the ADHD-friendly rule about "a sense of progress" gets implemented.
- The **anti-flash theme init script** (~3 lines) must be inlined in the `<head>` of every page. It cannot live in shared.js — that loads too late, and dark-theme users get a white flash first.
- Page-specific diagram code goes in an inline `<script>` at the bottom of the page, after `<script src="shared.js"></script>`.
- Name files with semantic lowercase hyphenated words (`ch1.html`, `side-backup.html`) and use relative paths for every link.

## Page skeleton

Below is the single-page format. A book site chapter page has the same skeleton, except the `<style>` block and the big trailing `<script>` are replaced by references to `style.css`/`shared.js`, plus `.back-link`, `header.chapter-head` and `.pager` (see the `site/chapter.html` template).

```text
<head>
  anti-flash theme init script (reads localStorage, falls back to prefers-color-scheme)
  <style> all CSS variables + component styles </style>
<body>
  .theme-switcher        fixed ☀️/🌙 theme toggle in the top-right corner
  .container
    header               h1 headline (plainly names the subject) + .subtitle (main piece/cover: core metaphor + what the reader will know by the end)
    section × N          one <section> per chapter, h2 carrying a <span class="num">N</span> badge
    .closing             the closing block of the wrap-up chapter
    .end-mark            the "· · ·" end-of-piece mark
    footer
  <script> Canvas helpers + diagram/animation code + theme-switch redraws </script>
```

The subtitle must match the style, and it is where the core metaphor comes in (see rule 3 of the style guide), e.g.: "Turns out it's just a locker you rent inside someone else's gym: cloud storage in one sentence, including where your files actually sit."

## Design conventions

- Fonts: the system stack `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; code/monospace uses `"JetBrains Mono", "Fira Code", "Cascadia Code", monospace` (font-family declarations only — no webfonts are loaded).
- Body text is `font-size: 17px; line-height: 1.85` (generous line height is part of being ADHD-friendly; don't shrink it).
- Content max width `--max-width: 1152px`, centered container, 24px horizontal padding.
- Every color goes through a CSS variable: `:root` defines dark (the default), `[data-theme="light"]` overrides it with light. The variable set is `--primary / --primary-light / --primary-soft / --accent / --accent-light / --green / --green-light / --purple / --purple-light / --text / --text-muted / --text-light / --bg / --surface / --border / --radius / --max-width`.
- Primary is blue, accent is orange, green/purple serve as secondary diagram colors. `strong` renders in the accent color; `em` renders as an accent-tinted pill (used to mark the "official name" of a term).
- Mobile breakpoint `@media (max-width: 600px)` shrinks headings and padding.

## Available components (all demonstrated in the skeleton)

| Component | Class | Purpose |
|---|---|---|
| Chapter number | `h2 > .num` | The rounded number block in front of each chapter title |
| Highlight card | `.card` | A small aside, with `code` styling inside |
| Q&A box | `.callout` (orange) / `.callout.blue` | Self-posed questions, reader objections |
| Formula box | `.formula-box` + `.big` | The whole piece's core formula, e.g. `front counter + pass-through window + kitchen = takeout` |
| Flow pills | `.flow-list > .flow-step` + `.arrow-sep` | A horizontal step chain: A → B → C |
| Diagram container | `.diagram-wrap` | Wraps the canvas + a `.caption` in plain words |
| Animation control bar | `.anim-bar > .anim-btn` | Pause / step / replay buttons |
| End mark | `.end-mark` | "· · ·" |
| Bonus / chapter badge | `.badge` | The pill at the top of a page: "Bonus", "Chapter N"; link to a bonus page from the body with "👉 … see the bonus page: *…* " |
| TOC card | `.toc > .toc-item` (bonus pages use `.toc-item.side`) | Book site TOC: number block + title + one hooky blurb |
| Chapter navigation | `.back-link` / `.pager` | "← Contents" / Previous · Contents · Next |
| Chapter page head | `header.chapter-head` | A compact, left-aligned page head (vs. the cover page) |

## Canvas diagram conventions

- Hand-draw everything with `<canvas>` — no SVG images, no external images. The design space is fixed (about 680 wide, 280–360 tall depending on content); `setupCanvas()` handles DPR and scales proportionally on narrow screens.
- Colors come from `getColors()`, which reads the current theme's CSS variables, **so diagrams stay legible in both light and dark**. On theme switch, every diagram redraws through the `__redraws` registry.
- Reuse the helpers: `roundRect` / `drawBox` (rounded box with multi-line text) / `drawArrow` (connector with an arrowhead) / `drawLabel` (multi-line label). Keep the visual language "sketchy diagram": rounded boxes + arrows + big labels. Don't chase polish, and feel free to state "illustrative, not to scale" in the caption.
- At least one diagram per chapter, explaining the core mechanism. Every caption must be plain words saying what the diagram wants you to see (see rule 8 in the style guide).

## Animation conventions (ADHD-friendly)

- Turn process-y concepts into **step animations** whenever possible: the skeleton provides `setupAnim(id, spec)`, where `spec.draw(ctx, w, h, step, t)` draws one step and `t` is the 0→1 progress within that step.
- Three-button control bar: `⏸ Pause / ▶ Play` (toggles), `Next ▸` (single step), `↺ Replay`. Button ids follow the convention `<canvas-id>-play / -step / -reset`.
- **Autoplay by default**, but use `IntersectionObserver` to pause automatically when the canvas scrolls out of the viewport (saves battery, doesn't hijack attention) and resume when it scrolls back.
- For a static diagram, `setupCanvas(id, drawFn)` is enough — no control bar needed.

## Theme switching

- Inline an immediately-invoked script in `<head>` that reads the theme from `localStorage` (pick your own key, e.g. `xxx-theme`) before the first paint, falling back to `prefers-color-scheme` when there's no record — this is what spares dark-theme users the white flash.
- The toggle button updates the `data-theme` attribute, writes localStorage, then calls every function in `__redraws` to redraw the diagrams.

## Main piece + bonus pages

- A bonus page gets a `.badge` reading "Bonus" at the top plus a back link (to the main piece in single-page form, into the `.pager` navigation in book form).
- Link from the main piece: `👉 Curious about …? See the bonus page: <a href="xxx.html">Title</a>`; open the bonus page with the hand-off "After reading the main piece, you might be wondering: …".
- In single-page form each piece carries a full copy of the same CSS/JS (self-containment beats DRY); in book form they naturally share `style.css`/`shared.js`.

## Verification

- When you're done, open it in a browser and check: light and dark themes, narrow (~375px) and wide screens, animation play/pause/step/replay, and that every link is clickable.
- When playwright MCP is available in the environment, take screenshots in both themes and inspect layout and diagram rendering yourself.
