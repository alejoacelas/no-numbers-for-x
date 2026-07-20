(() => {
  "use strict";

  const COUNT_CLASS = "no-numbers-for-x-count";
  const ENGAGEMENT_DETAIL_PATH = /^(\/[^/]+\/status\/\d+)\/(?:analytics|retweets(?:\/with_comments)?|likes)\/?$/;
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

  function redirectFromEngagementDetails() {
    const match = location.pathname.match(ENGAGEMENT_DETAIL_PATH);
    if (!match) return false;

    location.replace(`${location.origin}${match[1]}`);
    return true;
  }

  function blockEngagementDetailClick(event) {
    const link = event.target.closest?.("a[href]");
    if (!link) return;

    const destination = new URL(link.href, location.href);
    if (!ENGAGEMENT_DETAIL_PATH.test(destination.pathname)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function hideCountText(target) {
    for (const span of target.querySelectorAll("span")) {
      if (HAS_NUMBER.test(span.textContent || "") && !span.querySelector("svg")) {
        span.classList.add(COUNT_CLASS);
      }
    }
  }

  function hideCounts() {
    scheduled = false;
    if (redirectFromEngagementDetails()) return;

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

  document.addEventListener("click", blockEngagementDetailClick, true);

  if (redirectFromEngagementDetails()) return;

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
