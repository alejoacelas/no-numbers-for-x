import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

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
assert.match(content, /ENGAGEMENT_DETAIL_PATH/);
assert.match(content, /preventDefault/);
assert.match(content, /stopImmediatePropagation/);
assert.match(content, /location\.replace/);
assert.match(styles, /display: none !important/);
assert.match(styles, /pointer-events: none !important/);

let redirectedTo;
vm.runInNewContext(content, {
  document: { addEventListener() {}, body: null },
  location: {
    href: "https://x.com/alejo/status/123/analytics",
    origin: "https://x.com",
    pathname: "/alejo/status/123/analytics",
    replace(url) { redirectedTo = url; }
  },
  MutationObserver: class {},
  requestAnimationFrame() {},
  URL
});
assert.equal(redirectedTo, "https://x.com/alejo/status/123");

let clickHandler;
let prevented = false;
let stopped = false;
const normalDocument = {
  addEventListener(type, handler) {
    if (type === "click") clickHandler = handler;
  },
  body: {},
  querySelectorAll() { return []; }
};
vm.runInNewContext(content, {
  document: normalDocument,
  location: {
    href: "https://x.com/home",
    origin: "https://x.com",
    pathname: "/home",
    replace() {}
  },
  MutationObserver: class { observe() {} },
  requestAnimationFrame() {},
  URL
});
clickHandler({
  target: { closest: () => ({ href: "https://x.com/alejo/status/123/analytics" }) },
  preventDefault() { prevented = true; },
  stopImmediatePropagation() { stopped = true; }
});
assert.equal(prevented, true);
assert.equal(stopped, true);
console.log("Extension checks passed.");
