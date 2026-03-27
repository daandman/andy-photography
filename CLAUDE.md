# Andy Prosserman Photography — Project Context

## What this is
A personal photography portfolio website for Andy Prosserman (@daandman). Travel and wildlife photography. Built with plain HTML/CSS/JS — no frameworks, no build tools.

## Owner
- **Name:** Andy Prosserman
- **Instagram:** https://www.instagram.com/daandman
- **Email:** andy.pross@gmail.com
- **GitHub:** github.com/daandman

## File structure
```
andy-photography/
├── index.html        # Landing page (hero + featured photo grid)
├── galleries.html    # Gallery listing (4 gallery cards)
├── gallery.html      # Individual gallery view (?id= query param)
├── about.html        # About page
├── prints.html       # Coming soon print shop
├── contact.html      # Contact form
├── styles.css        # All styles (~1000 lines)
├── script.js         # All JS — dark mode, lightbox, JSON loader
├── photos.json       # SOURCE OF TRUTH — all photos, galleries, site config
├── serve.py          # Python HTTP server for local dev (port 3000)
└── CLAUDE.md         # This file
```

## The golden rule
**`photos.json` is the only file Andy ever needs to touch.** Everything on the site is driven by this file. Adding a photo = adding an entry to photos.json. Do not ask Andy to edit HTML or JS.

## How to add photos
1. Drop image file into `images/featured/` or `images/galleries/[gallery-id]/`
2. Add entry to `photos.json` under `featured` or the relevant gallery's `photos` array
3. Format: `{ "src": "path/to/photo.jpg", "alt": "Description", "location": "Place, Country" }`
4. Commit and push to GitHub — site updates automatically via GitHub Pages

## Photo guidelines
- Resize to ~2000px on the long edge before adding
- Export JPEG at 80% quality
- File names: lowercase, hyphens, no spaces (e.g. `uganda-gorilla.jpg`)
- Photos adapt to any aspect ratio via `object-fit: cover`

## Galleries
| ID | Title | Description |
|---|---|---|
| wildlife | Wildlife | Gorillas, penguins, and everything in between |
| street | Street \| General | City scenes, architecture, everyday life |
| landscapes | Landscapes \| Cityscapes | Mountains, coastlines, deserts, skylines |
| by-region | By Region | Browse by destination |

## Tech decisions made
- **No framework** — Andy is non-technical, plain HTML is easiest to maintain and host free
- **JSON-driven** — single source of truth, Andy never touches HTML
- **Dark mode** — toggle in nav, persists via localStorage
- **Mixed grid** — 4-col grid with some photos spanning 2 cols/rows for visual interest
- **Scroll animations** — IntersectionObserver fade-in on photo cards
- **Lightbox** — keyboard nav (arrows + Escape), click outside to close
- **Hero** — full-bleed, first featured photo as background, transparent-to-solid header on scroll

## Local dev
The Python server can't run from iCloud Drive due to permissions. Copy to /tmp first:
```bash
cp -r ~/Library/Mobile\ Documents/com~apple~CloudDocs/Claude/Code/andy-photography /tmp/andy-photography
python3 /tmp/andy-photography/serve.py
```
Then open http://localhost:3000

## Hosting
- **Code:** GitHub (github.com/daandman/andy-photography)
- **Live site:** GitHub Pages (to be set up)
- **Domain:** heyandy.co at Namecheap (previously pointed to Squarespace — needs re-pointing to GitHub Pages)
- **Contact form:** Formspree (to be wired up)

## Still to do
- [ ] Set up GitHub Pages
- [ ] Point heyandy.co domain from Namecheap to GitHub Pages
- [ ] Wire up Formspree for the contact form
- [ ] Replace placeholder images (picsum.photos) with Andy's real photos
