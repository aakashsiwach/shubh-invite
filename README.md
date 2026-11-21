# 🪔 Shubh Nimantran

**Beautiful, animated invitation websites for Indian occasions. No coding needed.**

Edit one file, drop your photos into a folder, and your invitation is online with a link you can share on WhatsApp.

👉 **Live demo:** https://aakashsiwach.github.io/shubh-invite/ opens a gallery of every design. Tap one to open the full animated invitation.

<p align="center">
  <img src="docs/wedding-gate.jpg" width="230" alt="Opening screen with doors">
  <img src="docs/wedding-hero.jpg" width="230" alt="Wedding invitation without photo">
  <img src="docs/with-photo.jpg" width="230" alt="Wedding invitation with a cover photo">
  <img src="docs/birthday.jpg" width="230" alt="Birthday invitation">
</p>

## 🛠️ Build it in your browser (no code) — `builder.html`

Open **`builder.html`** (linked from the home page as **“Create your invitation”**) to make an invitation **without touching `config.js`**:

1. **Set a local PIN** (phone/email + PIN). Your drafts are saved in *this browser*.
2. **Pick an occasion** — Marriage, Birthday, Party, Pooja, Baby & Kids, Housewarming or Custom.
3. **Add sub-invitations** to the set — e.g. Sagai, Haldi, Mehndi, Sangeet, Shaadi, Reception. Each gets its own design and form.
4. **Fill the form** (headings, the two sides with parents & address, date, venue + map link, programme, phones, timings). Rows reorder with ▲▼, so the **position is yours to manage**. A **live preview** updates as you type.
5. **Share a link:**
   - **Copy this link** — shares the one invitation you're editing.
   - **Who gets what** — make a *set* (only Sagai · Sagai + Shaadi · all) and copy one **grouped link** for those guests. It opens `group.html`, a chooser of just that set.

Everything is packed **into the link itself** (`#i=…` / `#g=…`), so sharing needs **no server** — it still hosts free on GitHub Pages. (This is the free **Phase 1**. Personalised per-guest links and reminders are planned for Phase 2.)

> Photos/music in the builder are added as **URLs** (paste a link to the image/MP3). The `photos/` and `music/` folders are used by the classic `config.js` flow below.

---

## ✨ What you get

- **11 invitation types:** Wedding, Engagement (Sagai), Reception, Anniversary, Birthday, Griha Pravesh, Godh Bharai, Naamkaran, Mundan, Puja / Katha, and Party
- **Works with or without photos.** Add photos and they appear automatically. Without photos you get a decorated design.
- **Animations:** falling marigold petals, a swaying toran, ringing temple bells, flickering diyas, a rotating mandala, confetti, balloons, hearts and sparkles
- **Opening doors.** Guests tap "Open Invitation" and the doors swing open.
- **Personal greeting.** Send `…/?to=Gupta Family` and the guest sees *"Dear Gupta Family,"*
- **Live countdown** to the big day
- **Event schedule** (Haldi, Mehendi, Sangeet…) with icons
- **Photo gallery** with a full-screen viewer that you can swipe on phones
- **Venue** with a Google Maps "Get directions" button
- **Add to calendar** (Google Calendar or the phone's calendar)
- **RSVP on WhatsApp.** Replies come straight to your WhatsApp. No server is needed.
- **Background music** (optional)
- Works on phones and computers, supports Hindi text, and is free to host on GitHub Pages

---

## 🚀 Make your invitation in 5 steps

### 1. Get your own copy
Click the green **Use this template** button, then **Create a new repository**. Give it a name, e.g. `sharma-wedding`.

> No button? Click **Fork** instead, or use **Code → Download ZIP** to work on your computer.

### 2. Fill in your details
Open **`config.js`** and click the ✏️ pencil icon. Change the text inside the "quotes": names, date, events, venue and your WhatsApp number. Then click **Commit changes**.

```js
type: "wedding",                 // wedding, birthday, housewarming, babyshower …
names: ["Ananya", "Arjun"],      // one or two names
date: "2027-02-14T19:30",        // YYYY-MM-DDTHH:MM (24-hour)
place: "Jaipur",
```

> ⚠️ Keep the quotes `" "` and the commas `,` at the end of lines. If the page shows **"Almost there!"**, a comma or quote is missing. The message tells you which line to check.

### 3. Add photos (optional)
Open the **`photos`** folder, then **Add file → Upload files**:

| File name | Where it shows |
|---|---|
| `photos/cover.jpg` | Main photo at the top, in a gold arch frame |
| `photos/gallery/1.jpg`, `2.jpg`, `3.jpg` … | Photo gallery |

- Number the gallery photos **1, 2, 3 … with no gaps**. The page stops looking when a number is missing.
- `.jpg`, `.jpeg`, `.png` and `.webp` all work.
- **No photos?** Skip this step. The page shows a decorated design instead.
- Keep each photo under ~500 KB so the page loads fast. You can shrink photos for free at [squoosh.app](https://squoosh.app).

### 4. Add music (optional)
Upload an MP3 as **`music/song.mp3`**. Phones only play music after a tap, so it starts when the guest taps **Open Invitation**. A 🔊 button lets guests turn it off.

### 5. Put it online (free)
Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then pick **`main`** and **`/ (root)`** and click **Save**.

After 1–2 minutes your invitation is live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

Every time you change `config.js` or add photos, the site updates by itself within a minute or two.

### What opens at your link?
By default the main link opens a **gallery of all designs**, and your own invitation is at **`…/invite.html`**. To open your invitation straight away at the main link, set this at the top of `config.js`:

```js
home: "invitation",
```

---

## 💌 Sharing tips

- **Personal links:** add `?to=` and the guest's name. Use `%20` for spaces:
  `https://you.github.io/sharma-wedding/invite.html?to=Gupta%20Family` shows *Dear Gupta Family,*
- **Nice WhatsApp preview:** in `invite.html`, edit the `og:title`, `og:description` and `og:image` lines near the top. `og:image` must be a full link, e.g. `https://you.github.io/sharma-wedding/photos/cover.jpg`.
- **Privacy:** on a free GitHub account, Pages sites are public. Anyone with the link can see the page. Don't put home addresses or phone numbers there if you're not comfortable sharing them.

---

## 🎨 Invitation types

Set `type` in `config.js`. Each type sets its colours, animations, decorations and default heading. You can still change any of them.

| `type` | Default heading | Look & animations |
|---|---|---|
| `wedding` | Shubh Vivah | Maroon & gold · petals, toran, bells, diyas, mandala |
| `engagement` | Engagement Ceremony | Rose & gold · petals, hearts |
| `reception` | Wedding Reception | Royal blue & gold · sparkles |
| `anniversary` | Anniversary Celebration | Royal blue · hearts, sparkles |
| `birthday` | Birthday Party | Purple · confetti, balloons, bunting |
| `housewarming` | Griha Pravesh | Emerald & gold · petals, toran, diyas |
| `babyshower` | Godh Bharai | Blush pink · bubbles, hearts, bunting |
| `naming` | Naamkaran Ceremony | Sky blue · sparkles, bubbles |
| `mundan` | Mundan Sanskar | Saffron · petals, toran, diyas |
| `puja` | Puja & Prasad | Saffron · petals, sparkles, diyas, mandala |
| `party` | Celebration | Black & gold · sparkles, confetti |

**Preview any type:** open the gallery (your main link) and tap a design, or go directly to `…/invite.html?example=birthday`. The sample files are in the [`examples`](examples) folder. Copy one into `config.js` to start from it.

### Change colours
Set `palette` to one of: `maroon`, `rose`, `royal`, `emerald`, `saffron`, `blush`, `sky`, `party`, `night`, the energetic `sunset`, `fiesta`, `tropical`, `grape`, or the light cream/pastel `ivory` and `pearl`.

### Design elements (Canva-style)
The builder's **Design & layout** section (and these config keys) let you add:
```js
emblem: "ganesh",            // ganesh · om · diya · ring · kalash · heart · star
decor:  ["arch", "florals"], // "arch" = temple/mehrab frame · "florals" = rose & leaf corners
palette: "ivory",            // a light cream & gold background (or "pearl" for soft pastel)
```
Ready-made themes **Cream & Gold**, **Royal Arch**, **Pastel Minimal**, **Floral**, **Festive**, **Botanical** and **Royal** combine these into one-tap looks, available for every occasion so a whole set stays consistent.

### Language, map link, calendar & compact layout
```js
lang:    "hi",          // "en" (English) or "hi" (Hindi) — translates the fixed text
map:     "none",        // hide the "View location on Google Maps" link (default: shown)
density: "comfortable", // more spacing (default is compact = less scrolling)
```
Pick **English or हिन्दी** in the builder (Design & layout). All the fixed text — countdown, venue, RSVP, calendar and buttons — switches language, and default headings/opening titles get Hindi versions. Every invitation also has a **one-tap language toggle** in the corner so guests can switch. Pages are **compact by default** to reduce scrolling.
The venue section shows an eye-catching **map link** with a location pin that opens the venue in Google Maps — it uses the `venue.mapLink` you paste (which points to the exact place) or searches the venue name + address. The **Save the Date** block offers *Add to Google Calendar* and *Add to phone calendar* so guests can set a reminder.

### Change the animations
```js
effects: ["petals", "sparkles"],   // petals confetti balloons hearts sparkles bubbles  ([] = none)
decor:   ["toran", "diyas"],       // toran bunting bells mandala diyas
style:   "playful",                // "elegant" (calligraphy) or "playful" (round & fun)
gate:    false,                    // skip the opening doors
```

Guests whose phones are set to *Reduce motion* automatically see a version without animations.

---

## 🧪 Try it on your computer

Download the ZIP, unzip it, and **double-click `index.html`** (the gallery) or **`invite.html`** (your invitation). They open in your browser. Nothing to install.

## 📁 What's inside

```
index.html          ← home page: gallery of all designs
builder.html        ← no-code builder: create invitation sets & share links
group.html          ← opens a shared grouped link (a set of invitations)
invite.html         ← your invitation (edit only the preview tags at the top)
config.js           ← ✏️ YOUR DETAILS — edit this
photos/cover.jpg    ← optional main photo
photos/gallery/     ← optional 1.jpg, 2.jpg, 3.jpg …
music/song.mp3      ← optional background music
examples/           ← sample settings for every type
assets/             ← design & code (no need to touch)
```

## ❓ Problems?

| Problem | Fix |
|---|---|
| Page says **"Almost there!"** | A comma or quote is missing in `config.js`. Check the line you changed last. |
| Photos don't show | Check the names: `cover.jpg` and `gallery/1.jpg`. GitHub treats `Cover.JPG` and `cover.jpg` as different names. Number gallery photos with no gaps. |
| Link shows 404 | Wait 2 minutes after turning on Pages, and check that **Settings → Pages** says *Your site is live*. |
| Countdown is missing | The date must be in the future and in the format `"2027-02-14T19:30"`. |
| RSVP form is missing | Add your WhatsApp number in `rsvp.whatsapp` (country code, digits only, e.g. `"919876543210"`). |

---

Made with ❤️ for Indian celebrations. Free to use under the [MIT License](LICENSE). Fonts from Google Fonts (Open Font License).

**Credits:** the demo couple photo (`assets/couple-photo.jpg`) is from [Pexels](https://www.pexels.com/) under the free Pexels License (no attribution required) — it's only a placeholder; add your own photo via `photos/cover.jpg` or the builder's cover field. An alternate hand-drawn illustration is in `assets/couple.svg`.
