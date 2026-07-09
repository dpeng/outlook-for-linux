# Outlook for Linux

**Unofficial Microsoft Outlook client for Linux** - a native desktop app that wraps Outlook Web with Linux desktop integration.

✅ **Outlook Web in a standalone desktop window**  
✅ **System notifications**  
✅ **System tray integration**  
✅ **Persistent session storage**  
✅ **Linux package builds via Electron Builder**  

> [!NOTE]
> This is an independent fork, not affiliated with Microsoft. Some features are limited by what Outlook Web exposes.

## Installation

Release artifacts are not published yet. Build packages locally until downloads are available.

## Quick Start

```bash
npm ci
npm start
```

Build Linux packages:

```bash
npm run dist:linux:x64 -- --publish never
```

Launch after installing with:

```bash
outlook-for-linux
```

For custom configuration, create `~/.config/outlook-for-linux/config.json`.

## Development

Outlook for Linux keeps the generic Electron shell, disables inherited meeting and call integrations that do not apply to Outlook, and loads Outlook Web by default.

## Security & Sandboxing

Electron's contextIsolation and sandbox features are disabled to preserve compatibility with the inherited wrapper integration points. For enhanced security, use system-level sandboxing where available.

## Acknowledgements

Thanks to the upstream Electron wrapper project for the foundation.

**GPL-3.0** — See [`LICENSE.md`](LICENSE.md)
