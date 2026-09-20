# No Numbers for X decisions

## Core decisions

### Interface behavior

- [Hide engagement counts while preserving action controls](#decision-1).
- [Block alternate routes to engagement numbers](#decision-2).

## Details

<a id="decision-1"></a>

### Hide engagement counts while preserving action controls

The extension targets count text on replies, reposts, likes, bookmarks and views, leaving icons and actions usable. Keep support for dynamically inserted X content; hiding entire buttons would defeat the intended browsing workflow. See [content.js](content.js).

<a id="decision-2"></a>

### Block alternate routes to engagement numbers

Prevent engagement-detail clicks and redirect direct analytics/retweet/like-detail URLs back to the post. Disabling the extension remains the deliberate route for checking numbers; preserve the original post destination. See [test/check.mjs](test/check.mjs). History inspected: [7daf210](https://github.com/alejoacelas/no-numbers-for-x/commit/7daf210), [eb4e1c2](https://github.com/alejoacelas/no-numbers-for-x/commit/eb4e1c2).
