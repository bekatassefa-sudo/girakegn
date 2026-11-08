/* =====================================================================
   GERA KEGN — content loader
   ---------------------------------------------------------------------
   Content lives in /content/*.json and is edited through the CMS at
   /admin (Decap CMS). This file loads it, builds window.GK, then starts
   the site scripts. Don't edit content here.
   ===================================================================== */
(() => {
  const FILES = ["site", "series", "campaign", "credits", "film", "news", "faq", "merch"];
  const SCRIPTS = ["assets/js/core.js", "assets/js/components.js"];

  // Start downloading the site scripts now, alongside the content, instead of one after
  // another (each trip to the server costs a few hundred ms on mobile). They still run in order.
  SCRIPTS.forEach((src) => {
    const l = document.createElement("link");
    l.rel = "preload"; l.as = "script"; l.href = src;
    document.head.append(l);
  });

  const load = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = rej;
    document.body.append(s);
  });

  // Fetch one content file, retrying twice on a dropped connection (patchy mobile data).
  const getJSON = (f, tries = 3) => fetch(`content/${f}.json`, { cache: "no-cache" })
    .then((r) => {
      if (!r.ok) throw new Error(`content/${f}.json → ${r.status}`);
      return r.json();
    })
    .catch((err) => (tries > 1
      ? new Promise((res) => setTimeout(res, 400)).then(() => getJSON(f, tries - 1))
      : Promise.reject(err)));

  Promise.all(FILES.map((f) => getJSON(f)))
    .then((parts) => {
      const GK = Object.assign({}, ...parts);
      // Normalise CMS shapes for the site scripts.
      GK.guadEntries = (GK.guadNames || []).map((n) => (typeof n === "string" ? { name: n } : n)).filter((n) => n.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      GK.guadNames = GK.guadEntries.map((n) => n.name);
      GK.news = (GK.news || []).filter((n) => n.published !== false)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
      GK.newsCategories = {
        all: { en: "All", am: "ሁሉም" }, news: { en: "News", am: "ዜና" }, bts: { en: "Behind the scenes", am: "ከትዕይንት ጀርባ" },
        milestone: { en: "Milestones", am: "ምዕራፎች" }, announcement: { en: "Announcements", am: "ማስታወቂያዎች" },
        photos: { en: "Photos", am: "ፎቶዎች" }, video: { en: "Videos", am: "ቪዲዮዎች" }, campaign: { en: "Campaign", am: "ዘመቻ" }
      };
      window.GK = GK;
    })
    .then(() => SCRIPTS.reduce((p, src) => p.then(() => load(src)), Promise.resolve()))
    .catch((err) => {
      console.error("[GK] content failed to load", err);
      document.documentElement.classList.add("gk-error");
    });
})();
