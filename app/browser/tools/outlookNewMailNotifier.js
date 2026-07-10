const { readUnreadCount } = require("./outlookUnreadCountObserver");

const MAX_NOTIFY_ATTEMPTS = 10;
const NOTIFY_RETRY_MS = 1000;
const BASELINE_WARM_MS = 2000;

const TIME_PATTERN = /\b\d{1,2}:\d{2}\b/;
const SENDER_TAG_PATTERN =
  /^(external|external sender|\[external\]|\[email\]|draft|forwarded|replied|re-sent)$/i;

function normalizeText(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

// Outlook renders each mail row as a set of leaf <span>s in a fixed order:
// [tag?] sender subject time preview. The time span (e.g. "08:37") is a
// reliable anchor: the subject sits immediately before it and the sender is
// the last non-tag span before the subject.
function extractRowSummary(row) {
  const aria = normalizeText(row?.getAttribute?.("aria-label"));
  if (!/^unread\b/i.test(aria)) return null;

  const spans = Array.from(row.querySelectorAll?.("span") || [])
    .filter((el) => el.children.length === 0)
    .map((el) => normalizeText(el.textContent))
    .filter(Boolean);
  if (spans.length < 2) return null;

  const timeIndex = spans.findIndex((text) => TIME_PATTERN.test(text));
  if (timeIndex < 1) return null;

  const subject = spans[timeIndex - 1];
  if (!subject) return null;

  let sender = "";
  for (let i = timeIndex - 2; i >= 0; i -= 1) {
    if (!SENDER_TAG_PATTERN.test(spans[i])) {
      sender = spans[i];
      break;
    }
  }
  if (!sender) sender = spans[0];

  const timeText = spans[timeIndex];
  return {
    title: sender,
    body: subject,
    key: normalizeText(`${sender}|${subject}|${timeText}`).toLowerCase(),
  };
}

function getUnreadMailSummaries(documentRef) {
  const rows = Array.from(
    documentRef?.querySelectorAll?.('[role="option"]') || []
  );

  const summaries = [];
  const seen = new Set();
  for (const row of rows) {
    const summary = extractRowSummary(row);
    if (!summary || seen.has(summary.key)) continue;
    seen.add(summary.key);
    summaries.push(summary);
  }

  return summaries;
}

function createNewMailNotifier({
  document,
  addEventListener,
  setTimeout,
  setInterval,
  electronAPI,
}) {
  let lastUnreadCount = readUnreadCount(document);
  let pendingTimer = null;
  let pendingAttempts = 0;
  const seenMailKeys = new Set(
    getUnreadMailSummaries(document).map((summary) => summary.key)
  );

  function rememberCurrentUnreadRows() {
    for (const summary of getUnreadMailSummaries(document)) {
      seenMailKeys.add(summary.key);
    }
  }

  // Keep folding already-visible unread rows into the baseline while the count
  // is steady, so a slow initial mailbox render never gets mistaken for new mail.
  function warmBaseline() {
    if (pendingTimer) return;

    const currentUnreadCount = readUnreadCount(document);
    if (!Number.isFinite(currentUnreadCount)) return;

    if (lastUnreadCount === null || currentUnreadCount <= lastUnreadCount) {
      lastUnreadCount = currentUnreadCount;
      rememberCurrentUnreadRows();
    }
  }

  // The badge is owned by outlookUnreadCountObserver/trayIconRenderer. Showing a
  // notification must never leave the dock badge stale, so re-assert the known
  // unread count right after notifying (defense-in-depth against OS re-badging).
  function reassertBadge() {
    if (!Number.isFinite(lastUnreadCount) || lastUnreadCount < 0) return;
    electronAPI?.setBadgeCount?.(lastUnreadCount)?.catch?.(() => {});
  }

  function notifyForNewRows() {
    pendingTimer = null;
    const summaries = getUnreadMailSummaries(document);
    for (const summary of summaries) {
      if (seenMailKeys.has(summary.key)) continue;
      seenMailKeys.add(summary.key);
      electronAPI?.showNotification?.({
        title: summary.title,
        body: summary.body,
        type: "new-message",
      });
      setTimeout(reassertBadge, 1500);
      return;
    }

    // The new mail row may not be in the DOM yet; retry briefly before giving up.
    pendingAttempts += 1;
    if (pendingAttempts < MAX_NOTIFY_ATTEMPTS) {
      pendingTimer = setTimeout(notifyForNewRows, NOTIFY_RETRY_MS);
    } else {
      pendingAttempts = 0;
    }
  }

  function handleUnreadCount(event) {
    const count = event?.detail?.number;
    if (!Number.isFinite(count)) return;

    if (lastUnreadCount === null) {
      lastUnreadCount = count;
      rememberCurrentUnreadRows();
      return;
    }

    if (count > lastUnreadCount && !pendingTimer) {
      pendingAttempts = 0;
      pendingTimer = setTimeout(notifyForNewRows, NOTIFY_RETRY_MS);
    } else if (count <= lastUnreadCount) {
      rememberCurrentUnreadRows();
    }

    if (count === 0) {
      seenMailKeys.clear();
    }

    lastUnreadCount = count;
  }

  return {
    start() {
      addEventListener("unread-count", handleUnreadCount);
      setInterval(warmBaseline, BASELINE_WARM_MS);
    },
  };
}

function init(config = {}) {
  if (config.outlookNewMailNotifier?.enabled === false) return;
  if (!globalThis.document) return;

  createNewMailNotifier({
    document: globalThis.document,
    addEventListener: globalThis.addEventListener.bind(globalThis),
    setTimeout: globalThis.setTimeout.bind(globalThis),
    setInterval: globalThis.setInterval.bind(globalThis),
    electronAPI: globalThis.electronAPI,
  }).start();
}

module.exports = {
  init,
};
