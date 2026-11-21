/* Original Shubh Nimantran template catalogue. All presets are authored for this project. */
(function () {
  "use strict";
  var items = [];
  function add(category, type, rows) {
    rows.forEach(function (r, i) {
      var palette = r[1], style = /party|birthday|baby|fiesta|tropical|grape|sky|blush/i.test(palette) ? "playful" : "elegant";
      var decor = r[3] || (style === "playful" ? ["bunting"] : ["arch", "florals"]);
      var effects = r[4] || (style === "playful" ? ["sparkles", "confetti"] : ["petals", "sparkles"]);
      items.push({
        id: category + "-" + String(i + 1).padStart(2, "0"),
        name: r[0], category: category, type: type,
        description: r[5] || "An original " + r[0].toLowerCase() + " invitation design.",
        config: { type: type, palette: palette, style: style, effects: effects, decor: decor, emblem: r[2] || "sparkle" }
      });
    });
  }

  add("wedding", "wedding", [
    ["Royal Maroon Mandap","maroon","ganesh"],["Ivory Palace Arch","ivory","ganesh"],["Emerald Heritage","emerald","kalash"],["Rose Petal Vows","rose","ring"],["Midnight Gold","night","sparkle"],["Saffron Sacred","saffron","diya"],["Royal Blue Grandeur","royal","glass"],["Blush Garden Wedding","blush","heart"],["Sunset Shehnai","sunset","om"],["Pearl Minimal Vows","pearl","ring"],
    ["Red Gulab Celebration","redcream","ganesh"],["Botanical Mehfil","emerald","leaf"],["Golden Jharokha","ivory","kalash"],["Lotus Garden","rose","flower"],["Indigo Heirloom","royal","mandala"],["Marigold Courtyard","saffron","sun"],["Plum Velvet","grape","sparkle"],["Desert Dusk","sunset","sun"],["Classic Toran","maroon","om"],["Champagne Elegance","ivory","ring"],
    ["South Indian Temple","saffron","diya",["toran","bells","diyas","mandala"],["petals"]],["Punjabi Phulkari","fiesta","flower"],["Bengali Shubho Drishti","redcream","lotus"],["Gujarati Bandhani","sunset","mandala"],["Rajasthani Royal","maroon","kalash"],["Kashmiri Chinar","emerald","leaf"],["Coastal Pastel","tropical","shell"],["Mughal Garden","emerald","flower"],["Modern Monogram","night","star",[],["sparkles"]],["Floral Watercolour","pearl","flower",["florals"],["petals","hearts"]],
    ["Vintage Postcard","ivory","mail",["florals"],["sparkles"]],["Art Deco Gold","night","star",["mandala"],["sparkles"]],["Terracotta Folk","saffron","sun"],["Sage & Champagne","emerald","leaf"],["Lavender Romance","grape","heart"],["Coral Celebration","fiesta","flower"],["Minimal Line Art","pearl","ring",[],[]],["Grand Palace","royal","crown"],["Lotus & Gold","ivory","lotus"],["Festive Firelight","sunset","diya"]
  ]);
  add("engagement", "engagement", [
    ["Rose Ring Ceremony","rose","ring"],["Blush Promise","blush","heart"],["Royal Sagai","maroon","ring"],["Champagne Proposal","ivory","ring"],["Midnight Spark","night","sparkle"],["Lavender Promise","grape","heart"],["Garden Engagement","emerald","flower"],["Sunset Roka","sunset","sun"],["Pearl Minimal Sagai","pearl","ring",[],[]],["Fiesta Celebration","fiesta","heart"]
  ]);
  add("anniversary", "anniversary", [
    ["Golden Anniversary","ivory","heart"],["Ruby Years","redcream","heart"],["Silver Elegance","pearl","star"],["Midnight Romance","night","heart"],["Rose Garden Years","rose","flower"],["Evergreen Together","emerald","leaf"]
  ]);
  add("birthday", "birthday", [
    ["Confetti Carnival","party","cake"],["Pastel Balloon Pop","blush","balloon"],["Neon Night Party","grape","star"],["Tropical Birthday","tropical","sun"],["Rainbow Sprinkle","fiesta","cake"],["Sky Balloon Parade","sky","balloon"],["Golden Milestone","night","star"],["Cute Candy Party","sunset","cake"],["Dinosaur Adventure","emerald","leaf"],["Princess Garden","rose","crown"]
  ]);
  add("baby", "babyshower", [
    ["Little Star Baby Shower","sky","star"],["Blush Godh Bharai","blush","heart"],["Sage Baby Blessings","emerald","leaf"],["Moon & Clouds","pearl","moon"],["Golden Cradle","ivory","rattle"],["Pastel Teddy","tropical","bear"],["Pink Petal Celebration","rose","flower"],["Blue Balloon Welcome","sky","balloon"]
  ]);
  add("house", "housewarming", [
    ["Auspicious Griha Pravesh","saffron","kalash"],["Emerald New Beginnings","emerald","leaf"],["Ivory Home Blessing","ivory","om"],["Maroon Toran Welcome","maroon","ganesh"],["Sunrise Homecoming","sunset","sun"],["Minimal New Home","pearl","house",[],[]]
  ]);
  add("puja", "puja", [
    ["Satyanarayan Katha","saffron","diya"],["Ganesh Puja","maroon","ganesh"],["Lakshmi Pujan","ivory","lotus"],["Havan & Blessings","sunset","fire"],["Temple Bells","emerald","kalash"],["Bhajan Sandhya","royal","om"]
  ]);
  add("festival", "puja", [
    ["Diwali Deepotsav","saffron","diya"],["Holi Rangotsav","fiesta","flower"],["Navratri Garba","sunset","mandala"],["Janmashtami Celebration","royal","flute"],["Ganesh Chaturthi","maroon","ganesh"],["Eid Mubarak Gathering","emerald","crescent"]
  ]);
  add("party", "party", [
    ["Midnight Cocktail Party","night","glass"],["Retro Disco Night","grape","star"],["Summer Pool Party","tropical","sun"],["Garden Dinner","emerald","leaf"],["Festive Get Together","sunset","sparkle"],["Elegant Dinner Invite","ivory","glass"],["Neon Music Night","fiesta","music"],["Casual Weekend Bash","sky","confetti"]
  ]);

  window.SHUBH_TEMPLATES = items;
  window.SHUBH_TEMPLATE_CATEGORIES = [
    {id:"all",label:"All templates"},{id:"wedding",label:"Wedding"},{id:"engagement",label:"Engagement"},
    {id:"anniversary",label:"Anniversary"},{id:"birthday",label:"Birthday"},{id:"baby",label:"Baby & Kids"},
    {id:"house",label:"Housewarming"},{id:"puja",label:"Puja"},{id:"festival",label:"Festivals"},{id:"party",label:"Parties"}
  ];
})();