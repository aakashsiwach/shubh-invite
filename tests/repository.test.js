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

test("expanded template catalogue contains 112 valid occasion presets", () => {
  const context = { window: {} };
  vm.runInNewContext(read("assets/js/template-catalog.js"), context, { filename: "template-catalog.js" });
  const catalogue = context.window.SHUBH_TEMPLATES;
  assert.ok(catalogue.length >= 112);
  assert.equal(new Set(catalogue.map((item) => item.id)).size, 112);
  for (const item of catalogue) {
    assert.ok(item.name && item.category && item.config);
    assert.ok(["wedding", "engagement", "anniversary", "birthday", "babyshower", "housewarming", "puja", "party"].includes(item.type));
    assert.ok(item.config.palette && Array.isArray(item.config.effects) && Array.isArray(item.config.decor));
  }
  for (const motif of ["krishna", "radha", "shiv", "ram-sita", "lakshmi", "saraswati"]) {
    assert.ok(catalogue.some((item) => item.config.motif === motif), `Missing devotional motif: ${motif}`);
  }
  const categories = new Set(catalogue.map((item) => item.category));
  for (const category of ["wedding", "engagement", "anniversary", "birthday", "baby", "house", "puja", "festival", "party"]) {
    assert.ok(categories.has(category), `Missing template category: ${category}`);
  }
});

test("both website and video creation entry points are published", () => {
  assert.match(read("index.html"), /href="builder.html"/);
  assert.match(read("index.html"), /href="video.html"/);
  assert.match(read("invite.html"), /template-catalog\.js/);
  assert.match(read("builder.html"), /template-catalog\.js/);
  assert.match(read("video.html"), /assets\/js\/video\.js/);
});

test("share codec compresses invitation payloads and reads legacy links", async () => {
  const context = {
    window: {},
    Blob,
    Response,
    TextEncoder,
    TextDecoder,
    CompressionStream,
    DecompressionStream,
    Uint8Array,
    btoa: (value) => Buffer.from(value, "binary").toString("base64"),
    atob: (value) => Buffer.from(value, "base64").toString("binary")
  };
  vm.runInNewContext(read("assets/js/share-codec.js"), context, { filename: "share-codec.js" });
  const payload = {
    heading: "शुभ विवाह",
    names: ["Aarav", "Ananya"],
    events: Array.from({ length: 8 }, (_, i) => ({ title: "Wedding celebration " + i, venue: "The Royal Palace, Jaipur", note: "Join us with your family and blessings." }))
  };
  const encoded = await context.window.SHUBH_LINK_CODEC.encode(payload);
  const decoded = await context.window.SHUBH_LINK_CODEC.decode(encoded);
  assert.deepEqual(JSON.parse(JSON.stringify(decoded)), payload);
  assert.equal(encoded[0], "z");
  const legacy = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const oldDecoded = await context.window.SHUBH_LINK_CODEC.decode(legacy);
  assert.deepEqual(JSON.parse(JSON.stringify(oldDecoded)), payload);
  assert.ok(encoded.length < legacy.length * 0.8, "compressed payload should be materially shorter");
});

test("builder, invitation viewer and grouped viewer load the shared codec", () => {
  assert.match(read("builder.html"), /assets\/js\/share-codec\.js/);
  assert.match(read("invite.html"), /assets\/js\/share-codec\.js/);
  assert.match(read("group.html"), /assets\/js\/share-codec\.js/);
  assert.match(read("assets/js/builder.js"), /SHUBH_LINK_CODEC\.encode/);
  assert.match(read("assets/js/app.js"), /SHUBH_LINK_CODEC\.decode/);
  assert.match(read("assets/js/group.js"), /SHUBH_LINK_CODEC\.decode/);
});
