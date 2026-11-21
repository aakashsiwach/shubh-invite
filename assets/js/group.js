/*
 * Grouped viewer. Reads a set of invitations packed into the link (#g=…)
 * and shows a chooser; each card opens that one invitation in invite.html.
 * No server needed — the link carries everything.
 */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  async function inviteURL(cfg) {
    var packed = await window.SHUBH_LINK_CODEC.encode(cfg);
    var base = location.href.replace(/[?#].*$/, "").replace(/[^/]*$/, "invite.html");
    return base + "#i=" + packed;
  }

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function whenText(cfg) {
    if (cfg.dateText) return cfg.dateText;
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(cfg.date || ""));
    if (!m) return "";
    return (+m[3]) + " " + MONTHS[(+m[2]) - 1] + " " + m[1];
  }

  var root = document.getElementById("group");
  function fail(msg) { root.innerHTML = '<div class="g-problem"><h1>Hmm…</h1><p>' + msg + "</p></div>"; }

  (async function () {
  var mm = /[#&]g=([^&]+)/.exec(location.hash || "");
  if (!mm) { fail("This link is missing its invitation. Ask the host to share it again."); return; }

  var data;
  try { data = await window.SHUBH_LINK_CODEC.decode(mm[1]); } catch (e) { data = null; }
  if (!data || !Array.isArray(data.items) || !data.items.length) {
    fail("This invitation link looks damaged. Ask the host to share it again.");
    return;
  }

  var guest = "";
  try { guest = (new URLSearchParams(location.search).get("to") || "").slice(0, 80); } catch (e) {}

  var qLang = "";
  try { qLang = new URLSearchParams(location.search).get("lang") || ""; } catch (e) {}
  var lang = (qLang || data.lang) === "hi" ? "hi" : "en";
  var S = {
    en: { dear: "Dear ", title: "You're Invited", sub1: "You are invited to the following celebration. Tap a card to open it.", subN: "You are invited to the following celebrations. Tap a card to open it.", open: "Open →" },
    hi: { dear: "प्रिय ", title: "आप सादर आमंत्रित हैं", sub1: "आप निम्नलिखित समारोह में आमंत्रित हैं। खोलने के लिए कार्ड पर टैप करें।", subN: "आप निम्नलिखित समारोहों में आमंत्रित हैं। खोलने के लिए कार्ड पर टैप करें।", open: "खोलें →" }
  }[lang];

  var inviteUrls = await Promise.all(data.items.map(function (it) { return inviteURL(it.c || {}); }));
  var html = '<section class="g-head">';
  html += '<p class="g-om" lang="sa">॥ शुभ ॥</p>';
  if (guest) html += '<p class="g-dear">' + esc(S.dear) + esc(guest) + ",</p>";
  html += '<h1>' + esc(data.t || S.title) + "</h1>";
  html += '<p class="g-sub">' + esc(data.items.length > 1 ? S.subN : S.sub1) + "</p>";
  html += "</section>";

  html += '<div class="g-grid">';
  data.items.forEach(function (it, index) {
    var cfg = it.c || {};
    var when = whenText(cfg);
    var names = Array.isArray(cfg.names) ? cfg.names.join(" & ") : "";
    html += '<a class="g-card pal-' + esc(cfg.palette || "maroon") + '" href="' + esc(inviteUrls[index]) + '">' +
      '<span class="g-card-label">' + esc(it.l || cfg.heading || "Invitation") + "</span>" +
      (names ? '<span class="g-card-names">' + esc(names) + "</span>" : "") +
      (cfg.heading && cfg.heading !== it.l ? '<span class="g-card-head">' + esc(cfg.heading) + "</span>" : "") +
      (when ? '<span class="g-card-when">' + esc(when) + "</span>" : "") +
      '<span class="g-card-open">' + esc(S.open) + "</span>" +
      "</a>";
  });
  html += "</div>";
  html += '<footer class="g-foot">Made with ❤ for Indian celebrations</footer>';

  root.innerHTML = html;
  document.title = data.t || S.title;
  document.documentElement.lang = lang;

  // Carry a personal ?to= name through to each invitation link.
  if (guest) {
    Array.prototype.forEach.call(root.querySelectorAll("a.g-card"), function (a) {
      a.href = a.href.replace("#i=", "?to=" + encodeURIComponent(guest) + "#i=");
    });
  }
  })();
})();
