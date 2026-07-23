#!/usr/bin/env node
/**
 * embed-assets.js
 * Downloads every Figma MCP asset referenced in index.html and inlines it
 * as a base64 data URI, making the prototype permanent and self-contained.
 * A backup of the original is saved as index.figma-urls.html.
 *
 * Usage:  node embed-assets.js
 * Run within 7 days of the prototype being generated (asset URLs expire).
 * No dependencies. Node 18+.
 */

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "index.html");
const BACKUP = path.join(__dirname, "index.figma-urls.html");

(async () => {
  let html = fs.readFileSync(SRC, "utf8");
  const urls = [...new Set(html.match(/https:\/\/www\.figma\.com\/api\/mcp\/asset\/[a-f0-9-]+/g) || [])];
  if (urls.length === 0) {
    console.log("No Figma asset URLs found. Already embedded.");
    return;
  }
  fs.writeFileSync(BACKUP, html);
  console.log(`Found ${urls.length} unique assets. Backup saved to index.figma-urls.html`);

  let done = 0;
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`\nFAILED (${res.status}): ${url} - URL may have expired`);
      process.exit(1);
    }
    const mime = res.headers.get("content-type") || "image/png";
    const buf = Buffer.from(await res.arrayBuffer());
    html = html.split(url).join(`data:${mime};base64,${buf.toString("base64")}`);
    done++;
    process.stdout.write(`\r${done}/${urls.length} embedded (${(buf.length / 1024).toFixed(0)} KB)   `);
  }

  fs.writeFileSync(SRC, html);
  console.log(`\nDone: index.html (${(fs.statSync(SRC).size / 1024 / 1024).toFixed(1)} MB)`);
})();
