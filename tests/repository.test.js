const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function filesUnder(dir) {
  const absolute = path.join(root, dir);
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(relative) : [relative];
  });
}

test("all project JavaScript files parse", () => {
  const files = ["config.js", ...filesUnder("assets/js"), ...filesUnder("examples")];
  for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", path.join(root, file)], { encoding: "utf8" });
    assert.equal(result.status, 0, `${file} failed syntax check:\n${result.stderr}`);
  }
});

test("classic invitation config loads and contains no removed RSVP option", () => {
  const context = { window: {} };
  vm.runInNewContext(read("config.js"), context, { filename: "config.js" });
  assert.ok(context.window.INVITE);
  assert.equal(context.window.INVITE.type, "wedding");
  assert.equal(Object.hasOwn(context.window.INVITE, "rsvp"), false);
});

test("published links point to this repository", () => {
  const readme = read("README.md");
  const gallery = read("assets/js/gallery.js");
  assert.match(readme, /https:\/\/aakashsiwach\.github\.io\/shubh-nimantran\//);
  assert.match(gallery, /https:\/\/github\.com\/aakashsiwach\/shubh-nimantran/);
  assert.doesNotMatch(readme + gallery, /aakashsiwach\/(?:shubh-invite|shubh-invitation)/);
});

test("builder and documentation do not advertise removed RSVP functionality", () => {
  const sources = ["config.js", "assets/js/builder.js", "assets/js/app.js"];
  for (const file of sources) {
    assert.doesNotMatch(read(file), /RSVP|rsvp|WhatsApp RSVP/i, `${file} contains stale RSVP references`);
  }
  assert.doesNotMatch(read("README.md"), /RSVP on WhatsApp|RSVP form|rsvp\\.whatsapp|countdown, venue, RSVP/i);
});

test("shared invitation payloads round-trip Unicode through base64url", () => {
  const payload = { names: ["आरव", "Ananya"], heading: "शुभ विवाह", venue: { name: "दिल्ली" } };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const decoded = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  assert.deepEqual(decoded, payload);
});
