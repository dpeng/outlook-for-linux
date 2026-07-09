const { describe, it } = require("node:test");
const assert = require("node:assert");

const configOptions = require("../../app/config/options");
const packageJson = require("../../package.json");

describe("Outlook for Linux defaults", () => {
  it("opens Outlook Web by default", () => {
    assert.strictEqual(
      configOptions.url.default,
      "https://outlook.office.com/mail/"
    );
  });

  it("uses Outlook app identity", () => {
    assert.strictEqual(configOptions.appTitle.default, "Outlook");
    assert.strictEqual(packageJson.name, "outlook-for-linux");
    assert.strictEqual(packageJson.productName, "Outlook for Linux");
    assert.strictEqual(packageJson.build.appId, "outlook-for-linux");
    assert.strictEqual(
      packageJson.build.linux.executableName,
      "outlook-for-linux"
    );
  });

  it("does not register inherited deep-link protocols", () => {
    assert.strictEqual(packageJson.build.protocols, undefined);
  });
});
