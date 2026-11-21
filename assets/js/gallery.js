/*
 * Home page: a gallery of every invitation design.
 * Tapping a card opens invite.html?example=<type>.
 * If config.js says  home: "invitation",  visitors go straight to your invitation instead.
 */
(function () {
  "use strict";
  var ICON = window.INVITE_ICONS, TYPES = window.INVITE_TYPES, PALETTES = window.INVITE_PALETTES;

  var DESIGNS = [
    { id: "red-pink",     type: "wedding", label: "Red & Pink Traditional", cat: "family" },
    { id: "cream-wedding",type: "wedding", label: "Cream & Gold Arch",      cat: "family" },
    { id: "royal-arch",   type: "wedding", label: "Royal Arch",             cat: "family" },
    { type: "wedding",      label: "Wedding",            cat: "family" },
    { type: "engagement",   label: "Engagement · Sagai", cat: "family" },
    { type: "reception",    label: "Wedding Reception",  cat: "family" },
    { type: "anniversary",  label: "Anniversary",        cat: "family" },
    { type: "birthday",     label: "Birthday",           cat: "kids" },
    { type: "babyshower",   label: "Godh Bharai · Baby Shower", cat: "kids" },
    { type: "naming",       label: "Naamkaran · Naming", cat: "kids" },
    { type: "mundan",       label: "Mundan Sanskar",     cat: "kids" },
    { type: "housewarming", label: "Griha Pravesh",      cat: "home" },
    { type: "puja",         label: "Puja · Katha",       cat: "home" },
    { type: "party",        label: "Party",              cat: "party" }
  ];
  var FX_WORDS = { petals: "falling petals", confetti: "confetti", balloons: "balloons", hearts: "hearts", sparkles: "sparkles", bubbles: "bubbles" };
  var DECOR_WORDS = { toran: "toran", bunting: "bunting", bells: "temple bells", mandala: "mandala", diyas: "diyas", arch: "temple arch", florals: "floral corners" };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function has(v) { return v != null && String(v).trim() !== ""; }
  function loadScript(src) {
    return new Promise(function (res) {
      var s = document.createElement("script");
      s.src = src; s.onload = function () { res(true); }; s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }
  function when(cfg) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(cfg.date || ""));
    if (!m) return cfg.place || "";
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return [DAYS[d.getUTCDay()] + ", " + (+m[3]) + " " + MONTHS[+m[2] - 1] + " " + m[1], cfg.place].filter(has).join(" · ");
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function miniDecor(decor) {
    var h = "";
    if (decor.indexOf("arch") > -1) h += '<div class="m-arch"></div>';
    if (decor.indexOf("florals") > -1) h += '<span class="m-floral tl"></span><span class="m-floral tr"></span><span class="m-floral bl"></span><span class="m-floral br"></span>';
    if (decor.indexOf("toran") > -1) {
      h += '<div class="m-toran">';
      for (var i = 0; i < 9; i++) h += '<span style="height:' + [30, 20, 36, 24, 32][i % 5] + 'px;animation-delay:' + (-i * 0.4) + 's"></span>';
      h += "</div>";
    }
    if (decor.indexOf("bunting") > -1) {
      h += '<div class="m-bunting">';
      for (var b = 0; b < 9; b++) h += '<span style="animation-delay:' + (-b * 0.3) + 's"></span>';
      h += "</div>";
    }
    if (decor.indexOf("mandala") > -1) h += '<div class="m-mandala"></div>';
    if (decor.indexOf("diyas") > -1) h += '<span class="m-diya l"></span><span class="m-diya r"></span>';
    return h;
  }
  function miniFx(kind) {
    if (!kind) return "";
    var h = '<div class="m-fx fx-' + kind + '">';
    for (var i = 0; i < 8; i++) {
      h += '<span style="left:' + (6 + i * 12) + '%;animation-delay:' + (-i * 1.1).toFixed(1) + "s;animation-duration:" + (6 + (i % 3) * 1.5) + 's"></span>';
    }
    return h + "</div>";
  }
  function miniEmblem(name) {
    var inner = name === "om" ? '<span class="m-om" lang="sa">ॐ</span>' : ICON(name, "m-ico");
    return '<div class="m-emblem">' + inner + "</div>";
  }

  function card(d, cfg) {
    var T = TYPES[d.type];
    var P = PALETTES[cfg.palette] || PALETTES[T.palette];
    var names = (Array.isArray(cfg.names) ? cfg.names : [cfg.names]).filter(has);
    var joiner = cfg.joiner || T.joiner;
    var heading = cfg.heading != null ? cfg.heading : T.heading;
    var style = cfg.style || T.style;
    var fx = (cfg.effects || T.effects);
    var decor = (cfg.decor || T.decor);
    var feats = fx.map(function (f) { return FX_WORDS[f]; }).concat(decor.map(function (x) { return DECOR_WORDS[x]; })).filter(Boolean);
    var vars = "--bg:" + P.bg + ";--bg-deep:" + P.bgDeep + ";--glow:" + P.glow + ";--accent:" + P.accent + ";--accent-soft:" + P.accentSoft + ";--text:" + P.text;
    return '<a class="card reveal" data-cat="' + d.cat + '" href="invite.html?example=' + (d.id || d.type) + '" style="' + vars + '">' +
      '<div class="phone style-' + style + '" aria-hidden="true">' +
        miniDecor(decor) + miniFx(fx[0]) +
        '<div class="m-body">' +
          miniEmblem(cfg.emblem || T.emblem) +
          (has(cfg.topLine) ? '<p class="m-top" lang="sa">' + esc(cfg.topLine) + "</p>" : "") +
          (names.length ? '<p class="m-names">' + names.map(function (n) { return '<span class="m-gold">' + esc(n) + "</span>"; }).join('<span class="m-join">' + esc(joiner) + "</span>") + "</p>" : "") +
          (has(heading) ? '<p class="m-heading">' + esc(heading) + "</p>" : "") +
          '<p class="m-when">' + esc(when(cfg)) + "</p>" +
        "</div>" +
      "</div>" +
      '<div class="card-body">' +
        "<h3>" + esc(d.label) + "</h3>" +
        '<p class="feats">' + esc(cap(feats.slice(0, 4).join(" · "))) + "</p>" +
        '<span class="view">View invitation <span aria-hidden="true">→</span></span>' +
      "</div></a>";
  }

  async function start() {
    /* Owner wants the invitation itself on the home page? */
    await loadScript("config.js");
    if (window.INVITE && window.INVITE.home === "invitation") {
      location.replace("invite.html" + location.search);
      return;
    }

    /* "Make your own" → this repo's GitHub page when hosted on GitHub Pages */
    var host = location.hostname, make = document.getElementById("make-own");
    if (/\.github\.io$/.test(host)) {
      var user = host.split(".")[0], repo = location.pathname.split("/").filter(Boolean)[0];
      make.href = "https://github.com/" + user + "/" + (repo && repo.indexOf(".") < 0 ? repo : user + ".github.io");
    } else {
      make.href = "https://github.com/aakashsiwach/shubh-invite";
    }

    /* Load each sample, one at a time (each one sets window.INVITE) */
    var html = "";
    for (var i = 0; i < DESIGNS.length; i++) {
      window.INVITE = null;
      await loadScript("examples/" + (DESIGNS[i].id || DESIGNS[i].type) + ".js");
      html += card(DESIGNS[i], window.INVITE || {});
    }
    var grid = document.getElementById("grid");
    grid.innerHTML = html;

    /* reveal on scroll */
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.1 });
      cards.forEach(function (c, k) { c.style.transitionDelay = (k % 3) * 0.08 + "s"; io.observe(c); });
    } else cards.forEach(function (c) { c.classList.add("in"); });

    /* filters */
    var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
    var count = document.getElementById("count");
    function apply(f) {
      var n = 0;
      cards.forEach(function (c) { var show = f === "all" || c.getAttribute("data-cat") === f; c.hidden = !show; if (show) { n++; c.classList.add("in"); } });
      chips.forEach(function (ch) { ch.setAttribute("aria-pressed", ch.getAttribute("data-f") === f ? "true" : "false"); });
      count.textContent = n + (n === 1 ? " design" : " designs");
    }
    chips.forEach(function (ch) { ch.addEventListener("click", function () { apply(ch.getAttribute("data-f")); }); });
    apply("all");
  }
  start();
})();
