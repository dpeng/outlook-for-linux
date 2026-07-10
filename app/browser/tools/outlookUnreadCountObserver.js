function extractInboxUnreadCount(text) {
  if (typeof text !== "string") return null;
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!/\binbox(?![a-z])/i.test(normalized)) return null;

  // Only trust the "N unread" label that belongs to Inbox. In Outlook's folder
  // list every folder name is preceded by an icon glyph from the Unicode
  // Private Use Area (U+E000–U+F8FF); these glyphs act as folder boundaries, so
  // the unread match must never cross one (otherwise a fully-read Inbox would
  // pick up the next folder's count, e.g. "Deleted Items 264 unread").
  const match = /\binbox(?![a-z])[^\ue000-\uf8ff]*?(\d{1,4})\s*unread/i.exec(normalized);
  if (match) {
    const count = Number.parseInt(match[1], 10);
    return Number.isFinite(count) ? count : null;
  }

  // Inbox is present without its own unread badge. If the folder list or header
  // is actually rendered (other unread counts or an item total are visible),
  // that means Inbox has nothing unread; otherwise it is still loading.
  if (/\bunread\b|\bitems?\b/i.test(normalized)) return 0;

  return null;
}

function readUnreadCount(documentRef) {
  const primaryCandidates = documentRef?.querySelectorAll?.(
    '[aria-label*="Inbox" i], [title*="Inbox" i], [role="treeitem"], [role="option"], [data-folder-name]'
  ) || [];

  const primaryCount = readUnreadCountFromElements(primaryCandidates);
  if (primaryCount !== null) return primaryCount;

  const allElements = Array.from(documentRef?.querySelectorAll?.("*") || [])
    .slice(0, 3000)
    .filter((element) => {
      const text = element.textContent;
      return typeof text === "string" &&
        text.length <= 200 &&
        /\binbox(?![a-z])/i.test(text);
    });

  return readUnreadCountFromElements(allElements);
}

function readUnreadCountFromElements(elements) {
  for (const element of elements) {
    let current = element;
    for (let depth = 0; current && depth < 5; depth += 1) {
      const values = [
        current.getAttribute?.("aria-label"),
        current.getAttribute?.("title"),
        current.getAttribute?.("data-folder-name"),
        current.textContent,
      ];

      for (const value of values) {
        const count = extractInboxUnreadCount(value);
        if (count !== null) return count;
      }

      current = current.parentElement;
    }
  }

  return null;
}

function createUnreadCountPublisher({
  document,
  dispatchEvent,
  CustomEvent,
}) {
  let lastCount = null;

  return {
    publish() {
      const count = readUnreadCount(document);
      if (count === null || count === lastCount) return;

      lastCount = count;
      console.debug("[OutlookUnreadCountObserver] Publishing unread count", {
        count,
      });
      dispatchEvent(new CustomEvent("unread-count", {
        detail: { number: count },
      }));
    },
  };
}

function init(config = {}) {
  if (config.outlookUnreadCountObserver?.enabled === false) return;
  if (!globalThis.document || !globalThis.MutationObserver) return;

  const publisher = createUnreadCountPublisher({
    document: globalThis.document,
    dispatchEvent: globalThis.dispatchEvent.bind(globalThis),
    CustomEvent: globalThis.CustomEvent,
  });

  publisher.publish();

  const observer = new globalThis.MutationObserver(() => publisher.publish());
  observer.observe(globalThis.document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-label", "title", "data-folder-name"],
  });

  globalThis.setInterval(() => publisher.publish(), 5000);
  console.debug("[OutlookUnreadCountObserver] Initialized");
}

module.exports = {
  readUnreadCount,
  init,
};
