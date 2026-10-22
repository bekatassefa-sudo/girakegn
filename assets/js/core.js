/* =====================================================================
   GERA KEGN — core: site shell, language, motion, forms, modals.
   Loaded on every page after content.js. Page components → components.js
   ===================================================================== */
(() => {
  const C = window.GK;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Pages ---------------- */
  const PAGES = [
    ["home", "index.html", { en: "Home", am: "መነሻ" }],
    ["story", "story.html", { en: "The Story", am: "ታሪኩ" }],
    ["movie", "movie.html", { en: "The Movie", am: "ፊልሙ" }],
    ["series", "series.html", { en: "The Series", am: "ተከታታዩ" }],
    ["why", "why-now.html", { en: "Why Now", am: "ለምን አሁን" }],
    ["producer", "become-a-producer.html", { en: "Become a Producer", am: "ፕሮዲዩሰር ይሁኑ" }],
    ["guad", "guad-producer.html", { en: "ጓድ Producer", am: "ጓድ ፕሮዲዩሰር" }],
    ["partners", "partners.html", { en: "Corporate Partners", am: "የድርጅት አጋሮች" }],
    ["diaspora", "diaspora.html", { en: "Diaspora", am: "ዲያስፖራ" }],
    ["transparency", "transparency.html", { en: "Transparency", am: "ግልጽነት" }],
    ["news", "news.html", { en: "Production Diary", am: "የቀረጻ ማስታወሻ" }],
    ["faq", "faq.html", { en: "FAQ", am: "ጥያቄዎች" }]
  ];
  const href = (id) => PAGES.find((p) => p[0] === id)[1];
  const current = document.body.dataset.page;
  // Review preview on GitHub Pages: not indexed, labelled, forms off. Switches off by itself on the real host.
  const PREVIEW = /\.github\.io$/i.test(location.hostname);

  /* ---------------- Shared UI strings ---------------- */
  const UI = {
    en: {
      skip: "Skip to content", menu: "Menu", close: "Close", back: "Become a ጓድ Producer", film: "The film",
      cd_d: "days", cd_h: "hours", cd_m: "min", cd_s: "sec",
      raised: "raised", goal: "goal", funded: "funded", backers: "backers", daysLeft: "days left", guads: "ጓድ Producers",
      pledge: "Pledge now", secure: "Local payments in birr · international cards for the diaspora",
      choose: "Choose", popular: "ጓድ level", qualifies: "Qualifies as ጓድ Producer",
      season: "Season", open: "Open file", closeFile: "Close file", closed: "CLOSED", sealed: "SEALED",
      more: "Read more →", voteBtn: "Vote", voted: "Voted ✓", planned: "Planned", confirmed: "Confirmed",
      soon: "Teaser · Coming soon", menuCampaign: "Campaign", follow: "Follow the case",
      foot_film: "The film", foot_support: "Get involved", foot_info: "Information", contact: "Contact", press: "Press",
      terms: "Producer terms", copy: "© Gera Kegn Film Production. All rights reserved.", made: "Website made by",
      news_sub: "Production updates, first ticket access and premiere news — in Amharic or English.",
      email: "Email address", sign: "Sign up", form_bad: "Please complete the highlighted fields.",
      form_ok: "Entered into the record. Thank you.", form_sending: "Sending…",
      pledge_head: "PLEDGE FORM · ቅጽ 01", pledge_title: "Put your name on the record", custom: "Or enter an amount",
      pay: "Choose how to pay", pledge_note: "You'll be taken to the secure page of your chosen payment provider. Payment integration is being finalised.",
      pending: "Payment link not yet connected — available at campaign launch.",
      slots: "slots", onRequest: "On request", enquire: "Enquire"
    },
    am: {
      skip: "ወደ ይዘቱ ይዝለሉ", menu: "ማውጫ", close: "ዝጋ", back: "ጓድ ፕሮዲዩሰር ይሁኑ", film: "ፊልሙ",
      cd_d: "ቀናት", cd_h: "ሰዓታት", cd_m: "ደቂቃ", cd_s: "ሰከንድ",
      raised: "ተሰብስቧል", goal: "ግብ", funded: "ተሳክቷል", backers: "ደጋፊዎች", daysLeft: "ቀናት ቀርተዋል", guads: "ጓድ ፕሮዲዩሰሮች",
      pledge: "አሁን ይደግፉ", secure: "በብር የሀገር ውስጥ ክፍያ · ለዲያስፖራ ዓለም አቀፍ ካርድ",
      choose: "ይምረጡ", popular: "የጓድ ደረጃ", qualifies: "ለጓድ ፕሮዲዩሰር ብቁ",
      season: "ምዕራፍ", open: "መዝገቡን ክፈት", closeFile: "መዝገቡን ዝጋ", closed: "ተዘግቷል", sealed: "የታሸገ",
      more: "ተጨማሪ ያንብቡ →", voteBtn: "ድምጽ", voted: "ሰጥተዋል ✓", planned: "የታቀደ", confirmed: "የተረጋገጠ",
      soon: "ቅድመ እይታ · በቅርቡ", menuCampaign: "ዘመቻው", follow: "ጉዳዩን ይከታተሉ",
      foot_film: "ፊልሙ", foot_support: "ይሳተፉ", foot_info: "መረጃ", contact: "ያግኙን", press: "ለጋዜጠኞች",
      terms: "የፕሮዲዩሰር ውል", copy: "© ግራ ቀኝ ፊልም ፕሮዳክሽን። መብቱ በሕግ የተጠበቀ ነው።", made: "ድረ ገጹን የሠራው",
      news_sub: "የቀረጻ መረጃዎች፣ የትኬት ቅድሚያ እና የፕሪሚየር ዜናዎች — በአማርኛ ወይም በእንግሊዝኛ።",
      email: "ኢሜይል አድራሻ", sign: "ይመዝገቡ", form_bad: "እባክዎ የተመለከቱትን ቦታዎች ይሙሉ።",
      form_ok: "በመዝገቡ ላይ ሰፍሯል። እናመሰግናለን።", form_sending: "በመላክ ላይ…",
      pledge_head: "የድጋፍ ቅጽ · FORM 01", pledge_title: "ስምዎን መዝገብ ላይ ያስፍሩ", custom: "ወይም መጠን ያስገቡ",
      pay: "የክፍያ መንገድ ይምረጡ", pledge_note: "ወደ መረጡት አቅራቢ ደህንነቱ የተጠበቀ የክፍያ ገጽ ይወሰዳሉ። የክፍያ ስርዓቱ በመጠናቀቅ ላይ ነው።",
      pending: "የክፍያ ማስፈንጠሪያ ገና አልተገናኘም — ዘመቻው ሲጀመር ይገኛል።",
      slots: "ቦታዎች", onRequest: "በጥያቄ", enquire: "ይጠይቁ"
    }
  };

  /* ---------------- Language ---------------- */
  const GKX = (window.GKX = {
    lang: store.get("gk-lang") === "am" ? "am" : "en",
    $, $$, store, reduced, PAGES, href, current
  });
  GKX.t = (k) => UI[GKX.lang][k] ?? UI.en[k] ?? k;
  GKX.L = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o[GKX.lang] ?? o.en : o);
  GKX.esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  GKX.fmt = (n) => new Intl.NumberFormat("en-US").format(Math.round(n));
  GKX.fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString(GKX.lang === "am" ? "am-ET" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const { t, L, esc } = GKX;

  /* Static page text: <h2 data-am="አማርኛ">English</h2>. Inner HTML is swapped. */
  function translateStatic() {
    $$("[data-am]").forEach((el) => {
      if (el._en == null) el._en = el.innerHTML;
      el.innerHTML = GKX.lang === "am" ? el.dataset.am : el._en;
    });
    $$("[data-am-ph]").forEach((el) => {
      if (el._enPh == null) el._enPh = el.placeholder;
      el.placeholder = GKX.lang === "am" ? el.dataset.amPh : el._enPh;
    });
    $$("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
  }

  /* ---------------- Shell: header, menu, footer, modals ---------------- */
  const NAV_INLINE = ["movie", "series", "producer", "diaspora", "news"];
  function shell() {
    const header = document.createElement("header");
    header.className = "nav";
    header.id = "nav";
    header.innerHTML = `
      <a href="${href("home")}" class="brand brand-swap" aria-label="Gera Kegn — home">
        <span class="brand-text"><span class="brand-am">ግራ ቀኝ</span><span class="brand-en">GERA KEGN</span></span>
        <img class="brand-badge" src="assets/img/campaign/brand-badge-96.webp"
             srcset="assets/img/campaign/brand-badge-96.webp 96w, assets/img/campaign/brand-badge-144.webp 144w"
             sizes="48px" width="48" height="48" alt="" aria-hidden="true" decoding="async">
        <svg class="brand-scales" viewBox="0 0 44 22" aria-hidden="true">
          <path d="M22 3v16M15 20.5h14"/>
          <g class="bs-beam"><path d="M5 5h34"/>
            <g class="bs-pan bs-l"><path d="M5 5 2 13M5 5l3 8" class="bs-thin"/><path d="M1 13q4 4 8 0z" class="bs-dish"/></g>
            <g class="bs-pan bs-r"><path d="M39 5l-3 8M39 5l3 8" class="bs-thin"/><path d="M35 13q4 4 8 0z" class="bs-dish"/></g>
          </g>
          <circle cx="22" cy="2.6" r="1.6" class="bs-cap"/>
        </svg>
      </a>
      <nav class="nav-links" aria-label="Main">
        ${NAV_INLINE.map((id) => `<a href="${href(id)}" data-nav="${id}" class="${id === current ? "active" : ""}"></a>`).join("")}
      </nav>
      <div class="nav-actions">
        <div class="lang" role="group" aria-label="Language">
          <button type="button" data-lang="en">EN</button><button type="button" data-lang="am" class="ethi">አማ</button>
        </div>
        <a href="${href("producer")}" class="btn btn-blue btn-sm nav-cta" data-t="back"></a>
        <button type="button" class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="menu">
          <span class="menu-btn-label" data-t="menu"></span><span class="menu-btn-icon"><i></i><i></i></span>
        </button>
      </div>`;
    document.body.prepend(header);

    const skip = document.createElement("a");
    skip.className = "skip"; skip.href = "#main"; skip.dataset.t = "skip";
    document.body.prepend(skip);

    const grain = document.createElement("div");
    grain.className = "grain"; grain.setAttribute("aria-hidden", "true");
    document.body.prepend(grain);

    const menu = document.createElement("div");
    menu.className = "menu"; menu.id = "menu"; menu.hidden = true;
    menu.innerHTML = `
      <div class="menu-bg" aria-hidden="true"><span>ግራ</span><span>ቀኝ</span></div>
      <nav class="menu-list" aria-label="All pages">
        ${PAGES.map(([id, url], i) => `
          <a href="${url}" class="menu-link ${id === current ? "active" : ""}" style="--i:${i}">
            <span class="menu-no">${String(i + 1).padStart(2, "0")}</span><span class="menu-label" data-nav="${id}"></span>
          </a>`).join("")}
      </nav>
      <aside class="menu-side">
        <p class="eyebrow" data-t="menuCampaign"></p>
        <div data-component="meter" data-compact></div>
        <p class="eyebrow" data-t="follow" style="margin-top:28px"></p>
        <div class="social-links" data-component="socials"></div>
      </aside>`;
    header.after(menu);

    const footer = document.createElement("footer");
    footer.className = "footer";
    const col = (ids) => ids.map((id) => `<a href="${href(id)}" data-nav="${id}"></a>`).join("");
    footer.innerHTML = `
      <div class="footer-drift drift" data-speed="-0.25" aria-hidden="true">ግራ ቀኝ · GERA KEGN · ግራ ቀኝ · GERA KEGN · ግራ ቀኝ</div>
      <div class="wrap footer-grid">
        <div class="footer-brand">
          <a href="${href("home")}" class="brand"><span class="brand-am">ግራ ቀኝ</span><span class="brand-en">GERA KEGN · THE MOVIE</span></a>
          <p class="muted tiny" data-t="news_sub"></p>
          <form class="mini-form" data-form="newsletter" name="newsletter" data-netlify="true" netlify-honeypot="bot-field" novalidate>
            <input type="hidden" name="form-name" value="newsletter"><p hidden><label>Leave empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
            <label class="sr" for="footEmail" data-t="email"></label>
            <input id="footEmail" type="email" name="email" required autocomplete="email" placeholder="your@email.com">
            <button class="btn btn-gold btn-sm" type="submit" data-t="sign"></button>
            <p class="form-msg" role="status"></p>
          </form>
          <div class="social-links" data-component="socials"></div>
        </div>
        <nav class="footer-col"><p class="eyebrow" data-t="foot_film"></p>${col(["story", "movie", "series", "why"])}</nav>
        <nav class="footer-col"><p class="eyebrow" data-t="foot_support"></p>${col(["producer", "guad", "partners", "diaspora"])}</nav>
        <nav class="footer-col"><p class="eyebrow" data-t="foot_info"></p>${col(["transparency", "news", "faq"])}
          <a href="faq.html#contact" data-t="contact"></a><a href="mailto:${C.site.email.press}" data-t="press"></a></nav>
      </div>
      <div class="wrap footer-bottom">
        <p class="tiny muted" data-t="copy"></p>
        <p class="tiny muted credit"><span data-t="made"></span> <a href="https://sealevelstudios.xyz/" target="_blank" rel="noopener">Sea Level Studios</a></p>
      </div>`;
    document.body.append(footer);

    const modals = document.createElement("div");
    modals.innerHTML = `
      <dialog class="modal" id="pledgeModal" aria-labelledby="pledgeTitle">
        <form method="dialog" class="modal-close-form"><button class="modal-x" aria-label="Close">×</button></form>
        <p class="typed eyebrow-dark" data-t="pledge_head"></p>
        <h3 id="pledgeTitle" class="h3" data-t="pledge_title"></h3>
        <div class="amount-picker" id="amountPicker"></div>
        <div class="custom-amount">
          <label for="customAmt" data-t="custom"></label>
          <div class="input-affix"><span id="curLabel">ETB</span><input id="customAmt" type="number" min="50" step="50" inputmode="numeric"></div>
          <div class="cur-toggle" role="group" aria-label="Currency">
            <button type="button" data-cur="ETB">ETB</button><button type="button" data-cur="USD">USD</button>
          </div>
        </div>
        <p class="label-sm" data-t="pay"></p>
        <div class="channels" id="channels"></div>
        <p class="tiny dark-muted" data-t="pledge_note"></p>
      </dialog>
      <dialog class="modal modal-video" id="videoModal" aria-label="Video">
        <form method="dialog" class="modal-close-form"><button class="modal-x light" aria-label="Close">×</button></form>
        <div class="video-frame" id="videoFrame"></div>
      </dialog>`;
    document.body.append(...modals.children);
  }

  function translateShell() {
    $$("[data-nav]").forEach((el) => { el.textContent = L(PAGES.find((p) => p[0] === el.dataset.nav)[2]); });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === GKX.lang));
  }

  /* ---------------- Menu ---------------- */
  function initMenu() {
    const btn = $("#menuBtn"), menu = $("#menu");
    const set = (open) => {
      btn.setAttribute("aria-expanded", open);
      document.documentElement.classList.toggle("menu-open", open);
      if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add("open")); }
      else { menu.classList.remove("open"); setTimeout(() => { if (!menu.classList.contains("open")) menu.hidden = true; }, reduced ? 0 : 600); }
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    addEventListener("keydown", (e) => { if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { set(false); btn.focus(); } });
  }

  /* ---------------- Motion ---------------- */
  // Split text into masked words that slide up one after another.
  function splitWords(el) {
    // Translated elements were just reset by translateStatic; others keep their original markup.
    if (!el.hasAttribute("data-am")) { if (el._raw == null) el._raw = el.innerHTML; el.innerHTML = el._raw; }
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const w = document.createElement("span");
            w.className = "w";
            w.innerHTML = `<span style="--wi:${i++}">${esc(part)}</span>`;
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  }

  let io;
  function scanMotion() {
    if (!io) {
      io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    }
    $$("[data-stagger]").forEach((group) => {
      const alt = group.dataset.stagger === "alt";
      [...group.children].forEach((child, i) => {
        if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", alt ? (i % 2 ? "right" : "left") : "up");
        child.style.setProperty("--i", i % 8);
      });
    });
    $$('[data-reveal="words"]').forEach((el) => { if (!el._split || el._splitLang !== GKX.lang) { splitWords(el); el._split = true; el._splitLang = GKX.lang; } });
    $$("[data-reveal]:not(.is-in)").forEach((el) => {
      if (reduced) { el.classList.add("is-in"); return; }
      io.observe(el);
    });
  }
  GKX.scanMotion = scanMotion;

  // Scroll-linked horizontal drift (giant type sliding left/right).
  function initDrift() {
    if (reduced) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      $$(".drift").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = `translate3d(${p * 100 * parseFloat(el.dataset.speed || 0.3) * 4}vw,0,0)`;
      });
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Page-to-page curtain wipe (enter animation is pure CSS on body::before/after).
  function initCurtain() {
    if (reduced) return;
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname) return; // same-page anchors scroll normally
      e.preventDefault();
      document.documentElement.classList.add("is-leaving");
      setTimeout(() => { location.href = url.href; }, 520);
    });
    addEventListener("pageshow", (e) => { if (e.persisted) document.documentElement.classList.remove("is-leaving"); });
  }

  function initNavScroll() {
    const nav = $("#nav");
    const on = () => nav.classList.toggle("scrolled", scrollY > 30);
    addEventListener("scroll", on, { passive: true }); on();
  }

  /* ---------------- Forms ---------------- */
  function initForms() {
    document.addEventListener("submit", async (e) => {
      const form = e.target.closest("form[data-form]");
      if (!form) return;
      e.preventDefault();
      const msg = $(".form-msg", form);
      let ok = true;
      $$("input, select, textarea", form).forEach((f) => {
        let bad = f.required && (f.type === "checkbox" ? !f.checked : !f.value.trim());
        if (!bad && f.type === "email" && f.value) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim());
        f.classList.toggle("invalid", bad);
        f.setAttribute("aria-invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) { msg.className = "form-msg err"; msg.textContent = t("form_bad"); $(".invalid", form)?.focus(); return; }
      if (PREVIEW) { msg.className = "form-msg err"; msg.textContent = GKX.lang === "am" ? "በዚህ የግምገማ ቅድመ እይታ ቅጾች አይላኩም።" : "Forms are switched off in this review preview."; return; }
      const data = Object.fromEntries(new FormData(form));
      data.form = form.dataset.form; data.lang = GKX.lang; data.page = current;
      const btn = $('[type="submit"]', form);
      btn.disabled = true;
      msg.className = "form-msg"; msg.textContent = t("form_sending");
      try {
        const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
        let res;
        if (form.dataset.endpoint) {
          // Custom endpoint (Formspree, Mailchimp, CMS webhook…)
          res = await fetch(form.dataset.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        } else if (form.hasAttribute("data-netlify") && !local) {
          // Netlify Forms: lands in the private Forms inbox with spam filtering.
          res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });
        } else await new Promise((r) => setTimeout(r, 500)); // local preview: simulate
        if (res && !res.ok) throw new Error(res.status);
        track("form_submit", { form: data.form });
        msg.className = "form-msg ok";
        msg.textContent = (GKX.lang === "am" ? form.dataset.okAm : form.dataset.ok) || t("form_ok");
        form.reset();
        form.dispatchEvent(new Event("input"));
      } catch {
        msg.className = "form-msg err"; msg.textContent = "Network error — please try again.";
      } finally { btn.disabled = false; }
    });
    document.addEventListener("input", (e) => {
      if (e.target.classList?.contains("invalid") && e.target.value) e.target.classList.remove("invalid");
    });
  }

  /* ---------------- Analytics hook ---------------- */
  // Pushes to GA4 / GTM if present; otherwise a no-op. Paste the tag in <head>.
  function track(name, params = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  }
  GKX.track = track;

  /* ---------------- Pledge modal ---------------- */
  const featuredTier = () => Math.max(0, C.crowdfunding.tiers.findIndex((t) => t.featured));
  const pledge = { tier: featuredTier(), cur: "ETB" };
  function renderPledge() {
    const f = C.crowdfunding;
    $("#amountPicker").innerHTML = f.tiers.map((tier, i) => {
      const amt = pledge.cur === "ETB" ? GKX.fmt(tier.local.amount) : `$${GKX.fmt(tier.diaspora.amount)}`;
      return `<button type="button" data-i="${i}" aria-pressed="${pledge.tier === i && !$("#customAmt").value}">${amt}<small>${esc(L(tier.title))}</small></button>`;
    }).join("");
    $("#curLabel").textContent = pledge.cur;
    $$(".cur-toggle button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cur === pledge.cur));
    const list = [...f.channels].sort((a, b) => (pledge.cur === "USD" ? (a.id === "intl" ? -1 : b.id === "intl" ? 1 : 0) : 0));
    $("#channels").innerHTML = list.map((c) => `
      <a class="channel" href="${esc(c.url)}" data-channel="${c.id}" target="_blank" rel="noopener">
        <span><b>${esc(c.name)}</b><small>${esc(L(c.note))}</small></span><span class="arrow">→</span>
      </a>`).join("");
  }
  function initPledge() {
    const modal = $("#pledgeModal");
    modal.addEventListener("click", (e) => {
      const amt = e.target.closest("#amountPicker button");
      if (amt) { pledge.tier = +amt.dataset.i; $("#customAmt").value = ""; renderPledge(); }
      const cur = e.target.closest(".cur-toggle button");
      if (cur) { pledge.cur = cur.dataset.cur; renderPledge(); }
      const ch = e.target.closest(".channel");
      if (ch) {
        track("pledge_click", { channel: ch.dataset.channel, currency: pledge.cur });
        if (ch.getAttribute("href") === "#") { e.preventDefault(); alert(t("pending")); }
      }
    });
    $("#customAmt").addEventListener("input", () => $$("#amountPicker button").forEach((b) => b.setAttribute("aria-pressed", false)));
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-open-pledge]");
      if (!trigger) return;
      e.preventDefault();
      if (trigger.dataset.tier != null) { pledge.tier = +trigger.dataset.tier; $("#customAmt").value = ""; }
      if (trigger.dataset.cur) pledge.cur = trigger.dataset.cur;
      renderPledge();
      modal.showModal();
      track("pledge_open", { tier: pledge.tier });
    });
  }

  /* ---------------- Video modal ---------------- */
  GKX.ytId = (v) => {
    if (!v) return "";
    const m = String(v).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
    return m ? m[1] : /^[\w-]{11}$/.test(v) ? v : "";
  };
  function initVideo() {
    const modal = $("#videoModal");
    document.addEventListener("click", (e) => {
      const trig = e.target.closest("[data-video]");
      if (!trig) return;
      const id = GKX.ytId(trig.dataset.video === "teaser" ? C.site.trailerUrl : trig.dataset.video);
      $("#videoFrame").innerHTML = id
        ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="GERA KEGN video"></iframe>`
        : `<div class="soon"><b>ግራ ቀኝ</b><span>${esc(t("soon"))}</span></div>`;
      modal.showModal();
      track("video_open", { video: id || "teaser-pending" });
    });
    modal.addEventListener("close", () => { $("#videoFrame").innerHTML = ""; });
    $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
  }

  /* ---------------- Language switching ---------------- */
  function applyLang() {
    document.documentElement.lang = GKX.lang;
    translateStatic();
    translateShell();
    window.GKC?.renderAll();
    scanMotion();
    // Anything already on screen after a language switch should show immediately.
    $$("[data-reveal]:not(.is-in)").forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-in"); });
  }
  GKX.applyLang = applyLang;

  /* ---------------- Boot ---------------- */
  if (PREVIEW) {
    const robots = document.createElement("meta");
    robots.name = "robots"; robots.content = "noindex, nofollow";
    document.head.append(robots);
  }
  shell();
  if (PREVIEW) {
    const ribbon = document.createElement("div");
    ribbon.className = "preview-ribbon"; ribbon.setAttribute("role", "note");
    ribbon.innerHTML = `<b>REVIEW PREVIEW</b><span class="ethi">የግምገማ ቅድመ እይታ</span><small>Not final · ያልተጠናቀቀ</small>`;
    document.body.append(ribbon);
  }
  initMenu();
  initForms();
  initPledge();
  initVideo();
  initNavScroll();
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".lang button");
    if (!b || b.dataset.lang === GKX.lang) return;
    GKX.lang = b.dataset.lang; store.set("gk-lang", GKX.lang);
    document.documentElement.lang = GKX.lang;
    translateStatic(); translateShell();
    window.GKC?.renderAll();
    $$('[data-reveal="words"]').forEach((el) => { splitWords(el); el._splitLang = GKX.lang; });
    scanMotion();
    $$("[data-reveal]").forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-in"); });
  });
  // components.js loads right after this file; start once it has registered.
  const start = () => { applyLang(); initDrift(); initCurtain(); };
  const whenReady = () => (window.GKC ? start() : setTimeout(whenReady, 10));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", whenReady);
  else whenReady();
})();
