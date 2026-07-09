const { describe, it } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const packageJson = require("../../package.json");

const root = path.join(__dirname, "..", "..");

describe("Outlook for Linux icon assets", () => {
  const requiredFiles = [
    "build/icon.png",
    "build/icon.icns",
    "app/assets/icons/icon-16x16.png",
    "app/assets/icons/icon-96x96.png",
    "app/assets/icons/icon-256x256.png",
    "app/assets/icons/icon-monochrome-dark-16x16.png",
    "app/assets/icons/icon-monochrome-dark-96x96.png",
    "app/assets/icons/icon-monochrome-light-16x16.png",
    "app/assets/icons/icon-monochrome-light-96x96.png",
  ];

  for (const relativePath of requiredFiles) {
    it(`includes ${relativePath}`, () => {
      assert.ok(fs.existsSync(path.join(root, relativePath)));
    });
  }

  it("configures electron-builder to use the app icon", () => {
    assert.strictEqual(packageJson.build.icon, "build/icon.png");
    assert.strictEqual(packageJson.build.mac.icon, "build/icon.icns");
    assert.strictEqual(packageJson.build.linux.icon, "build/icon.png");
  });
});
