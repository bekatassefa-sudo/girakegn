/* =====================================================================
   GERA KEGN — content loader
   ---------------------------------------------------------------------
   Content lives in /content/*.json and is edited through the CMS at
   /admin (Decap CMS). This file loads it, builds window.GK, then starts
   the site scripts. Don't edit content here.
   ===================================================================== */
(() => {
  const FILES = ["site", "series", "campaign", "credits", "film", "news", "faq"];
  const SCRIPTS = ["assets/js/core.js", "assets/js/components.js"];

  const load = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = rej;
    document.body.append(s);
  });

  Promise.all(FILES.map((f) => fetch(`content/${f}.json`, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(`content/${f}.json → ${r.status}`);
    return r.json();
  })))
    .then((parts) => {
      const GK = Object.assign({}, ...parts);
      // Normalise CMS shapes for the site scripts.
      GK.guadNames = (GK.guadNames || []).map((n) => (typeof n === "string" ? n : n.name)).filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
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
