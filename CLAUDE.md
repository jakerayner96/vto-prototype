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

- index.html: entire prototype (styles, markup, journey logic). Screens: PDP, VTO landing (Add a Photo), camera (real getUserMedia), review, two-phase 30s loading, result, Added to Bag sheet. Background generation path: pulsing AI icon on account, 4px dot plus toast on ready.
- embed-assets.js: inlines Figma asset URLs as base64 (run once, within 7 days of asset export).

## Commands

- npm run embed: make assets permanent (requires network access to figma.com)
- npm run serve: local server on port 8000
- npm run tunnel: public HTTPS URL for on-device testing (camera requires HTTPS)

## Known intentional quirks (match the Figma file; fix at source first)

- Toast copy reads "Your Virtal Try On is ready" (typo exists in the Figma component).
- Toast View link is #00787d (group teal token) while the flow is boohoo pink.
- Added to Bag modal was aqua in Figma; overridden to boohoo pink here at Jake's request. Continue Shopping border uses primary pink pending the boohoo Dark 2 hex.
