function install(globalRef = globalThis) {
  const navigatorRef = globalRef.navigator;
  if (!navigatorRef) return false;

  const noOpBadge = async () => undefined;
  Object.defineProperty(navigatorRef, "setAppBadge", {
    configurable: true,
    writable: true,
    value: noOpBadge,
  });
  Object.defineProperty(navigatorRef, "clearAppBadge", {
    configurable: true,
    writable: true,
    value: noOpBadge,
  });

  console.debug("[OutlookBadgingApiBlocker] Native Badging API blocked");
  return true;
}

module.exports = {
  init: () => install(),
  install,
};
