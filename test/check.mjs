import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(projectRoot, "manifest.json"), "utf8"));
const content = await readFile(path.join(projectRoot, "content.js"), "utf8");
const styles = await readFile(path.join(projectRoot, "styles.css"), "utf8");

assert.equal(manifest.manifest_version, 3);
assert.deepEqual(manifest.content_scripts[0].matches, ["https://x.com/*", "https://twitter.com/*"]);

for (const engagementSurface of [
  "reply",
  "retweet",
  "unretweet",
  "like",
  "unlike",
  "bookmark",
  "removeBookmark",
  "/analytics",
  "/retweets",
  "/likes"
]) {
  assert.ok(
    content.includes(engagementSurface) || styles.includes(engagementSurface),
    `Missing engagement surface: ${engagementSurface}`
  );
}

assert.match(content, /MutationObserver/);
assert.match(styles, /display: none !important/);
console.log("Extension checks passed.");
