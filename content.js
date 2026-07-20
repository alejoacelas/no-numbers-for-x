(() => {
  "use strict";

  const COUNT_CLASS = "no-numbers-for-x-count";
  const ENGAGEMENT_TARGETS = [
    'article [data-testid="reply"]',
    'article [data-testid="retweet"]',
    'article [data-testid="unretweet"]',
    'article [data-testid="like"]',
    'article [data-testid="unlike"]',
    'article [data-testid="bookmark"]',
    'article [data-testid="removeBookmark"]',
    'article a[href$="/analytics"]',
    'article a[href*="/analytics?"]',
    'article a[href$="/retweets"]',
    'article a[href*="/retweets/with_comments"]',
    'article a[href$="/likes"]'
  ].join(",");

  const HAS_NUMBER = /\d/;
  let scheduled = false;

  function hideCountText(target) {
    for (const span of target.querySelectorAll("span")) {
      if (HAS_NUMBER.test(span.textContent || "") && !span.querySelector("svg")) {
        span.classList.add(COUNT_CLASS);
      }
    }
  }

  function hideCounts() {
    scheduled = false;
    for (const target of document.querySelectorAll(ENGAGEMENT_TARGETS)) {
      hideCountText(target);
    }
  }

  function scheduleHide() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(hideCounts);
  }

  const observer = new MutationObserver(scheduleHide);

  function start() {
    hideCounts();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.body) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
