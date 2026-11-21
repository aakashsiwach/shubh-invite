/* Simple line icons (24×24). Use these names for `icon` in your events. */
window.INVITE_ICONS = (function () {
  var p = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    leaf: '<path d="M5 19c0-8 6-14 15-15-1 9-7 15-15 15z"/><path d="M5 19 13 11"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    fire: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3 0-5 1-8z"/>',
    glass: '<path d="M8 3h8l-1 7a3 3 0 0 1-6 0z"/><path d="M12 13v7M8 21h8"/>',
    cake: '<path d="M3 21h18"/><path d="M5 21v-8h14v8"/><path d="M5 16c2.3 1.4 4.7 1.4 7 0s4.7-1.4 7 0"/><path d="M8 13v-3M12 13v-3M16 13v-3"/><path d="M8 7.5c.7-.7.7-1.7 0-2.8-.7 1.1-.7 2.1 0 2.8zM12 7.5c.7-.7.7-1.7 0-2.8-.7 1.1-.7 2.1 0 2.8zM16 7.5c.7-.7.7-1.7 0-2.8-.7 1.1-.7 2.1 0 2.8z"/>',
    diya: '<path d="M3 13h18c-1 4-4.5 6-9 6s-8-2-9-6z"/><path d="M12 4c2 2.5 3 4 3 5.5a3 3 0 0 1-6 0C9 8 10 6.5 12 4z"/>',
    ganesh: '<path d="M12 2.4 13.6 4h-3.2z"/><path d="M8.5 4.3c2.2 1 4.8 1 7 0"/><path d="M8 5.6c0 4 1.7 6.2 4 6.2s4-2.2 4-6.2"/><path d="M8.2 6.4C5.5 5.2 3.2 6.2 3.2 8.4s2.3 3 4.3 2.1"/><path d="M15.8 6.4c2.7-1.2 5-.2 5 2s-2.3 3-4.3 2.1"/><path d="M12 11.8c.2 2.6.6 4.6 2.6 6 1.5 1.1 1 3.1-1 3.1-1.3 0-2.1-1.1-1.7-2.4"/><path d="M10.2 13.2 8.8 15"/><circle cx="10.4" cy="7.6" r=".7" fill="currentColor"/><circle cx="13.6" cy="7.6" r=".7" fill="currentColor"/>',
    ring: '<circle cx="12" cy="15" r="6"/><path d="M9 6l3-3 3 3-3 3z"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    kalash: '<path d="M8 9h8"/><path d="M7 9c-2 2-3 4-3 6 0 3 3 5 8 5s8-2 8-5c0-2-1-4-3-6"/><circle cx="12" cy="5" r="2.5"/><path d="M9.5 6.5 7 5M14.5 6.5 17 5"/>',
    rattle: '<circle cx="9" cy="9" r="5"/><path d="M12.5 12.5 19 19"/><path d="M17.5 20.5l3-3"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z"/>',
    food: '<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 21V3c-2 1-3 4-3 7h3"/>',
    camera: '<path d="M4 7h4l2-2h4l2 2h4v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
    horse: '<path d="M6 20v-5l-2-2 4-6 4-2 1 2h3l3 4-2 1-3-1-1 3 2 6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    soundOn: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    soundOff: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>'
  };
  function icon(name, cls) {
    var body = p[name] || p.star;
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }
  icon.has = function (n) { return !!p[n]; };
  /* Guess an icon from an event title, e.g. "Haldi" → sun */
  icon.guess = function (title) {
    var t = String(title || '').toLowerCase();
    var map = [
      [/haldi|tilak|roka/, 'sun'], [/mehendi|mehndi|henna/, 'leaf'], [/sangeet|music|dj|dance|garba/, 'music'],
      [/phera|vivah|wedding|havan|agni|lagan/, 'fire'], [/baraat|barat|ghodi/, 'horse'], [/reception|cocktail|party|dinner/, 'glass'],
      [/ring|engage|sagai/, 'ring'], [/cake|birthday/, 'cake'], [/puja|pooja|katha|aarti|path|jagran/, 'diya'],
      [/griha|house|home/, 'home'], [/lunch|bhoj|food|prasad|breakfast/, 'food'], [/photo/, 'camera'], [/baby|godh|shower/, 'rattle']
    ];
    for (var i = 0; i < map.length; i++) if (map[i][0].test(t)) return map[i][1];
    return 'star';
  };
  return icon;
})();
