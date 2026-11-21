/*
 * Shubh Invite — Builder (Phase 1, free & serverless).
 *
 * Lets a host create one event "set" (e.g. a Wedding) that contains several
 * sub-invitations (Sagai, Haldi, Mehndi, Shaadi …), fill a form for each,
 * preview it live, and share it as a link. The invitation data is packed
 * INTO the link (#i=…), so no server or database is needed. Everything the
 * host saves lives in this browser (localStorage) until Phase 2 adds accounts.
 */
(function () {
  "use strict";

  /* ============================ storage ============================ */
  var USER_KEY = "shubh.user.v1";
  var DATA_KEY = "shubh.projects.v1";

  function readJSON(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ============================ helpers ============================ */
  function has(v) { return v != null && String(v).trim() !== ""; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function setPath(obj, path, val) {
    var parts = path.split("."), o = obj;
    for (var i = 0; i < parts.length - 1; i++) { o[parts[i]] = o[parts[i]] || {}; o = o[parts[i]]; }
    o[parts[parts.length - 1]] = val;
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }

  /* ---- pack invitation data into a URL-safe string (matches app.js) ---- */
  function pack(obj) {
    var json = JSON.stringify(obj);
    var b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function pageURL(page, hashKey, packed) {
    var base = location.href.replace(/[?#].*$/, "").replace(/[^/]*$/, page);
    return base + "#" + hashKey + "=" + packed;
  }
  function copyLink(url) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        function () { toast("Link copied — paste it on WhatsApp"); },
        function () { shareFallback(url); }
      );
    } else { shareFallback(url); }
  }
  function shareFallback(url) {
    window.open("https://wa.me/?text=" + encodeURIComponent(url), "_blank", "noopener");
  }

  /* ============================ catalog ============================ */
  // Event categories the host picks first.
  var GROUPS = {
    marriage:   { label: "Marriage / Wedding", emoji: "💍", subs: ["roka", "sagai", "tilak", "haldi", "mehndi", "sangeet", "shaadi", "reception", "custom"] },
    birthday:   { label: "Birthday",           emoji: "🎂", subs: ["birthday", "custom"] },
    party:      { label: "Party",              emoji: "🎉", subs: ["party", "custom"] },
    pooja:      { label: "Pooja / Katha",      emoji: "🪔", subs: ["puja", "satyanarayan", "custom"] },
    babyshower: { label: "Baby & Kids",        emoji: "🍼", subs: ["babyshower", "naming", "mundan", "custom"] },
    housewarming:{ label: "Housewarming",      emoji: "🏠", subs: ["griha", "custom"] },
    custom:     { label: "Custom",             emoji: "✨", subs: ["custom"] }
  };

  // Each sub-invitation: which form (schema), which renderer type, default
  // heading, and which family of visual templates it can use.
  var SUBS = {
    roka:        { label: "Roka",               schema: "couple", type: "engagement",  heading: "Roka Ceremony",      gate: "You are invited to the Roka of",       family: "couple" },
    sagai:       { label: "Sagai / Engagement", schema: "couple", type: "engagement",  heading: "Sagai",              gate: "You are invited to the engagement of", family: "rose" },
    tilak:       { label: "Tilak",              schema: "couple", type: "wedding",     heading: "Tilak Ceremony",     gate: "You are invited to the Tilak of",      family: "couple" },
    haldi:       { label: "Haldi",              schema: "couple", type: "mundan",      heading: "Haldi Ceremony",     gate: "You are invited to the Haldi of",      family: "haldi" },
    mehndi:      { label: "Mehndi",             schema: "couple", type: "housewarming",heading: "Mehndi Ceremony",    gate: "You are invited to the Mehndi of",     family: "mehndi" },
    sangeet:     { label: "Sangeet",            schema: "couple", type: "party",       heading: "Sangeet Night",      gate: "You are invited to the Sangeet of",    family: "party" },
    shaadi:      { label: "Shaadi / Wedding",   schema: "couple", type: "wedding",     heading: "Shubh Vivah",        gate: "You are invited to the wedding of",    family: "couple" },
    reception:   { label: "Reception",          schema: "couple", type: "reception",   heading: "Wedding Reception",  gate: "You are invited to the reception of",  family: "royal" },
    birthday:    { label: "Birthday",           schema: "single", type: "birthday",    heading: "Birthday Party",     gate: "You're invited to celebrate",          family: "party" },
    party:       { label: "Party",              schema: "single", type: "party",       heading: "Celebration",        gate: "You're invited",                       family: "party" },
    puja:        { label: "Puja",               schema: "single", type: "puja",        heading: "Puja & Prasad",      gate: "You are invited to the Puja of",       family: "puja" },
    satyanarayan:{ label: "Satyanarayan Katha", schema: "single", type: "puja",        heading: "Satyanarayan Katha", gate: "You are invited to the Katha of",      family: "puja" },
    griha:       { label: "Griha Pravesh",      schema: "single", type: "housewarming",heading: "Griha Pravesh",      gate: "You are invited to the Griha Pravesh of", family: "couple" },
    babyshower:  { label: "Godh Bharai",        schema: "single", type: "babyshower",  heading: "Godh Bharai",        gate: "You're invited to the baby shower of", family: "party" },
    naming:      { label: "Naamkaran",          schema: "single", type: "naming",      heading: "Naamkaran Ceremony", gate: "You're invited to the naming ceremony of", family: "party" },
    mundan:      { label: "Mundan",             schema: "single", type: "mundan",      heading: "Mundan Sanskar",     gate: "You are invited to the Mundan of",     family: "puja" },
    custom:      { label: "Custom",             schema: "single", type: "party",       heading: "Celebration",        gate: "",                                     family: "party" }
  };

  // Hindi default heading (h) + opening title (g) for each occasion. Used when
  // the host picks Hindi and hasn't typed their own heading.
  var HI = {
    roka:        { h: "रोका समारोह",        g: "आप रोका समारोह में सादर आमंत्रित हैं" },
    sagai:       { h: "सगाई समारोह",        g: "आप सगाई समारोह में सादर आमंत्रित हैं" },
    tilak:       { h: "तिलक समारोह",        g: "आप तिलक समारोह में सादर आमंत्रित हैं" },
    haldi:       { h: "हल्दी समारोह",       g: "आप हल्दी समारोह में सादर आमंत्रित हैं" },
    mehndi:      { h: "मेहंदी समारोह",      g: "आप मेहंदी समारोह में सादर आमंत्रित हैं" },
    sangeet:     { h: "संगीत संध्या",       g: "आप संगीत संध्या में सादर आमंत्रित हैं" },
    shaadi:      { h: "शुभ विवाह",          g: "आप विवाह समारोह में सादर आमंत्रित हैं" },
    reception:   { h: "विवाह स्वागत समारोह", g: "आप स्वागत समारोह में सादर आमंत्रित हैं" },
    birthday:    { h: "जन्मदिन समारोह",     g: "आप सादर आमंत्रित हैं" },
    party:       { h: "उत्सव",              g: "आप सादर आमंत्रित हैं" },
    puja:        { h: "पूजा एवं प्रसाद",     g: "आप पूजा में सादर आमंत्रित हैं" },
    satyanarayan:{ h: "सत्यनारायण कथा",     g: "आप कथा में सादर आमंत्रित हैं" },
    griha:       { h: "गृह प्रवेश",         g: "आप गृह प्रवेश में सादर आमंत्रित हैं" },
    babyshower:  { h: "गोद भराई",           g: "आप गोद भराई में सादर आमंत्रित हैं" },
    naming:      { h: "नामकरण संस्कार",     g: "आप नामकरण संस्कार में सादर आमंत्रित हैं" },
    mundan:      { h: "मुंडन संस्कार",      g: "आप मुंडन संस्कार में सादर आमंत्रित हैं" }
  };

  // Visual templates (palette + animations) shown after choosing a sub.
  var TEMPLATES = {
    couple: [
      { id: "maroon",  label: "Royal Maroon",  palette: "maroon",  style: "elegant", effects: ["petals"],           decor: ["toran", "bells", "mandala", "diyas"], emblem: "om" },
      { id: "emerald", label: "Emerald Gold",  palette: "emerald", style: "elegant", effects: ["petals"],           decor: ["toran", "bells", "diyas"],            emblem: "kalash" },
      { id: "rose",    label: "Rose Blush",    palette: "rose",    style: "elegant", effects: ["petals", "hearts"], decor: ["toran", "mandala"],                   emblem: "ring" },
      { id: "royal",   label: "Royal Blue",    palette: "royal",   style: "elegant", effects: ["sparkles"],         decor: ["mandala"],                            emblem: "glass" },
      { id: "sunset",  label: "Sunset Gold",   palette: "sunset",  style: "elegant", effects: ["petals", "sparkles"], decor: ["toran", "mandala"],                 emblem: "om" },
      { id: "grape",   label: "Grape Royal",   palette: "grape",   style: "elegant", effects: ["sparkles"],         decor: ["mandala"],                            emblem: "sparkle" },
      { id: "night",   label: "Midnight Gold", palette: "night",   style: "elegant", effects: ["sparkles"],         decor: ["mandala"],                            emblem: "sparkle" }
    ],
    rose: [
      { id: "rose",    label: "Rose Blush",    palette: "rose",    style: "elegant", effects: ["petals", "hearts"], decor: ["toran", "mandala"], emblem: "ring" },
      { id: "blush",   label: "Soft Blush",    palette: "blush",   style: "playful", effects: ["hearts", "bubbles"],decor: ["bunting"],          emblem: "heart" },
      { id: "fiesta",  label: "Fiesta Pink",   palette: "fiesta",  style: "playful", effects: ["hearts", "confetti"], decor: ["bunting"],        emblem: "heart" },
      { id: "maroon",  label: "Royal Maroon",  palette: "maroon",  style: "elegant", effects: ["petals"],           decor: ["toran", "mandala"], emblem: "om" }
    ],
    haldi: [
      { id: "saffron", label: "Haldi Yellow",  palette: "saffron", style: "playful", effects: ["petals", "sparkles"], decor: ["bunting", "toran"], emblem: "sun" },
      { id: "sunset",  label: "Sunset Haldi",  palette: "sunset",  style: "playful", effects: ["petals", "sparkles"], decor: ["bunting", "toran"], emblem: "sun" },
      { id: "emerald", label: "Marigold Gold", palette: "emerald", style: "playful", effects: ["petals"],             decor: ["toran", "bells"],   emblem: "leaf" }
    ],
    mehndi: [
      { id: "emerald", label: "Mehndi Green",  palette: "emerald", style: "playful", effects: ["petals"],           decor: ["bunting", "toran"], emblem: "leaf" },
      { id: "saffron", label: "Festive Gold",  palette: "saffron", style: "playful", effects: ["petals", "sparkles"],decor: ["bunting"],          emblem: "sun" }
    ],
    party: [
      { id: "party",   label: "Purple Confetti", palette: "party",   style: "playful", effects: ["confetti", "balloons"], decor: ["bunting"], emblem: "cake" },
      { id: "sunset",  label: "Sunset Fiesta",   palette: "sunset",  style: "playful", effects: ["confetti", "hearts"],   decor: ["bunting"], emblem: "cake" },
      { id: "tropical",label: "Tropical Pop",    palette: "tropical",style: "playful", effects: ["bubbles", "confetti"],  decor: ["bunting"], emblem: "star" },
      { id: "grape",   label: "Grape Soda",      palette: "grape",   style: "playful", effects: ["confetti", "balloons"], decor: ["bunting"], emblem: "star" },
      { id: "fiesta",  label: "Magenta Night",   palette: "fiesta",  style: "playful", effects: ["sparkles", "confetti"], decor: ["bunting"], emblem: "sparkle" },
      { id: "night",   label: "Night Sparkle",   palette: "night",   style: "elegant", effects: ["sparkles", "confetti"], decor: [],          emblem: "sparkle" },
      { id: "sky",     label: "Sky Blue",        palette: "sky",     style: "playful", effects: ["sparkles", "bubbles"],  decor: ["bunting"], emblem: "star" }
    ],
    puja: [
      { id: "saffron", label: "Saffron Diya",   palette: "saffron", style: "elegant", effects: ["petals", "sparkles"], decor: ["toran", "bells", "diyas", "mandala"], emblem: "diya" },
      { id: "maroon",  label: "Temple Maroon",  palette: "maroon",  style: "elegant", effects: ["petals"],             decor: ["toran", "bells", "mandala", "diyas"], emblem: "om" }
    ],
    royal: [
      { id: "royal",   label: "Royal Reception", palette: "royal", style: "elegant", effects: ["sparkles"], decor: ["mandala"], emblem: "glass" },
      { id: "night",   label: "Midnight Gold",   palette: "night", style: "elegant", effects: ["sparkles"], decor: ["mandala"], emblem: "sparkle" }
    ]
  };
  // Two unified themes offered for EVERY invitation, so a whole set looks
  // consistent whichever events it contains.
  var UNIVERSAL = [
    { id: "redpink",   label: "Red & Pink (Traditional)", palette: "redcream", style: "elegant", effects: ["petals"], decor: ["arch", "florals"], emblem: "ganesh", cover: "assets/couple-photo.jpg" },
    { id: "cream",     label: "Cream & Gold",  palette: "ivory",   style: "elegant", effects: ["petals"],             decor: ["arch", "florals"],                      emblem: "ganesh" },
    { id: "royalarch", label: "Royal Arch",    palette: "maroon",  style: "elegant", effects: ["petals"],             decor: ["arch", "florals", "diyas"],             emblem: "ganesh" },
    { id: "pastel",    label: "Pastel Minimal",palette: "pearl",   style: "elegant", effects: [],                     decor: ["florals"],                              emblem: "ring" },
    { id: "floral",    label: "Floral",        palette: "rose",    style: "elegant", effects: ["petals", "hearts"],   decor: ["florals", "mandala"],                   emblem: "om" },
    { id: "festive",   label: "Festive",       palette: "saffron", style: "elegant", effects: ["petals", "sparkles"], decor: ["toran", "bells", "diyas", "mandala"],   emblem: "diya" },
    { id: "botanical", label: "Botanical",     palette: "emerald", style: "elegant", effects: ["petals"],             decor: ["florals", "mandala"],                   emblem: "leaf" },
    { id: "royal",     label: "Royal",         palette: "royal",   style: "elegant", effects: ["sparkles"],           decor: ["arch", "mandala", "bells"],             emblem: "glass" }
  ];
  function templatesFor(sub) { return UNIVERSAL.concat(TEMPLATES[SUBS[sub].family] || TEMPLATES.couple); }
  function findTemplate(sub, id) {
    var list = templatesFor(sub);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  }

  /* ============================ form schemas ============================ */
  var EVENT_ROW = [
    { k: "title", label: "What", type: "text", req: true, placeholder: "Haldi" },
    { k: "date", label: "Day", type: "text", placeholder: "Fri, 12 Feb" },
    { k: "time", label: "Time", type: "text", placeholder: "10:00 AM" },
    { k: "venue", label: "Where", type: "text", placeholder: "Sharma Residence" },
    { k: "note", label: "Note", type: "text", placeholder: "Dress code: Yellow" }
  ];
  var CONTACT_ROW = [
    { k: "name", label: "Name", type: "text", placeholder: "Rohit Sharma" },
    { k: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210" }
  ];
  var PARTY_ROW = [
    { k: "role", label: "Label", type: "text", placeholder: "Groom" },
    { k: "name", label: "Name", type: "text", req: true, placeholder: "Arjun" },
    { k: "lineage", label: "Relation", type: "select", opts: ["son of", "daughter of", "child of", ""] },
    { k: "parents", label: "Parents", type: "text", placeholder: "Mr. & Mrs. Mehta" },
    { k: "address", label: "City / address", type: "text", placeholder: "New Delhi" },
    { k: "phone", label: "Phone", type: "tel", placeholder: "" }
  ];

  var COMMON_TAIL = [
    { title: "Venue", fields: [
      { k: "venue.name", label: "Venue name", type: "text", placeholder: "The Grand Lawn" },
      { k: "venue.address", label: "Address", type: "textarea", placeholder: "Tonk Road, Jaipur" },
      { k: "venue.mapLink", label: "Google Maps link", type: "url", help: "Paste a Maps share link (optional)" }
    ] },
    { title: "Programme (add the sub-events, drag with ▲▼)", fields: [
      { k: "events", label: "", type: "repeat", row: EVENT_ROW, itemLabel: "Event", add: "Add event" }
    ] },
    { title: "Contacts for guests", fields: [
      { k: "contacts", label: "", type: "repeat", row: CONTACT_ROW, itemLabel: "Contact", add: "Add contact" }
    ] },
    { title: "Photos & music", fields: [
      { k: "photos.cover", label: "Cover photo URL", type: "url", help: "A direct link to an image (optional)" },
      { k: "gallery", label: "Gallery photo URLs", type: "textarea", help: "One link per line" },
      { k: "music", label: "Music URL (mp3)", type: "url" }
    ] },
    { title: "Footer", fields: [
      { k: "footer", label: "Footer message", type: "text", placeholder: "Your blessings are our greatest gift" },
      { k: "compliments", label: "With compliments", type: "text", placeholder: "Sharma & Mehta Families" }
    ] },
    { title: "Design & layout", fields: [
      { k: "lang", label: "Language", type: "select", opts: ["English", "हिन्दी (Hindi)"], help: "Language of the fixed text (countdown, venue, calendar and buttons). Guests can switch with one tap." },
      { k: "bg", label: "Background", type: "select", opts: ["Keep theme", "Light cream & gold", "Rich (dark)"], help: "Light = a cream/ivory Canva-style look." },
      { k: "emblem", label: "Symbol (shown when there's no cover photo)", type: "select", opts: ["Keep theme", "Ganesha", "Om (ॐ)", "Diya", "Ring", "Kalash", "Heart", "Star"] },
      { k: "arch", label: "Arch frame", type: "select", opts: ["No arch", "Temple arch"], help: "A decorative mehrab arch framing the opening." },
      { k: "florals", label: "Floral corners", type: "select", opts: ["No florals", "Floral corners"], help: "Rose & leaf clusters in the corners." },
      { k: "entrance", label: "Entry animation", type: "select", opts: ["Keep theme", "Rise up", "Zoom in", "Fade in", "Slide in", "Flip in", "Drop in", "Soft blur", "Pop", "Pan in", "Tilt in"], help: "How the invitation (and each section on scroll) animates in." },
      { k: "gateAnim", label: "Opening style", type: "select", opts: ["Keep theme", "Doli (palanquin)", "Doors", "Curtain lift", "Unfold", "Fade", "Zoom"], help: "How the opening screen reveals the invitation." },
      { k: "bgfx", label: "Background motion", type: "select", opts: ["On", "Off"], help: "Subtle drifting glow behind the opening." },
      { k: "density", label: "Page length", type: "select", opts: ["Compact (less scrolling)", "Standard (more spacing)"], help: "Compact is the default — tighter spacing so guests scroll less." },
      { k: "map", label: "Map link", type: "select", opts: ["Show map link", "Hide map link"], help: "A tappable link that opens the venue in Google Maps (uses the Maps link you paste above, or the address)." }
    ] }
  ];

  var SCHEMAS = {
    couple: [
      { title: "Heading", fields: [
        { k: "topLine", label: "Blessing line (top)", type: "text", placeholder: "॥ श्री गणेशाय नमः ॥" },
        { k: "heroLabel", label: "Line above the names", type: "text", placeholder: "Together with their families" },
        { k: "heading", label: "Main title", type: "text", req: true, placeholder: "Shubh Vivah" }
      ] },
      { title: "The two sides (drag with ▲▼ to set who shows first)", fields: [
        { k: "parties", label: "", type: "repeat", row: PARTY_ROW, itemLabel: "Side", add: "Add side", min: 1 }
      ] },
      { title: "Date & place", fields: [
        { k: "date", label: "Date & time", type: "datetime", req: true },
        { k: "place", label: "City / place", type: "text", placeholder: "Jaipur" },
        { k: "dateText", label: "Write the date your own way (optional)", type: "text" }
      ] },
      { title: "Invitation message", fields: [
        { k: "shloka", label: "Shloka / blessing", type: "textarea", placeholder: "वक्रतुण्ड महाकाय…" },
        { k: "invitation.hosts", label: "Invited by (hosts)", type: "text", placeholder: "Mrs. & Mr. Rajesh Sharma" },
        { k: "invitation.message", label: "Message", type: "textarea", placeholder: "joyfully invite you to grace the wedding of…" },
        { k: "invitation.after", label: "Line after the names", type: "text" }
      ] }
    ].concat(COMMON_TAIL),

    single: [
      { title: "Heading", fields: [
        { k: "topLine", label: "Blessing line (top)", type: "text", placeholder: "॥ श्री गणेशाय नमः ॥" },
        { k: "heroLabel", label: "Line above the name", type: "text", placeholder: "You are invited" },
        { k: "names", label: "Name(s)", type: "text", req: true, placeholder: "Aarav   (or   Aarav, Diya)", help: "Separate two names with a comma" },
        { k: "heading", label: "Main title", type: "text", req: true, placeholder: "Birthday Party" }
      ] },
      { title: "Date & place", fields: [
        { k: "date", label: "Date & time", type: "datetime", req: true },
        { k: "place", label: "City / place", type: "text" },
        { k: "dateText", label: "Write the date your own way (optional)", type: "text" }
      ] },
      { title: "Invitation message", fields: [
        { k: "shloka", label: "Blessing / quote", type: "textarea" },
        { k: "invitation.hosts", label: "Invited by (hosts)", type: "text" },
        { k: "invitation.message", label: "Message", type: "textarea" },
        { k: "invitation.after", label: "Line after the name", type: "text" }
      ] }
    ].concat(COMMON_TAIL)
  };

  /* ============================ build INVITE config ============================ */
  function cleanRows(list, keyName) {
    return (Array.isArray(list) ? list : []).filter(function (r) {
      return r && has(r[keyName]);
    });
  }
  function buildConfig(card) {
    var sub = SUBS[card.sub];
    var tpl = findTemplate(card.sub, card.template);
    var d = card.data || {};
    var cfg = { type: sub.type, timezone: "+05:30" };
    if (tpl) { cfg.palette = tpl.palette; cfg.style = tpl.style; cfg.effects = tpl.effects; cfg.decor = tpl.decor; cfg.emblem = tpl.emblem; }

    SCHEMAS[sub.schema].forEach(function (sec) {
      sec.fields.forEach(function (f) {
        var val = d[f.k];
        if (f.type === "repeat") {
          if (f.k === "parties") {
            var ps = cleanRows(val, "name");
            if (ps.length) { cfg.parties = ps; cfg.names = ps.map(function (p) { return p.name; }); cfg.joiner = "&"; cfg.partiesTitle = "With the blessings of our families"; }
          } else if (f.k === "events") {
            var evs = cleanRows(val, "title");
            if (evs.length) cfg.events = evs;
          } else if (f.k === "contacts") {
            var cs = (Array.isArray(val) ? val : []).filter(function (r) { return r && (has(r.name) || has(r.phone)); });
            if (cs.length) cfg.contacts = cs;
          }
          return;
        }
        if (!has(val)) return;
        if (f.k === "lang") { cfg.lang = /hind|हिन/i.test(val) ? "hi" : "en"; return; }
        if (f.k === "entrance") { var en = { "Rise up": "rise", "Zoom in": "zoom", "Fade in": "fade", "Slide in": "slide", "Flip in": "flip", "Drop in": "drop", "Soft blur": "blur", "Pop": "pop", "Pan in": "pan", "Tilt in": "tilt" }[val]; if (en) cfg.entrance = en; return; }
        if (f.k === "gateAnim") { var ga = { "Doli (palanquin)": "doli", "Doors": "doors", "Curtain lift": "curtain", "Unfold": "unfold", "Fade": "fade", "Zoom": "zoom" }[val]; if (ga) cfg._gateAnim = ga; return; }
        if (f.k === "bgfx") { if (/off/i.test(val)) cfg.bgfx = "off"; return; }
        if (f.k === "density") { cfg.density = /comfort|standard/i.test(val) ? "comfortable" : "compact"; return; }
        if (f.k === "map") { if (/hide/i.test(val)) cfg.map = "none"; return; }
        if (f.k === "bg") { if (/light|cream/i.test(val)) cfg.palette = "ivory"; else if (/rich|dark/i.test(val)) cfg._darkBg = true; return; }
        if (f.k === "emblem") { var em = { "Ganesha": "ganesh", "Om (ॐ)": "om", "Diya": "diya", "Ring": "ring", "Kalash": "kalash", "Heart": "heart", "Star": "star" }[val]; if (em) cfg.emblem = em; return; }
        if (f.k === "arch") { if (/temple|arch/i.test(val) && !/no/i.test(val)) cfg._arch = true; return; }
        if (f.k === "florals") { if (/floral/i.test(val) && !/no/i.test(val)) cfg._florals = true; return; }
        if (f.k === "names") { cfg.names = String(val).split(",").map(function (s) { return s.trim(); }).filter(Boolean); return; }
        if (f.k === "gallery") { setPath(cfg, "photos.gallery", String(val).split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean)); return; }
        setPath(cfg, f.k, val);
      });
    });

    // Correct opening ("gate") title for this occasion — otherwise Haldi/Mehndi
    // etc. would inherit the wrong wording from their theme type. In Hindi, use
    // the Hindi heading/title unless the host typed their own heading.
    var gt = sub.gate;
    if (cfg.lang === "hi" && HI[card.sub]) {
      if (!has(d.heading) || d.heading === sub.heading) cfg.heading = HI[card.sub].h;
      gt = HI[card.sub].g;
    }
    if (card.sub === "custom") gt = cfg.lang === "hi" ? "आप सादर आमंत्रित हैं" : ("You're invited to " + (has(cfg.heading) ? cfg.heading : "our celebration"));
    if (has(gt)) cfg.gate = { title: gt };
    if (cfg._gateAnim) { cfg.gate = cfg.gate || {}; cfg.gate.anim = cfg._gateAnim; delete cfg._gateAnim; }

    // Decoration toggles (arch / florals) on top of the template's decor.
    if (cfg._arch || cfg._florals) {
      var decor = (cfg.decor || []).slice();
      if (cfg._arch && decor.indexOf("arch") < 0) decor.push("arch");
      if (cfg._florals && decor.indexOf("florals") < 0) decor.push("florals");
      cfg.decor = decor;
    }
    delete cfg._arch; delete cfg._florals;
    // "Rich (dark)" chosen on a light template → fall back to a dark palette.
    if (cfg._darkBg) { if (cfg.palette === "ivory" || cfg.palette === "pearl") cfg.palette = "maroon"; delete cfg._darkBg; }

    // Invitations made here carry their data in the link, not in folders.
    // Tell the renderer not to hunt the photos/ and music/ folders (avoids 404s).
    cfg.photos = cfg.photos || {};
    if (!has(cfg.photos.cover)) cfg.photos.cover = "none";
    if (!Array.isArray(cfg.photos.gallery) || !cfg.photos.gallery.length) cfg.photos.gallery = "none";
    if (!has(cfg.music)) cfg.music = "none";
    return cfg;
  }
  function cardURL(card) { return pageURL("invite.html", "i", pack(buildConfig(card))); }
  function cardLabel(card) { return card.name || SUBS[card.sub].label; }

  /* ============================ state ============================ */
  var state = { user: readJSON(USER_KEY, null), projects: readJSON(DATA_KEY, []), screen: "login", pid: null, cid: null };
  function save() { writeJSON(DATA_KEY, state.projects); }
  function currentProject() { return state.projects.filter(function (p) { return p.id === state.pid; })[0]; }
  function currentCard() { var p = currentProject(); return p && p.cards.filter(function (c) { return c.id === state.cid; })[0]; }

  var root = document.getElementById("root");
  function render() {
    if (!state.user) return renderLogin();
    if (state.screen === "editor" && currentProject()) return renderEditor();
    return renderDashboard();
  }

  /* ============================ login ============================ */
  function renderLogin() {
    var existing = state.user;
    root.innerHTML = "";
    var card = el(
      '<div class="auth">' +
        '<div class="auth-card">' +
          '<p class="brand">॥ शुभ ॥</p>' +
          '<h1>Shubh Invite</h1>' +
          '<p class="muted">' + (existing ? "Enter your PIN to continue." : "Set a phone or email and a PIN. This keeps your invitations on this device.") + "</p>" +
          '<form id="auth-form" novalidate>' +
            (existing ? "" : '<label>Phone or email<input name="contact" type="text" autocomplete="username" required placeholder="you@example.com or 98765…"></label>') +
            '<label>PIN (4–8 digits)<input name="pin" type="password" inputmode="numeric" autocomplete="' + (existing ? "current-password" : "new-password") + '" required placeholder="••••"></label>' +
            '<p class="form-err" id="auth-err"></p>' +
            '<button class="btn solid wide" type="submit">' + (existing ? "Unlock" : "Create & continue") + "</button>" +
          "</form>" +
          (existing ? '<button class="linkbtn" id="reset">Use a different account / reset</button>' : "") +
          '<p class="fineprint">Phase 1 is free and works without a server. Your data is stored only in this browser, and the PIN is a simple local lock — not bank-grade security.</p>' +
        "</div>" +
      "</div>"
    );
    root.appendChild(card);

    $("#auth-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, err = $("#auth-err");
      var pin = f.pin.value.trim();
      if (!/^\d{4,8}$/.test(pin)) { err.textContent = "PIN must be 4–8 digits."; return; }
      if (existing) {
        if (pin !== existing.pin) { err.textContent = "Wrong PIN. Try again."; return; }
        state.screen = "dashboard"; render();
      } else {
        var contact = f.contact.value.trim();
        if (!has(contact)) { err.textContent = "Enter a phone or email."; return; }
        state.user = { contact: contact, pin: pin, createdAt: Date.now() };
        writeJSON(USER_KEY, state.user);
        state.screen = "dashboard"; render();
      }
    });
    if (existing) $("#reset").addEventListener("click", function () {
      if (confirm("Reset the local account? Your saved invitations stay, but you'll set a new PIN.")) {
        localStorage.removeItem(USER_KEY); state.user = null; render();
      }
    });
  }

  /* ============================ dashboard ============================ */
  function renderDashboard() {
    root.innerHTML = "";
    var head = el(
      '<header class="bar">' +
        '<div class="bar-in">' +
          '<a class="brand-sm" href="index.html">॥ शुभ ॥ <span>Shubh Invite</span></a>' +
          '<div class="bar-actions"><button class="linkbtn" id="lock">Lock</button></div>' +
        "</div>" +
      "</header>"
    );
    root.appendChild(head);

    var wrap = el('<main class="page"></main>');
    wrap.appendChild(el('<div class="page-head"><h1>Your invitations</h1><button class="btn solid" id="new">+ New invitation set</button></div>'));

    if (!state.projects.length) {
      wrap.appendChild(el('<p class="empty">No invitations yet. Tap <strong>New invitation set</strong> to start — pick an occasion, add the sub-events (Sagai, Haldi, Shaadi…), fill the details, and share the link.</p>'));
    } else {
      var grid = el('<div class="proj-grid"></div>');
      state.projects.forEach(function (p) {
        var g = GROUPS[p.type] || GROUPS.custom;
        var c = el(
          '<article class="proj">' +
            '<div class="proj-top">' + g.emoji + "</div>" +
            '<h3>' + esc(p.title || g.label) + "</h3>" +
            '<p class="muted">' + g.label + " · " + p.cards.length + " invitation" + (p.cards.length === 1 ? "" : "s") + "</p>" +
            '<div class="proj-actions"><button class="btn sm" data-open>Open</button><button class="btn sm ghost" data-del>Delete</button></div>' +
          "</article>"
        );
        $("[data-open]", c).addEventListener("click", function () { state.pid = p.id; state.cid = p.cards[0] ? p.cards[0].id : null; state.screen = "editor"; render(); });
        $("[data-del]", c).addEventListener("click", function () {
          if (confirm("Delete “" + (p.title || g.label) + "”?")) { state.projects = state.projects.filter(function (x) { return x.id !== p.id; }); save(); render(); }
        });
        grid.appendChild(c);
      });
      wrap.appendChild(grid);
    }
    root.appendChild(wrap);

    $("#lock").addEventListener("click", function () { state.screen = "login"; render(); });
    $("#new").addEventListener("click", openTypeChooser);
  }

  /* ---- choose occasion (new project) ---- */
  function openTypeChooser() {
    modal("Choose an occasion", function (body, close) {
      var grid = el('<div class="pick-grid"></div>');
      Object.keys(GROUPS).forEach(function (key) {
        var g = GROUPS[key];
        var b = el('<button class="pick"><span class="pick-emoji">' + g.emoji + '</span><span class="pick-label">' + g.label + "</span></button>");
        b.addEventListener("click", function () {
          var p = { id: uid(), type: key, title: g.label, cards: [], sets: [], createdAt: Date.now() };
          state.projects.unshift(p); save();
          state.pid = p.id; state.cid = null; state.screen = "editor";
          close(); render();
          // Prompt to add the first invitation straight away.
          openSubChooser();
        });
        grid.appendChild(b);
      });
      body.appendChild(grid);
    });
  }

  /* ---- choose a sub-invitation, then a template ---- */
  function openSubChooser() {
    var p = currentProject(); if (!p) return;
    var g = GROUPS[p.type] || GROUPS.custom;
    modal("Add an invitation", function (body, close) {
      var grid = el('<div class="pick-grid"></div>');
      g.subs.forEach(function (key) {
        var b = el('<button class="pick"><span class="pick-label">' + esc(SUBS[key].label) + "</span></button>");
        b.addEventListener("click", function () { close(); openTemplateChooser(key); });
        grid.appendChild(b);
      });
      body.appendChild(grid);
    });
  }
  function openTemplateChooser(sub) {
    modal("Choose a design for " + SUBS[sub].label, function (body, close) {
      var grid = el('<div class="tpl-grid"></div>');
      templatesFor(sub).forEach(function (t) {
        var sw = el(
          '<button class="tpl" data-pal="' + t.palette + '">' +
            '<span class="tpl-swatch swatch-' + t.palette + '"></span>' +
            '<span class="tpl-label">' + esc(t.label) + "</span>" +
          "</button>"
        );
        sw.addEventListener("click", function () {
          var p = currentProject();
          var data = defaultData(sub);
          if (t.cover) data["photos.cover"] = t.cover;
          var card = { id: uid(), sub: sub, name: "", template: t.id, data: data };
          p.cards.push(card); save();
          state.cid = card.id; close(); render();
        });
        grid.appendChild(sw);
      });
      body.appendChild(grid);
    });
  }
  function defaultData(sub) {
    var d = { heading: SUBS[sub].heading, date: "", topLine: "॥ श्री गणेशाय नमः ॥" };
    if (SUBS[sub].schema === "couple") d.parties = [{ role: "Groom", name: "", lineage: "son of" }, { role: "Bride", name: "", lineage: "daughter of" }];
    return d;
  }

  /* ============================ editor ============================ */
  var previewTimer;
  function refreshPreview() {
    var card = currentCard(); var frame = $("#preview");
    if (!card || !frame) return;
    clearTimeout(previewTimer);
    previewTimer = setTimeout(function () { frame.src = cardURL(card); }, 450);
  }

  function renderEditor() {
    var p = currentProject();
    root.innerHTML = "";
    var head = el(
      '<header class="bar">' +
        '<div class="bar-in">' +
          '<button class="linkbtn" id="back">← All sets</button>' +
          '<input class="title-in" id="ptitle" value="' + esc(p.title) + '" aria-label="Set title">' +
          '<div class="bar-actions"><button class="btn sm" id="shareall">Share group link</button></div>' +
        "</div>" +
      "</header>"
    );
    root.appendChild(head);

    var layout = el('<div class="editor"></div>');

    /* --- card rail --- */
    var rail = el('<nav class="rail"><p class="rail-h">Invitations in this set</p><div class="rail-list" id="rail"></div><button class="btn ghost wide" id="addsub">+ Add invitation</button></nav>');
    layout.appendChild(rail);

    /* --- form column --- */
    var formCol = el('<section class="form-col" id="formcol"></section>');
    layout.appendChild(formCol);

    /* --- preview column --- */
    var prevCol = el(
      '<section class="prev-col">' +
        '<div class="prev-frame"><iframe id="preview" title="Live preview" referrerpolicy="no-referrer"></iframe></div>' +
        '<div class="prev-actions">' +
          '<button class="btn sm" id="openfull">Open full</button>' +
          '<button class="btn sm solid" id="copyone">Copy this link</button>' +
        "</div>" +
        '<div id="sets"></div>' +
      "</section>"
    );
    layout.appendChild(prevCol);
    root.appendChild(layout);

    $("#back").addEventListener("click", function () { state.screen = "dashboard"; render(); });
    $("#ptitle").addEventListener("input", function (e) { p.title = e.target.value; save(); });
    $("#addsub").addEventListener("click", openSubChooser);
    $("#shareall").addEventListener("click", function () { shareSet(null); });
    $("#openfull").addEventListener("click", function () { var c = currentCard(); if (c) window.open(cardURL(c), "_blank", "noopener"); });
    $("#copyone").addEventListener("click", function () { var c = currentCard(); if (c) copyLink(cardURL(c)); });

    renderRail();
    renderForm();
    renderSets();
    refreshPreview();
  }

  function renderRail() {
    var p = currentProject(); var list = $("#rail"); if (!list) return;
    list.innerHTML = "";
    if (!p.cards.length) { list.appendChild(el('<p class="muted sm">No invitations yet.</p>')); return; }
    p.cards.forEach(function (card) {
      var item = el(
        '<div class="rail-item' + (card.id === state.cid ? " active" : "") + '">' +
          '<button class="rail-pick">' + esc(cardLabel(card)) + "</button>" +
          '<button class="rail-del" title="Remove" aria-label="Remove">✕</button>' +
        "</div>"
      );
      $(".rail-pick", item).addEventListener("click", function () { state.cid = card.id; renderRail(); renderForm(); refreshPreview(); });
      $(".rail-del", item).addEventListener("click", function () {
        if (!confirm("Remove “" + cardLabel(card) + "” from this set?")) return;
        p.cards = p.cards.filter(function (c) { return c.id !== card.id; });
        p.sets.forEach(function (s) { s.cardIds = s.cardIds.filter(function (id) { return id !== card.id; }); });
        if (state.cid === card.id) state.cid = p.cards[0] ? p.cards[0].id : null;
        save(); renderRail(); renderForm(); renderSets(); refreshPreview();
      });
      list.appendChild(item);
    });
  }

  function renderForm() {
    var col = $("#formcol"); var card = currentCard();
    col.innerHTML = "";
    if (!card) { col.appendChild(el('<p class="empty">Add an invitation on the left to start editing.</p>')); return; }
    var sub = SUBS[card.sub];

    col.appendChild(el(
      '<div class="form-head">' +
        '<div><span class="tag">' + esc(sub.label) + '</span><input class="cardname-in" id="cardname" placeholder="' + esc(sub.label) + '" value="' + esc(card.name) + '" aria-label="Rename this invitation"></div>' +
        '<button class="linkbtn" id="changetpl">Change design</button>' +
      "</div>"
    ));
    $("#cardname").addEventListener("input", function (e) { card.name = e.target.value; save(); renderRail(); });
    $("#changetpl").addEventListener("click", function () { openTemplateChooser(card.sub); });

    SCHEMAS[sub.schema].forEach(function (sec) {
      var fs = el('<fieldset class="sec"><legend>' + esc(sec.title) + "</legend></fieldset>");
      sec.fields.forEach(function (f) { fs.appendChild(renderField(card, f)); });
      col.appendChild(fs);
    });
  }

  function renderField(card, f) {
    var d = card.data;
    if (f.type === "repeat") return renderRepeat(card, f);

    var id = "f_" + f.k.replace(/\W/g, "_");
    var val = d[f.k] == null ? "" : d[f.k];
    var wrap = el('<label class="fld" for="' + id + '"><span class="fld-l">' + esc(f.label) + (f.req ? ' <em>*</em>' : "") + "</span></label>");
    var input;
    if (f.type === "textarea") {
      input = el('<textarea id="' + id + '" rows="3"></textarea>');
      input.value = val;
    } else if (f.type === "select") {
      input = el('<select id="' + id + '"></select>');
      f.opts.forEach(function (o) {
        var op = el('<option value="' + esc(o) + '">' + (o === "" ? "—" : esc(o)) + "</option>");
        if (o === val) op.selected = true;
        input.appendChild(op);
      });
    } else {
      var t = f.type === "datetime" ? "datetime-local" : (f.type === "tel" ? "tel" : (f.type === "url" ? "url" : "text"));
      input = el('<input id="' + id + '" type="' + t + '">');
      input.value = val;
      if (f.placeholder) input.placeholder = f.placeholder;
    }
    input.addEventListener("input", function () { d[f.k] = input.value; save(); refreshPreview(); });
    wrap.appendChild(input);
    if (f.help) wrap.appendChild(el('<span class="fld-help">' + esc(f.help) + "</span>"));
    return wrap;
  }

  function renderRepeat(card, f) {
    var d = card.data;
    if (!Array.isArray(d[f.k])) d[f.k] = [];
    var box = el('<div class="repeat"></div>');
    var rowsWrap = el('<div class="rows"></div>');
    box.appendChild(rowsWrap);

    function draw() {
      rowsWrap.innerHTML = "";
      d[f.k].forEach(function (row, i) {
        var rowEl = el('<div class="row"></div>');
        var grid = el('<div class="row-grid"></div>');
        f.row.forEach(function (rf) {
          var id = "r_" + f.k + "_" + i + "_" + rf.k;
          var cell = el('<label class="fld sm" for="' + id + '"><span class="fld-l">' + esc(rf.label) + "</span></label>");
          var inp;
          if (rf.type === "select") {
            inp = el('<select id="' + id + '"></select>');
            rf.opts.forEach(function (o) { var op = el('<option value="' + esc(o) + '">' + (o === "" ? "—" : esc(o)) + "</option>"); if (o === (row[rf.k] || "")) op.selected = true; inp.appendChild(op); });
          } else {
            inp = el('<input id="' + id + '" type="' + (rf.type === "tel" ? "tel" : rf.type === "url" ? "url" : "text") + '">');
            inp.value = row[rf.k] == null ? "" : row[rf.k];
            if (rf.placeholder) inp.placeholder = rf.placeholder;
          }
          inp.addEventListener("input", function () { row[rf.k] = inp.value; save(); refreshPreview(); });
          cell.appendChild(inp);
          grid.appendChild(cell);
        });
        rowEl.appendChild(grid);
        var tools = el(
          '<div class="row-tools">' +
            '<button class="icbtn" data-up title="Move up" aria-label="Move up">▲</button>' +
            '<button class="icbtn" data-down title="Move down" aria-label="Move down">▼</button>' +
            '<button class="icbtn del" data-rm title="Remove" aria-label="Remove">✕</button>' +
          "</div>"
        );
        $("[data-up]", tools).addEventListener("click", function () { if (i > 0) { var a = d[f.k]; a.splice(i - 1, 0, a.splice(i, 1)[0]); save(); draw(); refreshPreview(); } });
        $("[data-down]", tools).addEventListener("click", function () { var a = d[f.k]; if (i < a.length - 1) { a.splice(i + 1, 0, a.splice(i, 1)[0]); save(); draw(); refreshPreview(); } });
        $("[data-rm]", tools).addEventListener("click", function () { if (f.min && d[f.k].length <= f.min) { toast("At least " + f.min + " needed."); return; } d[f.k].splice(i, 1); save(); draw(); refreshPreview(); });
        rowEl.appendChild(tools);
        rowsWrap.appendChild(rowEl);
      });
    }
    draw();
    var addBtn = el('<button class="btn ghost sm" type="button">+ ' + esc(f.add || "Add") + "</button>");
    addBtn.addEventListener("click", function () { var o = {}; f.row.forEach(function (rf) { o[rf.k] = ""; }); d[f.k].push(o); save(); draw(); refreshPreview(); });
    box.appendChild(addBtn);
    return box;
  }

  /* ============================ recipient sets ============================ */
  function renderSets() {
    var box = $("#sets"); var p = currentProject(); if (!box) return;
    box.innerHTML = "";
    box.appendChild(el('<p class="sets-h">Who gets what</p>'));
    box.appendChild(el('<p class="muted sm">Make a set of invitations (e.g. only Sagai, or Sagai + Shaadi, or all) and share that one link with those guests.</p>'));

    var list = el('<div class="sets-list"></div>');
    p.sets.forEach(function (s) {
      var item = el(
        '<div class="setrow">' +
          '<div class="setrow-top"><strong>' + esc(s.name) + "</strong><div>" +
            '<button class="linkbtn" data-copy>Copy link</button> · <button class="linkbtn" data-del>Delete</button>' +
          "</div></div>" +
          '<div class="setrow-chips"></div>' +
        "</div>"
      );
      var chips = $(".setrow-chips", item);
      p.cards.forEach(function (card) {
        var on = s.cardIds.indexOf(card.id) > -1;
        var chip = el('<button class="chip2' + (on ? " on" : "") + '">' + esc(cardLabel(card)) + "</button>");
        chip.addEventListener("click", function () {
          var idx = s.cardIds.indexOf(card.id);
          if (idx > -1) s.cardIds.splice(idx, 1); else s.cardIds.push(card.id);
          save(); renderSets();
        });
        chips.appendChild(chip);
      });
      $("[data-copy]", item).addEventListener("click", function () { shareSet(s); });
      $("[data-del]", item).addEventListener("click", function () { p.sets = p.sets.filter(function (x) { return x.id !== s.id; }); save(); renderSets(); });
      list.appendChild(item);
    });
    box.appendChild(list);

    var add = el('<button class="btn ghost sm wide" id="addset">+ New set</button>');
    add.addEventListener("click", function () {
      var name = prompt("Name this set (e.g. Only Sagai, Close family — all events):", "Guest set " + (p.sets.length + 1));
      if (name == null) return;
      p.sets.push({ id: uid(), name: name.trim() || "Guest set", cardIds: p.cards.map(function (c) { return c.id; }) });
      save(); renderSets();
    });
    box.appendChild(add);
  }

  // Share a set (or the whole group when set is null) as one grouped link.
  function shareSet(set) {
    var p = currentProject();
    var cards = set ? p.cards.filter(function (c) { return set.cardIds.indexOf(c.id) > -1; }) : p.cards;
    cards = cards.filter(function (c) { return has(buildConfig(c).heading) || (buildConfig(c).names || []).length; });
    if (!cards.length) { toast("Add some invitation details first."); return; }
    if (cards.length === 1) { copyLink(cardURL(cards[0])); return; }
    var configs = cards.map(function (c) { return { l: cardLabel(c), c: buildConfig(c) }; });
    var payload = { t: p.title || (GROUPS[p.type] || GROUPS.custom).label, lang: (configs[0] && configs[0].c.lang) || "en", items: configs };
    copyLink(pageURL("group.html", "g", pack(payload)));
  }

  /* ============================ modal ============================ */
  function modal(title, fill) {
    var back = el('<div class="modal-back"><div class="modal"><div class="modal-head"><h2>' + esc(title) + '</h2><button class="icbtn" id="mclose" aria-label="Close">✕</button></div><div class="modal-body"></div></div></div>');
    document.body.appendChild(back);
    function close() { back.remove(); }
    $("#mclose", back).addEventListener("click", close);
    back.addEventListener("click", function (e) { if (e.target === back) close(); });
    fill($(".modal-body", back), close);
  }

  /* ============================ go ============================ */
  render();
})();
