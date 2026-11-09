# Virtual Stylist v2

**Live:** https://jakerayner96.github.io/vto-prototype/v2/ · v1 stays at `/vto-prototype/` · 2 Nov 2026

## What changed from v1
- **PDP = the DS master PDP.** `vto.html` has no PDP of its own. It fetches debenhamsgroup.design `templates/pdp.html` as it stands (same as `projects/master/page.html`) and adds `vs.js`. So the page always has the latest DS components (buy stack, Ask Deb, membership, Deliver+, delivery grid, BNPL, Subscribe & Save, Bundling, rails), and the template's own Virtual Stylist chip opens the flow. The live-PDP module (`live-pdp.*`, `brands-live.js`) is v1 only.
- **Launch screen = DS Virtual Stylist intro** (`assets/ds/vs-intro.js`, catalogue `vs-intro`). It shows How it works (3 steps), photo tips (2 × 2), the 18+ consent row (a record, not a gate; the whole row toggles), Camera / Upload side by side with their icons (as v1) and the 5-a-day note. It slides up on phones and is centred (`.mdl--md`) from 600px.
- **Camera / Upload as live (3 Nov).** Same as debenhams.com: Camera is the phone's own camera (`<input type=file accept=image/jpeg capture=user>`, front camera), Upload its photo picker; the photo is scaled to 2000px as a JPEG under 5MB. The consent box must be ticked first (else "Please tick the box above to continue"). **Crop:** v2 always adds our 2:3 Move and Scale step after the photo (live sends it straight to the try-on).
- **Start screen (final, 9 Nov).** Jake's design, Figma LxHqA4rFpRYNWJu8vzn18X 15921-1329: Welcome to Virtual Stylist, one intro line, an example photo beside four photo tips (plain text, nothing that looks tappable), then consent, Camera / Upload and the note. It slides up on phones, hugging its content. The earlier layout options are retired.
- **Crop = our Move and Scale step, always on in v2.** It comes after Camera (Retake / Use Photo) or the library (Cancel / Choose). The photo moves and scales under a fixed frame and always covers it: drag, pinch, scroll wheel, double-tap. The crop feeds the loading screen. Frame: **2:3 portrait**, the result shape. This needs building on web (the browser has no crop step) and a custom crop view in the app (the iOS picker's own crop is square only).
- **Bag + limit = DS.** Add to bag uses the DS toast (Top, actionable) and bumps the header bag count, as the Master prototype does. The daily limit uses the DS modal (`.mdl--alert`).
- Loading and result screens are as v1, with the signed-off VTO overlay colours from `../brands.js`. Type, radius and case come from the DS tokens.

## Files
- `index.html`: the review shell (v1 shell plus a Crop frame card). The fascias are the ones the DS PDP template has. Dorothy Perkins and Coast have no DS product yet, so they are left out.
- `vto.html`: the loader (DS template + `vs.js`). Params: `?brand=`, `?step=pdp|intro|crop|loading|result|bag|limit`.
- `vs.js`: the Virtual Stylist layer. Protocol: in `vtoSet {brand,crop}`, `vtoJump`, `vtoReset`, `vtoPing`; out `vtoReady`, `vtoState`, `vtoPong`.

## Local
Serve the folder that holds both clones (`vto-prototype/` and `debenhamsgroup.design/`) and open `/vto-prototype/v2/`. The DS is loaded from `../../debenhamsgroup.design/`, which is same-origin on GitHub Pages.

## Not done yet
- The Virtual Stylist intro is in code only, not yet in the DS Figma library.
- The chip count badge from v1 is gone. The DS AI tag chip has no badge, but the chip still reopens the look.
- Not banked into `templates/pdp.html`. It is listed under Not banked yet in the Master prototype.
