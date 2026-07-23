# VTO Prototype

Virtual Try On first-use journey, pixel-matched to the Figma file "VTO - Virtual Wardrobe". One HTML file, no build step.

## First run (do this within 7 days)

Asset URLs from the Figma MCP expire after 7 days. Make them permanent once:

```
npm run embed
```

This inlines every asset as base64 into index.html and keeps a backup at index.figma-urls.html.

## Preview on desktop

```
npm run serve
```

Open http://localhost:8000

## Preview on a phone (any network)

Camera access needs HTTPS, so either:

1. Host it: push index.html to a GitHub Pages repo or drag it onto Netlify Drop, then open the URL on the phone and Add to Home Screen for full-screen.
2. Tunnel it while iterating: run `npm run serve` in one terminal and `npm run tunnel` in another, then open the printed HTTPS URL on the phone.

## Journey

PDP > Virtual Try On chip > Add a Photo > Camera (real) or Upload (native picker) > review > Analysing (~4.5s) > Creating Your Outfit (30s total) > result. Close mid-generation and the AI icon pulses on the account button; on completion it becomes a dot and a toast offers View. Add to Bag closes the experience, ticks the bag counter and slides the Added to Bag sheet up over the PDP.
