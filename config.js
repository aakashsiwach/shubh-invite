/* =====================================================================
   ✏️  EDIT THIS FILE — this is the only file you need to change.

   Rules (so nothing breaks):
   • Keep the "quotes" around text.
   • Keep the comma , at the end of each line.
   • To hide something, make it empty:  ""
   • Lines starting with // are notes and are ignored.

   Photos & music are found automatically — just put files in folders:
     photos/cover.jpg          → the main photo at the top (optional)
     photos/gallery/1.jpg, 2.jpg, 3.jpg …  → photo gallery (optional)
     music/song.mp3            → background music (optional)
   No photos? No problem — a beautiful design is shown instead.
   ===================================================================== */

window.INVITE = {

  /* ---- 1. What kind of invitation? ----------------------------------
     wedding · engagement · reception · anniversary · birthday ·
     housewarming · babyshower · naming · mundan · puja · party        */
  type: "wedding",

  /* Optional colour change. Leave "" for the type's default.
     maroon · rose · royal · emerald · saffron · blush · sky · party · night */
  palette: "",

  /* ---- 2. Top of the page ------------------------------------------ */
  topLine:   "॥ श्री गणेशाय नमः ॥",            // small line at the very top ("" to hide)
  heroLabel: "Together with their families",   // small line above the names
  names:     ["Ananya", "Arjun"],               // one name ["Aarav"] or two names
  joiner:    "&",                               // word between the two names
  heading:   "Shubh Vivah",                     // big title under the names

  /* ---- 3. Main date & place ----------------------------------------
     date format: "YYYY-MM-DDTHH:MM" (24-hour). Used for the countdown
     and the "Add to calendar" buttons. Time is optional: "2027-02-14"  */
  date:     "2027-02-14T19:30",
  timezone: "+05:30",            // India = +05:30
  place:    "Jaipur",
  // dateText: "Sunday, 14th February 2027",   // remove the // to write the date your own way

  /* ---- 4. The invitation message ------------------------------------ */
  shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",   // \n = new line
  invitation: {
    hosts:   "Mrs. & Mr. Rajesh Sharma",
    message: "joyfully invite you and your family to grace the wedding of their beloved daughter",
    after:   "son of Mrs. & Mr. Vikram Mehta, New Delhi",   // line after the names
    joinWord: "with"                                        // word between names here
  },

  /* ---- 5. Events (add or remove blocks freely) ----------------------
     icon is optional — it's guessed from the title. You can also pick:
     sun leaf music fire horse glass ring cake diya home kalash rattle
     moon star heart sparkle food camera                                */
  eventsTitle: "The Celebrations",
  events: [
    { title: "Haldi",   date: "Fri, 12 Feb", time: "10:00 AM", venue: "Sharma Residence", note: "Dress code: Yellow" },
    { title: "Mehendi", date: "Fri, 12 Feb", time: "4:00 PM",  venue: "Sharma Residence", note: "Dress code: Green" },
    { title: "Sangeet", date: "Sat, 13 Feb", time: "7:00 PM",  venue: "The Grand Lawn",   note: "Get ready to dance!" },
    { title: "Baraat & Pheras", date: "Sun, 14 Feb", time: "7:30 PM", venue: "The Grand Lawn", note: "Shubh muhurat 9:15 PM" }
  ],

  /* ---- 6. Venue ------------------------------------------------------
     mapLink: paste a Google Maps "Share" link. If empty, we search the address. */
  venue: {
    name:    "The Grand Lawn",
    address: "Tonk Road, Jaipur, Rajasthan",
    mapLink: ""
  },

  /* ---- 7. Photos (optional) — see the photos folder ---------------- */
  photos: {
    cover:   "auto",      // "auto" = use photos/cover.jpg if it exists · "none" = never
    gallery: "auto",      // "auto" = use photos/gallery/1.jpg, 2.jpg … · "none" = never
    galleryTitle: "Moments"
  },

  /* ---- 8. Music (optional) ------------------------------------------
     "auto" = play music/song.mp3 if it exists · "none" = no music      */
  music: "auto",

  /* ---- 9. RSVP on WhatsApp ------------------------------------------
     Your WhatsApp number with country code, no + or spaces.
     Leave "" to hide the RSVP form.                                    */
  rsvp: {
    whatsapp: "919876543210",
    by: "1st February 2027"
  },

  /* ---- 10. Bottom of the page --------------------------------------- */
  footer:      "Your presence and blessings are our greatest gift",
  compliments: "Sharma & Mehta Families",
  contacts: [
    { name: "Rohit Sharma", phone: "+91 98765 43210" }
  ],

  /* ---- 11. Opening screen (doors that open with a tap) --------------
     Personal touch: share your link as  …/?to=Gupta Family
     and the guest sees "Dear Gupta Family," on the opening screen.     */
  gate: {
    button: "Open Invitation"
  }
  // gate: false,   // ← use this instead to skip the opening screen

  /* ---- Extra options (advanced, all optional) ------------------------
  effects: ["petals"],                  // petals confetti balloons hearts sparkles bubbles — [] for none
  decor:   ["toran","bells","mandala","diyas"],   // toran bunting bells mandala diyas
  emblem:  "om",                        // icon shown when there's no cover photo
  style:   "elegant",                   // elegant or playful
  countdown: false,                     // hide the countdown
  countdownTitle: "Counting down the days",
  pageTitle: "Ananya weds Arjun",       // browser tab title
  footerTop: "॥ शुभ विवाह ॥",
  language: "hi"                        // if most of your text is Hindi
  ------------------------------------------------------------------- */
};
