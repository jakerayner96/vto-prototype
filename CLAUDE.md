# Virtual Stylist (VTO) prototype

Read `README.md` first. Multi-fascia Virtual Try On journey, re-cut on 10 Sep 2026 as the **Virtual Stylist** entry point. No build step.

## Files

- `index.html` — review shell (top bar + left panel), same chrome as the PLP / Core PDP configurators in debenhamsgroup.design and core-pdp-2026. **No configuration**: fascia list, journey steps, product card, notes. Talks to the page over `postMessage` (`vtoSet`, `vtoJump`, `vtoReset` in; `vtoState`, `vtoReady` out).
- `vto.html` — the page. One PDP + the overlay, skinned entirely from CSS custom properties that `applyBrand()` sets from `brands.js`. `?brand=` picks the fascia, `?step=` jumps to a state.
- `brands.js` — the only place brand facts live: tokens, font, `theme: 'dark'|'light'`, USP copy, Deliver+ lockup key, product. Add a fascia here (plus `assets/brands/<key>.svg` and `assets/products/<key>/`), never in the HTML.

## Conventions

- Surgical edits. Fetch the Figma node (desktop MCP at 127.0.0.1:3845/mcp when the connector is unauthorised) before changing any UI.
- Colours are the signed-off Colour Alignment set + SEEL Deliver+ branding, checked against live. Production is canonical; where signed-off and live disagree, use signed-off and leave a comment in `brands.js`.
- Icons render in fixed square boxes (12/16/20/24/32) with `object-fit: contain`; Figma SVG exports have `preserveAspectRatio="none"` stripped at ingest.
- Camera screens use the system font on purpose (native iOS UI). Everything else uses the fascia font.
- No emojis. No em dashes in copy. Copy is instructional, not marketing.
- The consent checkbox never disables Camera / Upload (Jake, 10 Sep).
- PDP chip treatment is per fascia (`chip` in brands.js): PLT filled primary rectangle, left-aligned, 12px uppercase; the others a centred white pill.
- Five try-ons a day, one photo per try-on. No Add Another Photo, no Virtual Wardrobe, no account page. Do not bring them back without a brief.
- Result image = `product.result` (a full-length model shot) or the first product image. boohoo keeps the real generated look from Figma (`assets/img/result-jersey.png`).
- Camera: real `getUserMedia`; a pending permission prompt falls back to `assets/img/bodyshot.png` after 2.5s so the flow demos headless and on desktop.

## Commands

- `python3 -m http.server 8000` (or `npm run serve`) — assets need HTTP.
- `npm run tunnel` — HTTPS URL for on-device camera testing.
- QA: headless Chrome against the local server, `vto.html?brand=<key>&step=<step>` at 390×844 with `--virtual-time-budget`, contact-sheet the seven fascias per step.
