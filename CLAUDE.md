# Virtual Stylist (VTO) prototype

Read `README.md` first. Multi-fascia Virtual Try On journey, re-cut on 10 Sep 2026 as the **Virtual Stylist** entry point. No build step.

## Files

- `index.html` — review shell in Jake's standard format (review-prototype skill): top bar = title · **fascia chips** · Desktop/Mobile · width preset · width · Full page/Fold · status · Restart · Screenshot (DS `assets/ds/proto-shot.js`, copied verbatim) · Export (zip: full-page 390 + 1440 PNGs of the current step, config.json, the code). Fascias go across the top, never down the left (Jake, 22 Oct 2026). Left panel: journey steps, product card, notes. Talks to the page over `postMessage` (`vtoSet`, `vtoJump`, `vtoReset` in; `vtoState`, `vtoReady` out).
- `vto.html` — the page. One PDP + the overlay, skinned entirely from CSS custom properties that `applyBrand()` sets from `brands.js`. `?brand=` picks the fascia, `?step=` jumps to a state.
- `live-pdp.css` / `live-pdp.js` / `brands-live.js` — the shared live-PDP module (same files in core-pdp-2026). The PDP is rendered by it; `brands-live.js` holds the live product + page facts per fascia. Edit the module once, copy to both repos.
- `brands.js` — the overlay's brand facts: tokens, font, `theme: 'dark'|'light'`, USP copy, Deliver+ lockup key, product. Add a fascia here (plus `assets/brands/<key>.svg` and `assets/products/<key>/`), never in the HTML.

## Conventions

- Surgical edits. Fetch the Figma node (desktop MCP at 127.0.0.1:3845/mcp when the connector is unauthorised) before changing any UI.
- Colours are the signed-off Colour Alignment set + SEEL Deliver+ branding, checked against live. Production is canonical; where signed-off and live disagree, use signed-off and leave a comment in `brands.js`.
- Icons render in fixed square boxes (12/16/20/24/32) with `object-fit: contain`; Figma SVG exports have `preserveAspectRatio="none"` stripped at ingest.
- Camera screens use the system font on purpose (native iOS UI). Everything else uses the fascia font.
- No emojis. No em dashes in copy. Copy is instructional, not marketing.
- Add a Photo carries the AI disclaimer ("You are interacting with generative AI technology. By continuing...", links in the button colour) instead of the 18+ consent checkbox, plus the 5-a-day line (Jake, 22 Oct 2026; core-brand frames Section 1, Figma 15694-22630). No My Wardrobe copy, no add-photo rail button.
- Core-brand overlay colours follow Section 1: boohoo pink #F8B5CC with black ink, Debenhams aqua, PLT garnet on a square cream sheet, boohooMAN white. KM buttons are black (DS rule, 21 Oct). The loading progress fill is always the button colour (`--sheet-cta`).
- Result watermark: white, 70%, 103px wide, Figma 15550-23882 slot (x 143 / y 632 of 390 x 844 = centred, 180px off the bottom), every fascia.
- Switching fascia in the shell re-skins in place — never reset the journey to the PDP (Jake, 10 Sep).
- Size and swatch rows run edge to edge and scroll off the right margin — never clipped (Jake, 10 Sep).
- PDP chip treatment is per fascia (`chip` in brands.js): PLT filled primary rectangle, left-aligned, 12px uppercase; the others a centred white pill.
- Five try-ons a day, one photo per try-on. No Add Another Photo, no Virtual Wardrobe, no account page. Do not bring them back without a brief.
- Result image = `product.result` (a full-length model shot) or the first product image. boohoo keeps the real generated look from Figma (`assets/img/result-jersey.png`).
- Camera: real `getUserMedia`; a pending permission prompt falls back to `assets/img/bodyshot.png` after 2.5s so the flow demos headless and on desktop.

## Commands

- `python3 -m http.server 8000` (or `npm run serve`) — assets need HTTP.
- `npm run tunnel` — HTTPS URL for on-device camera testing.
- QA: headless Chrome against the local server, `vto.html?brand=<key>&step=<step>` at 390×844 with `--virtual-time-budget`, contact-sheet every fascia per step.
