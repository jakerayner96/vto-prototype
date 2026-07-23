# VTO Prototype

Single-file HTML prototype of the Virtual Try On first-use journey. All UI is pixel-matched to the Figma file "VTO - Virtual Wardrobe" (key: LxHqA4rFpRYNWJu8vzn18X). Assets are exported via the Figma MCP asset endpoint.

## Conventions

- Surgical patch-only edits. Do not rewrite index.html; change only the lines needed.
- Pixel-perfect against Figma. Do not substitute icons, fonts, sizes, spacing or copy. Fetch nodes via the Figma MCP before implementing any UI change.
- Brand skin is boohoo: primary #f8b5cc, Montserrat throughout. Camera screens use system font (-apple-system) intentionally, matching native iOS UI.
- No emojis anywhere. No em dashes in any copy.
- Copy register is functional and instructional, not marketing-led.
- Framework-level thinking: colours and brand assets should stay swappable per brand (Debenhams, Boohoo, PLT, BoohooMan, Karen Millen).

## Structure

- index.html: entire prototype (styles, markup, journey logic). Screens: PDP, VTO landing (Add a Photo), camera (real getUserMedia), review, two-phase 30s loading, result, Added to Bag sheet, Account Landing. Background generation path: pulsing AI icon on account, 6px #bb305f dot plus toast on ready.
- Layout is fluid responsive (designed at 390 wide, no fixed frame, no transform scaling). Bottom sheets carry env(safe-area-inset-bottom).
- Account Landing: opened via the header account icon (tap again to return to the PDP). Three design options B/C/D differ in badge treatment on the Virtual Wardrobe, Subscribe and Save, and Premier rows; tapping the boohoo logo on this page cycles B > C > D. Option A was dropped at Jake's request.
- Header banners differ by page to match Figma: PDP is black then pink (#ffe0eb) with the code; Account is grey (#fafafa) then black with the code. PDP bag counter is #bb305f.
- embed-assets.js: inlines Figma asset URLs as base64 (run once, within 7 days of asset export). Account page assets were inlined directly at build time.

## Commands

- npm run embed: make assets permanent (requires network access to figma.com)
- npm run serve: local server on port 8000
- npm run tunnel: public HTTPS URL for on-device testing (camera requires HTTPS)

## Known intentional quirks (match the Figma file; fix at source first)

- Toast copy reads "Your Virtal Try On is ready" (typo exists in the Figma component).
- Toast View link is #00787d (group teal token) while the flow is boohoo pink.
- Added to Bag modal was aqua in Figma; overridden to boohoo pink here at Jake's request. Continue Shopping border uses primary pink pending the boohoo Dark 2 hex.
