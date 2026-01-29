# Theology of Ambition

A minimal, editorial website for a collaborative book project exploring redeemed ambition under the lordship of Christ.

## Project Purpose

This site serves as the public face for a theological book project that gathers pastors, theologians, and practitioners to ask: What does redeemed ambition look like?

**Core thesis:** Ambition is not something to eliminate, but something to heal, order, and aim under the lordship of Christ.

## Site Structure

- `/` — Home (thesis and project introduction)
- `/about` — About the project, audience, editor's role
- `/thesis` — Full theological framework
- `/contributors` — Invitation for essay contributions
- `/contact` — Contact information

## Design Philosophy

- **Editorial, not promotional** — Quiet confidence, not startup energy
- **Content-first** — Large margins, generous line spacing, reading-optimized
- **Minimal** — System fonts for body, Instrument Serif for headlines
- **No distractions** — No gradients, no animations, no hero images

## Development

### Prerequisites

- Node.js 18+
- npm

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
npm run build
```

This generates a static export in `.next/` that can be deployed anywhere.

### Deploy

**Vercel (recommended):**
```bash
npx vercel
```

**Netlify:**
```bash
npm run build
# Upload .next folder or connect to Git
```

**Any static host:**
Add `output: 'export'` to `next.config.ts` for static HTML export.

## Updating Content

All content lives in page files:

- `src/app/page.tsx` — Home
- `src/app/about/page.tsx` — About
- `src/app/thesis/page.tsx` — Thesis
- `src/app/contributors/page.tsx` — Contributors
- `src/app/contact/page.tsx` — Contact

Edit the JSX directly. No CMS, no database.

### Update the contact email

Search for `your-email@domain.com` and replace with your actual email in:
- `src/app/contributors/page.tsx`
- `src/app/contact/page.tsx`

## Design System

Design tokens are defined in `src/app/globals.css`:

```css
--ink: #1a1a1a;      /* Primary text */
--paper: #faf9f6;    /* Background */
--stone: #6b6b6b;    /* Secondary text */
--mist: #e8e6e1;     /* Borders */
--accent: #8b7355;   /* Accent (links on hover) */
```

## Future Extensions

- Add favicon (`public/favicon.ico`)
- Add Open Graph image (`public/og-image.png`)
- Add simple analytics (Plausible or Fathom)
- Convert email link to contact form if needed

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) (Google Fonts)
- TypeScript

## License

Content is proprietary. Code structure may be reused with attribution.
