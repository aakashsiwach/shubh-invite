/* Red & Pink Traditional — cream background, pink arch, Ganesha, red script
   names and an illustrated couple (assets/couple.svg) with florals. */
window.INVITE = {
  type: "wedding",
  palette: "redcream",
  style: "elegant",
  effects: ["petals"],
  decor: ["arch", "florals"],

  topLine:   "॥ श्री गणेशाय नमः ॥",
  heroLabel: "Together with their families",
  names:     ["Aarti Singh", "Rohit Verma"],
  joiner:    "&",
  heading:   "Shubh Vivah",

  date:     "2027-12-20T19:00",
  timezone: "+05:30",
  place:    "Jaipur",

  /* a real couple photo in the arch frame (replace with your own).
     Demo photo from Pexels (free license, no attribution required). */
  photos: { cover: "assets/couple-photo.jpg", gallery: "none" },
  music: "none",

  shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
  invitation: {
    hosts:   "Mr. & Mrs. Singh",
    message: "request the pleasure of your company at the wedding of their beloved daughter",
    after:   "son of Mr. & Mrs. Verma, Jaipur"
  },

  eventsTitle: "The Celebrations",
  events: [
    { title: "Haldi",   date: "Thu, 18 Dec", time: "11:00 AM", venue: "Singh Residence", note: "Dress code: Yellow" },
    { title: "Mehendi", date: "Fri, 19 Dec", time: "4:00 PM",  venue: "Singh Residence", note: "Dress code: Pink" },
    { title: "Pheras",  date: "Sat, 20 Dec", time: "7:00 PM",  venue: "Rajputana Palace", note: "Shubh muhurat 8:45 PM" }
  ],

  venue: { name: "Rajputana Palace", address: "Amer Road, Jaipur, Rajasthan", mapLink: "" },
  rsvp: { whatsapp: "919876543210", by: "10th December 2027" },
  footer: "Your presence and blessings are our greatest gift",
  compliments: "Singh & Verma Families"
};
