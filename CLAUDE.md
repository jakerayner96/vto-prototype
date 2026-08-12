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

- index.html: entire prototype (styles, markup, journey logic). Screens: PDP, VTO landing (Add a Photo / Add Another Photo), camera (real getUserMedia), review, two-phase loading (analysing 3-6s then creating 3-6s, randomised per run), result, Added to Bag sheet, Account Landing, Virtual Wardrobe. Background generation path: pulsing AI icon on account, 6px #bb305f dot plus toast on ready.
- Subsequent use: after a look exists the VTO chip carries a #bb305f count badge and opens the result directly; reopening mid-generation shows the Nearly Ready state. No Continue Shopping button on loading (removed in Figma). Result note links to the wardrobe; share uses navigator.share (native sheet on device).
- Daily usage (5 try-ons per day) is communicated from the first generation, not just at the limit (gap flagged independently by Scott and Olivia). The landing sheet states the allowance under the CTA row (Max limit of 5 try ons per day, per Figma node 15341-20927, which also refreshed the disclaimer to "generative AI technology" / "Terms & Conditions") and counts usage once tries are spent; the loading screen carries a grey counter line and the result screen a pill (top-left, mirrors the circle buttons exactly: 32px at top 20, the Ellipse 10 gradient at .9 plus 2px backdrop blur), both reading "N of 5 today". The warning "This is your last try-on today" uses the expiry-chip treatment (white bg, #d33f3f); on the landing it fires at 4 used (the try about to start is the last), on loading/result at the fifth. When the 4th generation completes, a Try On Limit modal (patterned on the Figma error-modal set) interrupts before the reveal; Continue proceeds to the result. On the background path the modal raises after the next result reveal instead. At 5 used the PDP chip is disabled (grayscale, .45 opacity, pointer-events none); the toast can still open a ready look. Each startGenerating() spends a try; photo-check analysing runs do not count and hide the counters (photomode). Hidden review target: tapping the result pill cycles the count 1-5 so every state demos without real generations (recover from a disabled chip via wardrobe View Look, then tap the pill). Proposed pattern, not in the Figma file; the hard Daily Usage Limits Exceeded modal remains unbuilt.
- VTO chip is white with the #bb305f hanger icon. Result rail is three buttons (close, share, plus); plus opens Add Another Photo presented over the current look, not the blurred backdrop. With 2+ looks the result canvas is swipeable with a pagination dots pill; look 2 uses Jake's supplied terrace photo, unmirrored so the jersey print reads correctly. All circle buttons carry the dark gradient disc (the original Figma export of Ellipse 10 was empty; use the re-exported asset).
- Virtual Wardrobe page (Figma sections: Account Core Journey, View and Sort, Wardrobe Tile Types, Add to bag, View Look, Add/Change/delete a photo): opened from the Virtual Wardrobe row on Account (back chevron returns). Top block is Your Try-On Photo with three states (No Photo dashed card with Add Photo, Photo Added with Change Photo/Delete, Expiring in red). Your Looks grid shows tiles in states: fresh (no chip), 5/3/1 days left chips, Out Of Stock (neutral #f1dce3 button, View Look still active), Expired (grey media, camera-plus icon, Create New Look). Expired + OOS tiles are removed entirely. View toggle next to Most Recent switches grid and full width; the sort dropdown offers Most Recent, Best Sellers, Price: Low-High, Price: High-Low, Newness (label only). Tile 1 carries a #bb305f NEW chip until the look is viewed. Tile size rows are native selects; Add to Bag with no size picked shakes the size field and turns it red (per spec); picking an in-stock size re-enables an Out Of Stock button. Tile adds populate the Added to Bag sheet with that tile's product data. Empty state: grey hanger, No looks yet. Wardrobe shows empty until the first look is generated; tile 1 is the session look, other tiles are the Figma demo products. Add/Change Photo opens the modal over the dimmed wardrobe (photomode, no product blur; title swaps to Change Your Photo when a photo exists), runs camera then an analysing-only step and returns to the wardrobe. Create New Look regenerates from the stored photo or asks for one. iOS permission alerts and the four photo error modals (multiple people, not suitable, generic, daily limit) are not built; they have no trigger in a web prototype. The B/C/D layout exploration and wardrobe logo cycling were removed, superseded by this design.
- Layout is fluid responsive (designed at 390 wide, no fixed frame, no transform scaling). Bottom sheets carry env(safe-area-inset-bottom).
- Account Landing: opened via the header account icon (tap again to return to the PDP). Three design options B/C/D differ in badge treatment on the Subscribe and Save and Premier rows (the Virtual Wardrobe row dot was removed at Jake's request; C shows a NEW pill, D shows dot + NEW); tapping the boohoo logo on this page cycles B > C > D. Option A was dropped. Account and wardrobe pages slide in as native-style pushes with staggered content; the header chrome stays static and only the page content animates.
- Header is identical on every page at Jake's request: black USP banner then pink (#ffe0eb) with the code. Bag counter is black; the VTO chip count badge and account ready-dot are #bb305f.
- embed-assets.js: inlines Figma asset URLs as base64 (run once, within 7 days of asset export). Account page assets were inlined directly at build time.

## Commands

- npm run embed: make assets permanent (requires network access to figma.com)
- npm run serve: local server on port 8000
- npm run tunnel: public HTTPS URL for on-device testing (camera requires HTTPS)

## Known intentional quirks (match the Figma file; fix at source first)

- Toast copy reads "Your Virtal Try On is ready" (typo exists in the Figma component).
- Toast View link is #00787d (group teal token) while the flow is boohoo pink.
- Added to Bag modal was aqua in Figma; overridden to boohoo pink here at Jake's request. Continue Shopping border uses primary pink pending the boohoo Dark 2 hex.
