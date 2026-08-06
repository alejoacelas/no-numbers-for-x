---
human_edit_tracking:
  enabled: true
  history: []
---
# No Numbers for X

I use this Chrome extension to hide reply, repost, like, bookmark and view counts on X while keeping the action buttons usable. It also blocks engagement-detail links and redirects direct analytics visits back to the tweet.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and choose this folder.

Disable the extension when I intentionally want to check the numbers.

## Check

Run `node test/check.mjs`, then open `test/fixture.html` in a browser. The icons and labels remain; the numbers disappear.
