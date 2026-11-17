/*
 * Invitation engine. Reads your settings from config.js, finds your photos
 * and music, and builds the page. You don't need to edit this file.
 */
(function () {
  "use strict";

  var ICON = window.INVITE_ICONS;
  var TYPES = window.INVITE_TYPES;
  var PALETTES = window.INVITE_PALETTES;

  /* ---------- small helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function txt(s) { return esc(s).replace(/\n/g, "<br>"); }
  function has(v) { return v != null && String(v).trim() !== ""; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function arr(v) { return Array.isArray(v) ? v : has(v) ? [v] : []; }
  function safeUrl(u) {
    u = String(u || "").trim();
    return /^(https?:|mailto:|tel:)/i.test(u) || /^[\w.\-\/ %]+$/.test(u) ? u : "#";
  }
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.onload = res;
      s.onerror = function () { rej(new Error("Could not load " + src)); };
      document.head.appendChild(s);
    });
  }

  /* ---------- finding photos & music in the folders ---------- */
  var EXTS = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"];
  function probe(src) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(src); };
      i.onerror = function () { res(null); };
      i.src = src;
    });
  }
  function findAny(base) {
    return Promise.all(EXTS.map(function (e) { return probe(base + "." + e); }))
      .then(function (a) { for (var i = 0; i < a.length; i++) if (a[i]) return a[i]; return null; });
  }
  function findCover(setting) {
    if (setting === false || setting === "" || setting === "none") return Promise.resolve(null);
    if (has(setting) && setting !== "auto") return probe(String(setting).indexOf("/") < 0 ? "photos/" + setting : setting);
    return findAny("photos/cover");
  }
  async function findGallery(setting) {
    if (setting === false || setting === "none") return [];
    if (Array.isArray(setting)) {
      return setting.map(function (f) { return String(f).indexOf("/") < 0 ? "photos/gallery/" + f : f; });
    }
    var out = [], n = 1, done = false;
    while (!done && n <= 120) {
      var batch = [];
      for (var i = 0; i < 6; i++) batch.push(findAny("photos/gallery/" + (n + i)));
      var found = await Promise.all(batch);
      for (var j = 0; j < found.length; j++) {
        if (found[j]) out.push(found[j]); else { done = true; break; }
      }
      n += 6;
    }
    return out;
  }
  function findMusic(setting) {
    if (setting === false || setting === "" || setting === "none") return Promise.resolve(null);
    var list = has(setting) && setting !== "auto"
      ? [String(setting).indexOf("/") < 0 ? "music/" + setting : setting]
      : ["music/song.mp3", "music/song.m4a", "music/song.ogg"];
    return new Promise(function (res) {
      (function tryNext(i) {
        if (i >= list.length) return res(null);
        var a = new Audio(); var settled = false;
        function ok() { if (!settled) { settled = true; res(list[i]); } }
        function bad() { if (!settled) { settled = true; tryNext(i + 1); } }
        a.addEventListener("loadedmetadata", ok);
        a.addEventListener("error", bad);
        setTimeout(bad, 4000);
        a.preload = "metadata"; a.src = list[i];
      })(0);
    });
  }

  /* ---------- dates ---------- */
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function parseWhen(date, tz) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{2}))?/.exec(String(date || "").trim());
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3], hasTime = m[4] != null, hh = hasTime ? +m[4] : 0, mm = hasTime ? +m[5] : 0;
    var t = /^([+-])(\d{1,2}):?(\d{2})$/.exec(String(tz || "+05:30").trim());
    var off = t ? (t[1] === "-" ? -1 : 1) * (+t[2] * 60 + +t[3]) : 330;
    return { y: y, mo: mo, d: d, hh: hh, mm: mm, hasTime: hasTime, ts: Date.UTC(y, mo - 1, d, hh, mm) - off * 60000 };
  }
  function fmtDate(w) {
    return DAYS[new Date(Date.UTC(w.y, w.mo - 1, w.d)).getUTCDay()] + ", " + w.d + " " + MONTHS[w.mo - 1] + " " + w.y;
  }
  function fmtTime(w) {
    if (!w.hasTime) return "";
    return (w.hh % 12 || 12) + ":" + String(w.mm).padStart(2, "0") + " " + (w.hh < 12 ? "AM" : "PM");
  }
  function stamp(ts) { return new Date(ts).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function dayStamp(w, add) {
    var dt = new Date(Date.UTC(w.y, w.mo - 1, w.d + (add || 0)));
    return dt.toISOString().slice(0, 10).replace(/-/g, "");
  }
  function calendarLinks(cfg, w, title, where) {
    var dates = w.hasTime ? stamp(w.ts) + "/" + stamp(w.ts + 4 * 3600000) : dayStamp(w) + "/" + dayStamp(w, 1);
    var google = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(title) + "&dates=" + dates +
      "&details=" + encodeURIComponent(location.href.split("?")[0]) + "&location=" + encodeURIComponent(where || "");
    function icsText(s) { return String(s || "").replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n"); }
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//shubh-invite//EN", "BEGIN:VEVENT",
      "UID:" + w.ts + "@shubh-invite", "DTSTAMP:" + stamp(Date.now()),
      w.hasTime ? "DTSTART:" + stamp(w.ts) : "DTSTART;VALUE=DATE:" + dayStamp(w),
      w.hasTime ? "DTEND:" + stamp(w.ts + 4 * 3600000) : "DTEND;VALUE=DATE:" + dayStamp(w, 1),
      "SUMMARY:" + icsText(title), "LOCATION:" + icsText(where), "DESCRIPTION:" + icsText(location.href.split("?")[0]),
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    return { google: google, ics: "data:text/calendar;charset=utf-8," + encodeURIComponent(ics) };
  }

  /* ---------- decorations ---------- */
  function decorHTML(list) {
    var out = "";
    if (list.indexOf("toran") > -1) {
      var s = "";
      for (var i = 0; i < 15; i++) s += '<span class="strand' + (i % 2 ? " alt" : "") + '" style="height:' + [110, 80, 128, 96, 116][i % 5] + 'px;animation-delay:' + (-i * 0.35).toFixed(2) + 's"></span>';
      var leaves = "";
      for (var k = 0; k < 15; k++) leaves += "<i></i>";
      out += '<div class="toran" aria-hidden="true"><div class="rope"></div><div class="leaves">' + leaves + '</div><div class="strands">' + s + "</div></div>";
    }
    if (list.indexOf("bunting") > -1) {
      var f = "";
      for (var b = 0; b < 16; b++) f += '<span style="animation-delay:' + (-b * 0.25).toFixed(2) + 's"></span>';
      out += '<div class="bunting" aria-hidden="true"><div class="line"></div><div class="flags">' + f + "</div></div>";
    }
    if (list.indexOf("bells") > -1) {
      var bell = '<svg viewBox="0 0 40 90"><rect x="19" y="0" width="2" height="40"/><path d="M20 40C8 40 6 62 4 72h32c-2-10-4-32-16-32z"/><circle cx="20" cy="78" r="5"/></svg>';
      out += '<div class="bell l" aria-hidden="true">' + bell + '</div><div class="bell r" aria-hidden="true">' + bell + "</div>";
    }
    if (list.indexOf("mandala") > -1) {
      var petals = "", eggs = "";
      for (var a = 0; a < 16; a++) petals += '<path d="M0 -90Q10 -72 0 -58Q-10 -72 0 -90Z" transform="rotate(' + a * 22.5 + ')"/>';
      for (var e = 0; e < 12; e++) eggs += '<ellipse cx="0" cy="-70" rx="12" ry="24" transform="rotate(' + e * 30 + ')"/>';
      out += '<div class="mandala" aria-hidden="true">' +
        '<svg class="spin" viewBox="-100 -100 200 200"><circle r="98"/><circle r="92" stroke-dasharray="1 3"/>' + petals + '<circle r="56"/></svg>' +
        '<svg class="spin-rev inner" viewBox="-100 -100 200 200"><circle r="96"/><g class="fill">' + eggs + '</g><circle r="38"/></svg></div>';
    }
    if (list.indexOf("diyas") > -1) {
      var diya = '<div class="halo"></div>' +
        '<svg class="flame" viewBox="0 0 20 34"><path d="M10 0C16 10 18 18 18 24a8 8 0 0 1-16 0C2 18 4 10 10 0z" fill="#FFB020"/><path d="M10 12c3 5 4 9 4 13a4 4 0 0 1-8 0c0-4 1-8 4-13z" fill="#FFF2B0"/></svg>' +
        '<svg class="bowl" viewBox="0 0 90 40"><path d="M2 8h86C84 30 66 38 45 38S6 30 2 8z" fill="#B8642A"/><path d="M2 8h86l-8 6H10z" fill="#D98A3A"/><circle cx="25" cy="24" r="3" fill="#F7C548"/><circle cx="45" cy="27" r="3" fill="#F7C548"/><circle cx="65" cy="24" r="3" fill="#F7C548"/></svg>';
      out += '<div class="diya l" aria-hidden="true">' + diya + '</div><div class="diya r" aria-hidden="true">' + diya + "</div>";
    }
    return out;
  }

  function emblemHTML(name) {
    var inner = name === "om" ? '<span class="om" lang="sa">ॐ</span>' : ICON(name, "emblem-ico");
    var dots = "";
    for (var i = 0; i < 12; i++) dots += '<ellipse cx="0" cy="-41" rx="7" ry="13" transform="rotate(' + i * 30 + ')"/>';
    return '<div class="emblem" aria-hidden="true"><svg viewBox="-66 -66 132 132"><circle r="63"/><circle r="56" stroke-dasharray="1.5 5"/><g class="fill">' + dots + '</g><circle r="27" class="core"/></svg>' + inner + "</div>";
  }

  function namesHTML(names, joiner) {
    return names.map(function (n) { return '<span class="gold">' + esc(n) + "</span>"; })
      .join('<span class="joiner">' + esc(joiner) + "</span>");
  }

  /* ---------- page sections ---------- */
  function build(c) {
    var h = "";
    var whenLine = [c.dateText || (c.when ? fmtDate(c.when) : ""), c.timeText || (c.when ? fmtTime(c.when) : ""), c.place].filter(has).join(" · ");

    /* HERO */
    h += '<section class="hero" id="top">' + decorHTML(c.decor) + '<div class="hero-inner">';
    h += c.cover
      ? '<figure class="cover rise r1"><img src="' + esc(c.cover) + '" alt="' + esc(c.names.join(" and ")) + '"></figure>'
      : '<div class="rise r1">' + emblemHTML(c.emblem) + "</div>";
    if (has(c.topLine)) h += '<p class="top-line rise r1">' + txt(c.topLine) + "</p>";
    if (has(c.heroLabel)) h += '<p class="eyebrow rise r2">' + txt(c.heroLabel) + "</p>";
    if (c.names.length) h += '<h1 class="names rise r3">' + namesHTML(c.names, c.joiner) + "</h1>";
    if (has(c.heading)) h += '<p class="heading rise r4">' + txt(c.heading) + "</p>";
    if (has(whenLine)) h += '<p class="when rise r5">' + esc(whenLine) + "</p>";
    h += '</div><a class="scroll-cue" href="#details" aria-label="Scroll down">' + ICON("down") + "</a></section>";

    h += '<div id="details"></div>';

    /* COUNTDOWN */
    if (c.when && c.when.ts > Date.now() && c.countdown !== false) {
      h += '<section class="countdown band"><div class="wrap center"><p class="eyebrow">' + esc(c.countdownTitle || "Counting down the days") + '</p><div class="cd-grid">' +
        ["days", "hours", "minutes", "seconds"].map(function (u) {
          return '<div class="cd-box"><span class="cd-num" data-cd="' + u + '">–</span><span class="cd-lbl">' + u.charAt(0).toUpperCase() + u.slice(1) + "</span></div>";
        }).join("") + "</div></div></section>";
    }

    /* INVITATION TEXT */
    var inv = c.invitation || {};
    if (has(c.shloka) || has(inv.hosts) || has(inv.message) || has(inv.after)) {
      h += '<section class="section paper"><div class="wrap narrow center reveal">';
      if (has(c.shloka)) h += '<p class="shloka">' + txt(c.shloka) + "</p>" + divider();
      if (has(inv.hosts)) h += '<p class="lead"><strong>' + txt(inv.hosts) + "</strong></p>";
      if (has(inv.message)) h += '<p class="lead">' + txt(inv.message) + "</p>";
      if (inv.repeatNames !== false && c.names.length) {
        h += c.names.map(function (n) { return '<p class="script-name">' + esc(n) + "</p>"; })
          .join('<p class="with">' + esc(inv.joinWord || "with") + "</p>");
      }
      if (has(inv.after)) h += '<p class="lead em">' + txt(inv.after) + "</p>";
      h += "</div></section>";
    }

    /* EVENTS */
    if (c.events.length) {
      h += '<section class="section paper alt"><div class="wrap"><h2 class="title center reveal">' + esc(c.eventsTitle || "The Celebrations") + "</h2>";
      if (has(c.eventsSubtitle)) h += '<p class="sub center reveal">' + txt(c.eventsSubtitle) + "</p>";
      h += '<div class="events">';
      c.events.forEach(function (ev, i) {
        var icon = ICON.has(ev.icon) ? ev.icon : ICON.guess(ev.title);
        h += '<article class="event reveal" style="transition-delay:' + (i % 4) * 0.08 + 's"><span class="event-ico c' + (i % 4) + '">' + ICON(icon) + "</span>" +
          "<h3>" + esc(ev.title) + "</h3>" +
          ([ev.date, ev.time].filter(has).length ? '<p class="event-when">' + esc([ev.date, ev.time].filter(has).join(" · ")) + "</p>" : "") +
          (has(ev.venue) ? '<p class="event-venue">' + txt(ev.venue) + "</p>" : "") +
          (has(ev.note) ? '<p class="event-note">' + txt(ev.note) + "</p>" : "") +
          (has(ev.mapLink) ? '<a class="link" href="' + esc(safeUrl(ev.mapLink)) + '" target="_blank" rel="noopener">' + ICON("pin") + "Directions</a>" : "") +
          "</article>";
      });
      h += "</div></div></section>";
    }

    /* GALLERY */
    if (c.gallery.length) {
      h += '<section class="section dark"><div class="wrap"><h2 class="title center reveal">' + esc(c.galleryTitle || "Moments") + '</h2><div class="gallery">';
      c.gallery.forEach(function (src, i) {
        h += '<button class="g-item reveal" type="button" data-i="' + i + '" aria-label="Open photo ' + (i + 1) + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>';
      });
      h += "</div></div></section>";
    }

    /* VENUE + CALENDAR + SHARE */
    var v = c.venue || {};
    var actions = "";
    if (has(v.name) || has(v.address)) {
      var map = has(v.mapLink) ? safeUrl(v.mapLink) : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([v.name, v.address].filter(has).join(", "));
      actions += '<a class="btn solid" href="' + esc(map) + '" target="_blank" rel="noopener">' + ICON("pin") + "Get directions</a>";
    }
    if (c.when) {
      var cal = calendarLinks(c, c.when, c.pageTitle, [v.name, v.address].filter(has).join(", "));
      actions += '<a class="btn" href="' + esc(cal.google) + '" target="_blank" rel="noopener">' + ICON("calendar") + "Google Calendar</a>";
      actions += '<a class="btn" href="' + cal.ics + '" download="invitation.ics">' + ICON("calendar") + "Save to phone calendar</a>";
    }
    actions += '<button class="btn" type="button" id="share-btn">' + ICON("share") + "Share invitation</button>";
    h += '<section class="section dark venue"><div class="wrap narrow center reveal">';
    if (has(v.name) || has(v.address)) {
      h += '<h2 class="title">' + esc(v.title || "The Venue") + "</h2>";
      if (has(v.name)) h += '<p class="venue-name">' + txt(v.name) + "</p>";
      if (has(v.address)) h += '<p class="venue-addr">' + txt(v.address) + "</p>";
    } else {
      h += '<h2 class="title">' + esc("Save the Date") + "</h2>";
      if (has(whenLine)) h += '<p class="venue-name">' + esc(whenLine) + "</p>";
    }
    h += '<div class="actions">' + actions + "</div></div></section>";

    /* RSVP */
    var r = c.rsvp || {};
    if (has(r.whatsapp)) {
      h += '<section class="section paper"><div class="wrap form-wrap reveal"><h2 class="title center">' + esc(r.title || "RSVP") + "</h2>";
      if (has(r.by)) h += '<p class="sub center">Kindly respond by ' + esc(r.by) + "</p>";
      h += '<form id="rsvp" class="rsvp" novalidate>' +
        '<label for="r-name">Your name</label><input id="r-name" name="name" type="text" autocomplete="name" required value="' + esc(c.guest || "") + '">' +
        '<label for="r-att">Will you attend?</label><select id="r-att" name="att"><option value="yes">Joyfully accept</option><option value="no">Regretfully decline</option></select>' +
        '<label for="r-num">Number of guests</label><input id="r-num" name="num" type="number" min="1" max="50" value="2" inputmode="numeric">' +
        '<label for="r-msg">Message (optional)</label><textarea id="r-msg" name="msg" rows="3"></textarea>' +
        '<p class="form-err" id="r-err" role="alert"></p>' +
        '<button class="btn solid wide" type="submit">' + ICON("chat") + "Send RSVP on WhatsApp</button></form></div></section>";
    }

    /* FOOTER */
    h += '<footer class="footer"><div class="wrap narrow center">';
    if (has(c.footerTop)) h += '<p class="top-line small">' + txt(c.footerTop) + "</p>";
    if (has(c.footer)) h += '<p class="footer-msg">' + txt(c.footer) + "</p>";
    if (has(c.compliments)) h += '<p class="footer-block"><span class="eyebrow">With best compliments</span><br>' + txt(c.compliments) + "</p>";
    if (c.contacts.length) {
      h += '<div class="contacts">' + c.contacts.map(function (p) {
        var tel = String(p.phone || "").replace(/[^\d+]/g, "");
        return '<a class="contact" href="tel:' + esc(tel) + '">' + ICON("phone") + "<span>" + esc(p.name) + (has(p.phone) ? " · " + esc(p.phone) : "") + "</span></a>";
      }).join("") + "</div>";
    }
    h += "</div></footer>";

    /* MUSIC BUTTON + LIGHTBOX + TOAST */
    if (c.music) h += '<button class="music-btn" type="button" id="music-btn" aria-label="Play music" aria-pressed="false">' + ICON("soundOff") + "</button>";
    if (c.gallery.length) {
      h += '<div class="lightbox" id="lb" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>' +
        '<button class="lb-btn lb-close" type="button" aria-label="Close">' + ICON("close") + "</button>" +
        '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">' + ICON("left") + "</button>" +
        '<img alt="">' +
        '<button class="lb-btn lb-next" type="button" aria-label="Next photo">' + ICON("right") + "</button></div>";
    }
    h += '<div class="toast" id="toast" role="status" aria-live="polite"></div>';
    return h;
  }

  function divider() {
    return '<svg class="divider" viewBox="0 0 200 20" aria-hidden="true"><path d="M0 10H80M120 10H200"/><path class="fill" d="M100 2l8 8-8 8-8-8z"/></svg>';
  }

  function gateHTML(c) {
    var g = c.gate;
    var pattern = "";
    return '<div class="gate" id="gate">' +
      '<div class="door l"><span class="knob"></span></div><div class="door r"><span class="knob"></span></div>' +
      '<div class="gate-card">' +
      (has(c.topLine) ? '<p class="top-line small">' + txt(c.topLine) + "</p>" : "") +
      emblemHTML(c.emblem) +
      (c.guest ? '<p class="gate-dear">Dear ' + esc(c.guest) + ",</p>" : "") +
      '<p class="gate-title">' + esc(g.title || c.typeDef.gateTitle) + "</p>" +
      (c.names.length ? '<p class="gate-names">' + namesHTML(c.names, c.joiner) + "</p>" : "") +
      '<button class="btn solid gate-btn" type="button" id="gate-btn">' + esc(g.button || "Open Invitation") + "</button>" +
      pattern + "</div></div>";
  }

  /* ---------- behaviour ---------- */
  function wire(c) {
    var audio = null, musicBtn = $("#music-btn");
    function setMusic(on) {
      if (!audio) return;
      if (on) { audio.play().then(function () { setBtn(true); }).catch(function () { setBtn(false); }); }
      else { audio.pause(); setBtn(false); }
    }
    function setBtn(on) {
      if (!musicBtn) return;
      musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
      musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
      musicBtn.innerHTML = ICON(on ? "soundOn" : "soundOff");
      musicBtn.classList.toggle("on", on);
    }
    if (c.music) {
      audio = new Audio(c.music); audio.loop = true; audio.preload = "auto"; audio.volume = 0.7;
      musicBtn.addEventListener("click", function () { setMusic(audio.paused); });
    }

    var effectsStarted = false;
    function go() {
      document.body.classList.add("opened");
      if (!effectsStarted) { effectsStarted = true; window.InviteEffects.start($("#fx"), c.effects); }
      observe();
    }

    var gate = $("#gate");
    if (gate) {
      document.body.classList.add("locked");
      var btn = $("#gate-btn");
      btn.focus({ preventScroll: true });
      btn.addEventListener("click", function () {
        setMusic(true);
        gate.classList.add("open");
        document.body.classList.remove("locked");
        go();
        setTimeout(function () { gate.classList.add("done"); }, 1600);
      });
    } else {
      go();
    }

    /* countdown */
    var nums = $$("[data-cd]");
    if (nums.length && c.when) {
      var tick = function () {
        var d = Math.max(0, c.when.ts - Date.now());
        var v = { days: Math.floor(d / 864e5), hours: Math.floor(d / 36e5) % 24, minutes: Math.floor(d / 6e4) % 60, seconds: Math.floor(d / 1e3) % 60 };
        nums.forEach(function (n) { var k = n.getAttribute("data-cd"); n.textContent = k === "days" ? v[k] : String(v[k]).padStart(2, "0"); });
      };
      tick(); setInterval(tick, 1000);
    }

    /* share */
    var toast = $("#toast"), tt;
    function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 2600); }
    $("#share-btn").addEventListener("click", function () {
      var url = location.href.split("?")[0];
      var data = { title: c.pageTitle, text: c.shareText || "You're invited! " + c.pageTitle, url: url };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      var wa = "https://wa.me/?text=" + encodeURIComponent(data.text + "\n" + url);
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { say("Link copied — paste it anywhere to share"); }, function () { window.open(wa, "_blank"); });
      else window.open(wa, "_blank");
    });

    /* RSVP via WhatsApp */
    var form = $("#rsvp");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = form.name.value.trim(), err = $("#r-err");
        if (!name) { err.textContent = "Please enter your name."; form.name.focus(); return; }
        err.textContent = "";
        var yes = form.att.value === "yes";
        var lines = [
          (yes ? "🙏 Namaste! We will be there." : "🙏 Namaste! Sorry, we won't be able to make it."),
          "Name: " + name,
          yes ? "Guests: " + (form.num.value || "1") : "",
          form.msg.value.trim() ? "Message: " + form.msg.value.trim() : "",
          "— " + c.pageTitle
        ].filter(Boolean);
        var num = String(c.rsvp.whatsapp).replace(/[^\d]/g, "");
        window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
        say(yes ? "Thank you! Opening WhatsApp…" : "Thank you for letting us know.");
      });
    }

    /* gallery lightbox */
    var lb = $("#lb");
    if (lb) {
      var img = $("img", lb), idx = 0, lastFocus = null;
      var show = function (i) { idx = (i + c.gallery.length) % c.gallery.length; img.src = c.gallery[idx]; img.alt = "Photo " + (idx + 1) + " of " + c.gallery.length; };
      var open = function (i) { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.classList.add("locked"); $(".lb-close", lb).focus(); };
      var close = function () { lb.hidden = true; document.body.classList.remove("locked"); if (lastFocus) lastFocus.focus(); };
      $$(".g-item").forEach(function (b) { b.addEventListener("click", function () { open(+b.getAttribute("data-i")); }); });
      $(".lb-close", lb).addEventListener("click", close);
      $(".lb-prev", lb).addEventListener("click", function () { show(idx - 1); });
      $(".lb-next", lb).addEventListener("click", function () { show(idx + 1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
      document.addEventListener("keydown", function (e) {
        if (lb.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(idx - 1);
        else if (e.key === "ArrowRight") show(idx + 1);
      });
      var x0 = null;
      lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", function (e) {
        if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      });
    }
  }

  /* reveal sections as they scroll into view */
  var observed = false;
  function observe() {
    if (observed) return; observed = true;
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- start ---------- */
  function applyPalette(p, style) {
    var root = document.documentElement.style;
    var map = { bg: "--bg", bgDeep: "--bg-deep", glow: "--glow", accent: "--accent", accentSoft: "--accent-soft", text: "--text", textSoft: "--text-soft", paper: "--paper", paper2: "--paper-2", ink: "--ink", inkAccent: "--ink-accent", inkMuted: "--ink-muted", line: "--line" };
    Object.keys(map).forEach(function (k) { if (p[k]) root.setProperty(map[k], p[k]); });
    document.body.classList.add("style-" + (style === "playful" ? "playful" : "elegant"));
    var meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", p.bg);
  }

  function showProblem(msg) {
    $("#app").innerHTML = '<div class="problem"><h1>Almost there!</h1><p>' + msg + "</p></div>";
  }

  async function start() {
    var cfg = window.INVITE;
    if (!cfg) {
      showProblem("There's a small mistake in <code>config.js</code> (often a missing comma or quote). Open it, check the line you changed last, and save again.");
      return;
    }
    var typeDef = TYPES[cfg.type] || TYPES.wedding;
    var c = Object.assign({}, cfg);
    c.typeDef = typeDef;
    c.names = arr(cfg.names).filter(has);
    c.joiner = has(cfg.joiner) ? cfg.joiner : typeDef.joiner;
    c.heading = cfg.heading != null ? cfg.heading : typeDef.heading;
    c.emblem = cfg.emblem || typeDef.emblem;
    c.effects = Array.isArray(cfg.effects) ? cfg.effects : typeDef.effects;
    c.decor = Array.isArray(cfg.decor) ? cfg.decor : typeDef.decor;
    c.events = Array.isArray(cfg.events) ? cfg.events.filter(function (e) { return e && has(e.title); }) : [];
    c.contacts = Array.isArray(cfg.contacts) ? cfg.contacts.filter(function (p) { return p && (has(p.name) || has(p.phone)); }) : [];
    c.when = parseWhen(cfg.date, cfg.timezone);
    c.gate = cfg.gate === false ? null : Object.assign({}, cfg.gate || {});
    c.pageTitle = cfg.pageTitle || [c.heading, c.names.join(" " + c.joiner + " ")].filter(has).join(" · ") || "Invitation";
    var q = new URLSearchParams(location.search);
    c.guest = (q.get("to") || "").slice(0, 80);

    document.title = c.pageTitle;
    if (has(cfg.language)) document.documentElement.lang = cfg.language;
    var palette = (typeof cfg.palette === "object" && cfg.palette) ? Object.assign({}, PALETTES[typeDef.palette], cfg.palette)
      : PALETTES[cfg.palette] || PALETTES[typeDef.palette] || PALETTES.maroon;
    applyPalette(palette, cfg.style || typeDef.style);

    var photos = cfg.photos || {};
    var found = await Promise.all([findCover(photos.cover), findGallery(photos.gallery), findMusic(cfg.music)]);
    c.cover = found[0]; c.gallery = found[1].filter(Boolean); c.music = found[2];
    c.galleryTitle = photos.galleryTitle;

    var app = $("#app");
    app.innerHTML = build(c) + (c.gate ? gateHTML(c) : "");
    wire(c);
  }

  /* Load config.js — or a sample with ?example=birthday — then start */
  var problem = null;
  window.addEventListener("error", function (e) {
    if (e && e.filename && /config\.js|examples\//.test(e.filename)) problem = e.message + " (line " + e.lineno + ")";
  });
  var ex = new URLSearchParams(location.search).get("example");
  var src = ex && /^[a-z0-9-]+$/.test(ex) ? "examples/" + ex + ".js" : "config.js";
  loadScript(src).then(start, function () {
    showProblem("Couldn't find <code>" + esc(src) + "</code>. Make sure it's next to <code>index.html</code>.");
  }).then(function () {
    if (problem && !window.INVITE) showProblem("There's a small mistake in <code>" + esc(src) + "</code>: " + esc(problem) + ". Usually it's a missing comma or quote.");
  }).catch(function (err) {
    console.error(err);
    showProblem("Something went wrong while building the page: " + esc(err.message));
  });
})();
