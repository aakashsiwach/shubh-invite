/*
 * Colour palettes and invitation types.
 * You normally don't need to edit this file — pick a `type` and (optionally)
 * a `palette` in config.js. Add your own palette here if you like.
 */
window.INVITE_PALETTES = {
  // dark "hero" colours + light "paper" colours for the reading sections
  maroon:   { bg: "#5A0F17", bgDeep: "#3D0A10", glow: "#7A1626", accent: "#D9AE5F", accentSoft: "#F6DFA0", text: "#F6E7C8", textSoft: "#E9D6B0", paper: "#FBF3E4", paper2: "#F3E3C3", ink: "#3D0A10", inkAccent: "#7A1020", inkMuted: "#5A3A10", line: "#C79A4A" },
  rose:     { bg: "#6B1838", bgDeep: "#470F25", glow: "#8E2A52", accent: "#E9B872", accentSoft: "#FBE2B8", text: "#FCEBEF", textSoft: "#F2D3DC", paper: "#FDF4F5", paper2: "#F8E1E6", ink: "#3A0B1E", inkAccent: "#8E1F4A", inkMuted: "#5E2A3D", line: "#D9A0B3" },
  royal:    { bg: "#13284F", bgDeep: "#0B1A36", glow: "#1F3D73", accent: "#D9AE5F", accentSoft: "#F6DFA0", text: "#EEF2FA", textSoft: "#C9D4EA", paper: "#F6F4EE", paper2: "#E9E4D6", ink: "#0B1A36", inkAccent: "#1F3D73", inkMuted: "#3E4B63", line: "#B8A06A" },
  emerald:  { bg: "#163E2C", bgDeep: "#0D2A1D", glow: "#21573F", accent: "#E2B65E", accentSoft: "#F8E2A6", text: "#F1F6EE", textSoft: "#D3E3CF", paper: "#F7F5EC", paper2: "#E8E8D3", ink: "#0D2A1D", inkAccent: "#1D5A3E", inkMuted: "#3B4A35", line: "#B9A563" },
  saffron:  { bg: "#7A2E0B", bgDeep: "#521D05", glow: "#A3420F", accent: "#F4C04E", accentSoft: "#FFE3A0", text: "#FFF3E2", textSoft: "#F8DDBE", paper: "#FFF8EC", paper2: "#FBE8C8", ink: "#3D1603", inkAccent: "#9A3B0C", inkMuted: "#5C3510", line: "#E0A04A" },
  blush:    { bg: "#8E3B5E", bgDeep: "#6A2846", glow: "#B0567C", accent: "#FFD6A5", accentSoft: "#FFEBD1", text: "#FFF4F8", textSoft: "#FADDE8", paper: "#FFF7F9", paper2: "#FCE7EE", ink: "#4A1630", inkAccent: "#9C3364", inkMuted: "#6A3A50", line: "#E8A9C2" },
  sky:      { bg: "#1F4E79", bgDeep: "#143657", glow: "#2E6A9E", accent: "#FFD66B", accentSoft: "#FFEDB3", text: "#F2F8FD", textSoft: "#D3E6F5", paper: "#F5FAFD", paper2: "#E2EFF8", ink: "#102A44", inkAccent: "#1F5A8C", inkMuted: "#3C556C", line: "#9CC3E2" },
  party:    { bg: "#4B1D6B", bgDeep: "#30104A", glow: "#6A2E94", accent: "#FFC93C", accentSoft: "#FFE7A0", text: "#FBF5FF", textSoft: "#E6D6F2", paper: "#FFFBF2", paper2: "#FCEFD9", ink: "#2A0E40", inkAccent: "#6A2E94", inkMuted: "#4F3A5E", line: "#E4B95A" },
  night:    { bg: "#151515", bgDeep: "#0A0A0A", glow: "#262626", accent: "#D8B26E", accentSoft: "#F2DDB0", text: "#F5F1EA", textSoft: "#D6CFC2", paper: "#F7F3EC", paper2: "#ECE4D6", ink: "#151515", inkAccent: "#6E5320", inkMuted: "#4A4438", line: "#C4A86E" },

  // Energetic, high-colour palettes
  sunset:   { bg: "#C0392B", bgDeep: "#7A1E12", glow: "#E0562E", accent: "#FFD166", accentSoft: "#FFE9A8", text: "#FFF3E8", textSoft: "#FAD9C2", paper: "#FFF6EE", paper2: "#FDE6D3", ink: "#5A1A0E", inkAccent: "#C0392B", inkMuted: "#7A4030", line: "#F0A878" },
  fiesta:   { bg: "#A21367", bgDeep: "#6E0B45", glow: "#C72C87", accent: "#FFC93C", accentSoft: "#FFE7A0", text: "#FFF0F7", textSoft: "#F6CFE4", paper: "#FFF5FA", paper2: "#FBE0EE", ink: "#5A0A38", inkAccent: "#A21367", inkMuted: "#7A3A5C", line: "#E79FC4" },
  tropical: { bg: "#0E7C7B", bgDeep: "#064E4D", glow: "#13A09E", accent: "#FF8C66", accentSoft: "#FFD0BE", text: "#EAFBFA", textSoft: "#BFE9E7", paper: "#F2FBFA", paper2: "#DBF0EE", ink: "#073B3A", inkAccent: "#0E7C7B", inkMuted: "#2E5A59", line: "#86C9C6" },
  grape:    { bg: "#6D28D9", bgDeep: "#4A1799", glow: "#8B44F0", accent: "#FDE047", accentSoft: "#FEF3A0", text: "#F5EEFF", textSoft: "#DBC9F5", paper: "#FAF6FF", paper2: "#EADDFB", ink: "#3B1177", inkAccent: "#6D28D9", inkMuted: "#4E3A6E", line: "#C4A5F0" },

  // Light "cream & gold" palettes (Canva-style). Here bg is light and text is dark.
  ivory:    { bg: "#F6ECD6", bgDeep: "#EADCBD", glow: "#E7D29E", accent: "#B07E2E", accentSoft: "#8A5E18", text: "#5A3A12", textSoft: "#7A5A2E", paper: "#FFFBF2", paper2: "#F4E7CC", ink: "#4A2E08", inkAccent: "#8A5A1A", inkMuted: "#7A5A30", line: "#CBA24E" },
  pearl:    { bg: "#F7F3F0", bgDeep: "#ECE4DE", glow: "#E6D8D0", accent: "#A9857B", accentSoft: "#8A6358", text: "#4A3B36", textSoft: "#6E5A52", paper: "#FFFDFB", paper2: "#F2EAE4", ink: "#3A2E2A", inkAccent: "#8A6358", inkMuted: "#6E5A52", line: "#CDB8AE" },
  redcream: { bg: "#FCEFE4", bgDeep: "#F5DFCF", glow: "#F8D9C7", accent: "#B0303A", accentSoft: "#D96B74", text: "#8A2230", textSoft: "#A85059", paper: "#FFF8F0", paper2: "#F8E4D5", ink: "#6E1822", inkAccent: "#B0303A", inkMuted: "#8A5A50", line: "#E0A9AE" }
};

/*
 * Invitation types. Each one sets defaults; anything in config.js wins.
 *   style:   "elegant" (classic serif + calligraphy) or "playful" (round, fun fonts)
 *   effects: moving things drawn over the page: petals, confetti, balloons, hearts, sparkles, bubbles
 *   decor:   things in the opening section: toran, bunting, bells, diyas, mandala
 *   emblem:  icon shown when there is no cover photo
 */
window.INVITE_TYPES = {
  wedding: {
    entrance: "rise",
    palette: "maroon", style: "elegant",
    effects: ["petals"], decor: ["toran", "bells", "mandala", "diyas"], emblem: "om",
    heading: "Shubh Vivah", gateTitle: "You are invited to the wedding of", joiner: "&"
  },
  engagement: {
    entrance: "zoom",
    palette: "rose", style: "elegant",
    effects: ["petals", "hearts"], decor: ["toran", "mandala"], emblem: "ring",
    heading: "Engagement Ceremony", gateTitle: "You are invited to the engagement of", joiner: "&"
  },
  reception: {
    entrance: "fade",
    palette: "royal", style: "elegant",
    effects: ["sparkles"], decor: ["mandala"], emblem: "glass",
    heading: "Wedding Reception", gateTitle: "You are invited to the reception of", joiner: "&"
  },
  anniversary: {
    entrance: "slide",
    palette: "royal", style: "elegant",
    effects: ["hearts", "sparkles"], decor: ["mandala"], emblem: "heart",
    heading: "Anniversary Celebration", gateTitle: "Join us in celebrating", joiner: "&"
  },
  birthday: {
    entrance: "drop",
    palette: "party", style: "playful",
    effects: ["confetti", "balloons"], decor: ["bunting"], emblem: "cake",
    heading: "Birthday Party", gateTitle: "You're invited to celebrate", joiner: "&"
  },
  housewarming: {
    entrance: "flip",
    palette: "emerald", style: "elegant",
    effects: ["petals"], decor: ["toran", "bells", "diyas"], emblem: "kalash",
    heading: "Griha Pravesh", gateTitle: "You are invited to the housewarming of", joiner: "&"
  },
  babyshower: {
    entrance: "zoom",
    palette: "blush", style: "playful",
    effects: ["bubbles", "hearts"], decor: ["bunting"], emblem: "rattle",
    heading: "Godh Bharai", gateTitle: "You're invited to the baby shower of", joiner: "&"
  },
  naming: {
    entrance: "fade",
    palette: "sky", style: "playful",
    effects: ["sparkles", "bubbles"], decor: ["bunting"], emblem: "moon",
    heading: "Naamkaran Ceremony", gateTitle: "You're invited to the naming ceremony of", joiner: "&"
  },
  mundan: {
    entrance: "slide",
    palette: "saffron", style: "elegant",
    effects: ["petals"], decor: ["toran", "bells", "diyas"], emblem: "om",
    heading: "Mundan Sanskar", gateTitle: "You are invited to the Mundan of", joiner: "&"
  },
  puja: {
    entrance: "flip",
    palette: "saffron", style: "elegant",
    effects: ["petals", "sparkles"], decor: ["toran", "bells", "diyas", "mandala"], emblem: "diya",
    heading: "Puja & Prasad", gateTitle: "You are invited to", joiner: "&"
  },
  party: {
    entrance: "drop",
    palette: "night", style: "elegant",
    effects: ["sparkles", "confetti"], decor: [], emblem: "sparkle",
    heading: "Celebration", gateTitle: "You're invited", joiner: "&"
  }
};
