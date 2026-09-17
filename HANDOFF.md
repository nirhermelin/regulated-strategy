# nirhermelin.com — handoff (main)

Written for whoever (or whatever model) picks this up next. Everything needed to continue is this file, the repo, and the content master (`Nir_Hermelin_Full_Website_Content.md`). No hidden context.

## 1. What this is

A rebuild of nirhermelin.com around Nir's method **Regulated Strategy** — business strategy + nervous-system work + AI — for entrepreneurs. Principle line that appears everywhere: *"Small enough for the nervous system. Real enough for the business."*

**Source of truth: `github.com/nirhermelin/regulated-strategy`.** The site lives at the root of that repo. Read and edit there; Vercel should deploy from it. A local copy may exist on Nir's Mac, and an earlier repo (`nirhermelin/website`) and an earlier version of the site exist, but none of those are part of this project — do not reference or reuse them.

The repo currently also contains leftovers from an earlier upload that the site does not use: `app.js`, root-level `organic.css` and `styles.css` (the live ones are in `css/`), and `summit/index.html` (an older, indexable summit page that duplicates `sovereign-reset.html`). Safe to delete; until then, don't edit them.

## 2. Stack and conventions

- Hand-written static HTML. No framework, no build step, no dependencies. Vanilla JS, two CSS files. Deploys as-is on Vercel (`vercel.json` sets `cleanUrls: true`, so `/about` serves `about.html`).
- Fonts via Google Fonts: Space Grotesk (UI/headings), Inter (body), Crimson Pro (serif display + italics).
- **Two stylesheets, loaded in order.** `css/styles.css` is the base design system (palette, buttons, nav, cards, forms, FAQ, footer). `css/organic.css` is the new layer on top: serif display type, hand-drawn line motif, gradient "field", pillars, lenses map, offers/stack, seven-lenses list, transcript flow, editorial notes list. When adding a component, put it in `organic.css`. Don't fork `styles.css`.
- Every page shares an identical `<header class="nav">` and `<footer class="footer">` block. There is no templating — if you change the nav or footer, change it in **all** HTML files (8 pages + 6 posts). A quick way: copy the block from `index.html` and regex-replace `<header class="nav">…</header>` and `<footer class="footer">…</footer>` in the others. Set `aria-current="page"` on the current page's nav link.
- Links are relative (`about.html`, `blog/index.html`, `../index.html` from inside `blog/`), so the site works from disk and from the repo root alike.
- Scroll-reveal: add class `reveal` (optional `style="--d:0.1s"` for stagger). Hand-drawn underline: the inline `<svg class="hand-line">` snippet used under each H1.
- `.photo-ph` blocks are labelled **photo placeholders**. There are no image files in the repo yet. Replace each with `<img>` (or a `.photo-frame` wrapper) when real photos exist. Labels describe the intended shot.

## 3. Pages

| File | Route | Notes |
|---|---|---|
| `index.html` | `/` | Hero, principle band, three pillars, knowing/doing, interactive lenses map, three offers, about teaser, transcript→brief flow, Field Notes teaser, free-reset CTA |
| `about.html` | `/about` | Story, business side, nervous-system section (dark band), music, AI, method origin, CV strip |
| `regulated-strategy.html` | `/regulated-strategy` | Seven lenses, AI inside the method, stretch/recover rhythm |
| `work-with-me.html` | `/work-with-me` | Compare cards → `#session`, `#lab`, `#advisory` details with "stack" tables, why-AI + transcript consent, FAQ |
| `free-reset.html` | `/free-reset` | Public lead-magnet page; button goes to Gumroad |
| `contact.html` | `/contact` | Form (Name, Email, What are you working on?, What seems to be getting complicated?) |
| `blog/index.html` | `/blog` | Field Notes: 4 featured "coming soon" + 6 earlier posts |
| `blog/*.html` | `/blog/<slug>` | Six earlier posts; CTAs point at the current offers |
| `sovereign-reset.html` | `/sovereign-reset` | **Hidden** summit landing page. `<meta name="robots" content="noindex, nofollow">`, `X-Robots-Tag` header in `vercel.json`, minimal nav (`nav-solo`), not linked anywhere |

`vercel.json` also redirects a few legacy URLs that may still be indexed or linked (`/method` → `/regulated-strategy`; `/quiz`, `/journal`, `/meeting-prep` → `/`; `/sprint` → `/work-with-me`; `/patterns/*` → `/blog`). Nothing needs to exist at those paths.

## 4. Design decisions (and why)

- **Serif for the big statements.** Space Grotesk alone read as a generic coaching template, so the site uses Crimson Pro for H1s and "display" H2s, with one italic copper word (`<em>`) as the accent. Palette: cream `#faf6ef`, ink `#1f1a13`, amber `#b8862e`, copper `#a8683f`, sage `#5f8663`, dark band `#171208`.
- **Organic, not rustic.** Irregular border-radius (`--radius-organic`), hand-drawn SVG underline that draws in, slow-drifting radial gradient "field" behind heroes and CTAs, wave/pendulation motion in the map. No leaves, no stock wellness imagery.
- **The map is lenses, not a ladder.** A single activation curve rising through fight/flight into freeze would imply a fixed biological sequence with fawn plotted on it — Nir explicitly rejected that. The map shows three horizontal *zones* (mobilised / regulated / shutdown) with a **pendulation wave** through them (stretch → recover → repeat) and **fawn as a hatched overlay spanning all zones**, because it is a relational protection strategy that can coexist with any activation level. Copy insists these are lenses, not diagnoses. Lens data lives in `js/main.js` (`LENSES` object) — edit text there, not in HTML.
- **Offer stacks show the obstacle each component removes**, never crossed-out dollar values. Prices shown once, plainly. "Founding" badges are the only scarcity cue.
- **Transcript privacy.** Every mention says "with your consent"; the flow diagram starts with a consent node; copy says nothing is recorded or analysed by default and silence triggers nothing.
- **No fabricated proof.** No client counts, workshop numbers or testimonials until Nir verifies them. The About CV strip lists only what's in the content master.
- **Shorter.** Copy is the content master, close to verbatim, with no filler added. Typography and interaction carry meaning instead.

## 5. Voice rules (from Nir's brief — keep these)

Intelligent, conversational, nuanced, occasionally funny. Concrete before conceptual. British/South African spelling (*analyse, organisation, programme*). Nervous-system work is prominent but never implies every business problem is dysregulation or childhood trauma. Fight/flight/freeze/fawn are lenses, not diagnoses or a linear sequence. Not "American guru" language. AI is one of three ingredients, not the headline. Never fabricate metrics, testimonials, certifications, or client names.

## 6. Open items / TODOs (search the HTML for `TODO(Nir)`)

1. **Gumroad URL** for *Regulation as Strategic Leverage* — `free-reset.html` and `sovereign-reset.html`, both buttons currently `href="#"` with attribute `data-gumroad`. The old `summit/index.html` in the repo links to `https://3671367553813.gumroad.com/l/natix`; confirm with Nir that this is the current product before using it.
2. **Booking / application links** — the three offer CTAs in `work-with-me.html` currently go to `contact.html?re=session|lab|advisory`. Replace with Calendly/Cal.com/Stripe/form links, or keep as enquiry.
3. **Contact form backend** — `js/main.js` opens a pre-filled `mailto:` on submit. Swap for Formspree/Basin/Vercel function when ready (the `data-contact-form` handler).
4. **Photos** — none exist yet. Wanted: business/work portrait, guitar/performance, relaxed island context. Replace `.photo-ph` placeholders.
5. **Four featured Field Notes** are "coming soon" entries (`.note-static`). When written, convert each to `<a href="slug.html">` and add a date. Categories: Business / Nervous System / AI / Field Note.
6. **CV strip** — add named companies/titles/logos/certifications only after verification (MBA school naming, startup metrics, music awards, somatic qualifications).
7. **Testimonials** — none included; add only with permission.
8. **Legal/privacy wording** for transcript processing and automated follow-ups.
9. Decide whether `/sovereign-reset` goes public after the summit (remove `noindex`, remove the `X-Robots-Tag` header, link it).

## 7. How to work on it

- Edit files directly in the `regulated-strategy` repo (GitHub web/app, a connected LLM with GitHub access, or a local clone). Every push deploys if the Vercel project is connected to the repo with Root Directory left at `/`.
- To preview locally, open `index.html` in a browser — relative links mean it works from disk.
- Quick QA checklist after edits: nav/footer identical across all files; every H1 has one `<em>` accent word max; `reveal` classes present on new sections; mobile at 390px has no horizontal scroll; the lenses map still renders (`.lens-wrap`, `#lensPanel`, `.lens-btn[data-lens]` must exist for `main.js`).

## 8. Files in the repo

```
/
├── HANDOFF.md              ← this file
├── index.html  about.html  regulated-strategy.html  work-with-me.html
├── free-reset.html  contact.html  sovereign-reset.html
├── blog/index.html + 6 posts
├── css/styles.css   (base system)   css/organic.css   (organic layer, load second)
├── js/main.js       (nav, reveal, lenses map, forms, FAQ)
└── vercel.json      (clean URLs, headers, redirects)
```

Source of truth for copy: `Nir_Hermelin_Full_Website_Content.md` (the content master Nir wrote). If copy in the HTML and the master disagree, the master wins unless Nir says otherwise.
