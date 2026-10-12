/* =====================================================================
   GERA KEGN — components. Any element with data-component="name" is
   rendered from content.js and re-rendered when the language changes.
   ===================================================================== */
(() => {
  const C = window.GK, X = window.GKX;
  const { $, $$, esc, fmt } = X;
  const t = (k) => X.t(k), L = (o) => X.L(o);
  const state = { meterDone: new WeakSet() };

  const R = {};

  /* ---------- Crowdfunding meter ---------- */
  R.meter = (el) => {
    const f = C.crowdfunding;
    const pct = Math.min(100, (f.raised / f.goal) * 100);
    const days = Math.max(0, Math.ceil((new Date(f.endsOn) - Date.now()) / 864e5));
    const compact = el.hasAttribute("data-compact");
    el.classList.add("meter");
    if (compact) el.classList.add("meter-compact");
    el.innerHTML = `
      <div class="meter-row">
        <div><b data-m="raised">0</b><span>${esc(t("raised"))}</span></div>
        <div class="right"><b>${fmt(f.goal)} ${f.currency}</b><span>${esc(t("goal"))}</span></div>
      </div>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct.toFixed(0)}"><i></i></div>
      <div class="meter-stats">
        <div><b data-m="pct">0%</b><span>${esc(t("funded"))}</span></div>
        <div><b data-m="backers">0</b><span>${esc(t("backers"))}</span></div>
        ${compact ? "" : `<div><b data-m="guads">0</b><span>${esc(t("guads"))}</span></div>`}
        <div><b>${days}</b><span>${esc(t("daysLeft"))}</span></div>
      </div>
      ${compact ? "" : `<button type="button" class="btn btn-gold btn-block" data-open-pledge>${esc(t("pledge"))}</button>
      <p class="tiny muted meter-note">${esc(t("secure"))}</p>`}`;
    const set = (e) => {
      $('[data-m="raised"]', el).textContent = `${fmt(f.raised * e)} ${f.currency}`;
      $('[data-m="pct"]', el).textContent = `${(pct * e).toFixed(0)}%`;
      $('[data-m="backers"]', el).textContent = fmt(f.backers * e);
      const g = $('[data-m="guads"]', el); if (g) g.textContent = fmt(f.guadProducers * e);
      $(".bar i", el).style.transform = `scaleX(${(pct / 100) * (e > 0 ? 1 : 0)})`;
    };
    if (state.meterDone.has(el) || X.reduced) { set(1); return; }
    set(0);
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect(); state.meterDone.add(el);
      $(".bar i", el).style.transform = `scaleX(${pct / 100})`;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1800), e = 1 - Math.pow(1 - p, 3);
        set(e); if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(el);
  };

  /* ---------- Countdown ---------- */
  R.countdown = (el) => {
    el.classList.add("countdown");
    el.innerHTML = ["d", "h", "m", "s"].map((k) => `<div><b data-cd="${k}">00</b><span>${esc(t("cd_" + k))}</span></div>`).join("");
    tickCountdown();
  };
  function tickCountdown() {
    let diff = Math.max(0, new Date(C.site.releaseDate) - Date.now()) / 1000;
    const d = Math.floor(diff / 86400); diff -= d * 86400;
    const h = Math.floor(diff / 3600); diff -= h * 3600;
    const m = Math.floor(diff / 60), s = Math.floor(diff - m * 60);
    const v = { d: String(d).padStart(3, "0"), h: String(h).padStart(2, "0"), m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0") };
    $$("[data-cd]").forEach((b) => { b.textContent = v[b.dataset.cd]; });
  }
  setInterval(tickCountdown, 1000);

  R.release = (el) => { el.textContent = L(C.site.releaseLabel); };

  R.ticker = (el) => {
    const run = [...t("ticker"), ...t("ticker")].map((s) => `<span>${esc(s)}</span>`).join("");
    el.innerHTML = `<div class="ticker-track">${run}${run}</div>`;
  };

  const ICONS = {
    youtube: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z",
    facebook: "M14 8V6c0-.9.6-1.1 1-1.1h2.6V1H14c-4 0-4.9 3-4.9 4.9V8H6.8v4h2.3v11H14V12h3.3l.4-4z",
    instagram: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2z",
    tiktok: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.3 7.3 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z",
    telegram: "M21.9 4.3 18.7 19.5c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.2 13.2l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 2.8c.9-.3 1.7.2 1.3 1.5z",
    x: "M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9L.9 2.3h7l4.8 6.3zm-1.2 18h1.9L7.1 4.2H5.1z"
  };
  R.socials = (el) => {
    el.innerHTML = Object.entries(C.site.social).map(([k, url]) =>
      `<a href="${esc(url)}" aria-label="${k}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[k]}"/></svg></a>`).join("");
  };

  /* ---------- Tiers ---------- */
  R.tiers = (el) => {
    el.classList.add("tiers");
    el.setAttribute("data-stagger", "");
    el.innerHTML = C.crowdfunding.tiers.map((tier, i) => `
      <article class="tier ${tier.featured ? "featured" : ""} ${tier.guad ? "is-guad" : ""}">
        ${tier.featured ? `<span class="tier-badge">${esc(t("popular"))}</span>` : ""}
        <h3>${esc(L(tier.title))}</h3>
        <div class="tier-amt">${fmt(tier.amount)} ${C.crowdfunding.currency}</div>
        <div class="tier-usd">≈ $${fmt(tier.usd)} USD</div>
        ${tier.guad ? `<p class="tier-guad">★ ${esc(t("qualifies"))}</p>` : ""}
        <ul>${L(tier.perks).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <button type="button" class="btn ${tier.featured ? "btn-gold" : "btn-ghost"} btn-block" data-open-pledge data-tier="${i}">${esc(t("choose"))}</button>
      </article>`).join("");
  };

  /* ---------- Case files ---------- */
  R.cases = (el) => {
    el.classList.add("case-grid");
    el.setAttribute("data-stagger", "");
    el.innerHTML = C.cases.map((c) => {
      const sealed = c.season === "film";
      const season = sealed ? t("film") : `${t("season")} ${c.season}`;
      return `
      <button type="button" class="case ${sealed ? "sealed" : ""}" aria-pressed="false">
        <span class="case-inner">
          <span class="case-face case-front">
            <span class="case-no">FILE NO. ${esc(c.no)}</span>
            <span class="case-stamp">${esc(sealed ? t("sealed") : t("closed"))}</span>
            <span class="case-title">${esc(L(c.title))}</span>
            <span class="case-meta"><span>${esc(season)}</span><span>${esc(t("open"))} →</span></span>
          </span>
          <span class="case-face case-back">
            <span class="case-no">FILE NO. ${esc(c.no)} · ${esc(season)}</span>
            <span class="case-text">${esc(L(c.text))}</span>
            <span class="case-close">← ${esc(t("closeFile"))}</span>
          </span>
        </span>
      </button>`;
    }).join("");
  };
  document.addEventListener("click", (e) => {
    const c = e.target.closest(".case");
    if (c) c.setAttribute("aria-pressed", c.classList.toggle("open"));
  });

  /* ---------- Cast & crew ---------- */
  const SIL = `<svg class="silhouette" viewBox="0 0 200 220" aria-hidden="true"><path d="M100 18c26 0 42 20 42 46 0 22-10 40-24 48v10c38 8 68 30 74 70v28H8v-28c6-40 36-62 74-70v-10c-14-8-24-26-24-48 0-26 16-46 42-46z"/></svg>`;
  R.cast = (el) => {
    el.classList.add("cast-grid");
    el.setAttribute("data-stagger", "");
    el.innerHTML = C.cast.map((p, i) => `
      <article class="person" tabindex="0">
        <div class="portrait">
          ${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.actor)}" loading="lazy">` : SIL}
          <span class="initial">No. ${String(i + 1).padStart(2, "0")}</span>
        </div>
        <div class="person-info">
          <h3 class="person-role">${esc(L(p.role))}</h3>
          <p class="person-actor">${esc(p.actor)}</p>
          <p class="person-bio">${esc(L(p.bio))}</p>
        </div>
      </article>`).join("");
  };
  R.crew = (el) => {
    el.classList.add("crew");
    el.setAttribute("data-stagger", "");
    el.innerHTML = C.crew.map((c) => `<div class="crew-row"><span>${esc(L(c.role))}</span><i></i><b>${esc(c.name)}</b></div>`).join("");
  };

  /* ---------- Milestones ---------- */
  R.timeline = (el) => {
    el.classList.add("timeline");
    el.setAttribute("data-stagger", "");
    el.innerHTML = C.milestones.map((s) => `
      <li class="step ${s.status}">
        <span class="step-when">${esc(L(s.when))}</span>
        <h3>${esc(L(s.title))}</h3>
        <p>${esc(L(s.text))}</p>
      </li>`).join("");
  };

  R.gallery = (el) => {
    el.classList.add("gallery");
    el.innerHTML = C.gallery.map((g, i) => `
      <figure class="still" data-tone="${g.tone}" data-reveal="clip" style="--i:${i}">
        <figcaption>${esc(L(g.label))}</figcaption>
      </figure>`).join("");
  };

  /* ---------- News / diary ---------- */
  R.news = (el) => {
    const limit = +el.dataset.limit || Infinity;
    const withFilter = el.hasAttribute("data-filter");
    const active = el._filter || "all";
    const cats = ["all", ...new Set(C.news.map((n) => n.category))];
    const posts = C.news.filter((n) => active === "all" || n.category === active).slice(0, limit);
    el.innerHTML = `
      ${withFilter ? `<div class="chips" role="group" aria-label="Filter">${cats.map((c) =>
        `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === active}">${esc(L(C.newsCategories[c]))}</button>`).join("")}</div>` : ""}
      <div class="news-grid" data-stagger>
        ${posts.map((n) => {
          const vid = X.ytId(n.youtube);
          return `
          <article class="post ${vid ? "has-video" : ""}">
            ${vid ? `<button type="button" class="post-video" data-video="${vid}" aria-label="Play"><img src="https://i.ytimg.com/vi/${vid}/hqdefault.jpg" alt="" loading="lazy"><span class="play-dot"></span></button>` : ""}
            <span class="post-meta"><span>${esc(X.fmtDate(n.date))}</span><span class="post-tag">${esc(L(C.newsCategories[n.category]))}</span></span>
            <h3>${esc(L(n.title))}</h3>
            <p>${esc(L(n.text))}</p>
            <span class="post-more">${esc(t("more"))}</span>
          </article>`;
        }).join("")}
      </div>`;
    $$(".chip", el).forEach((b) => b.addEventListener("click", () => {
      el._filter = b.dataset.cat; R.news(el); X.scanMotion();
    }));
  };

  /* ---------- Cities ---------- */
  R.cities = (el) => {
    const votes = JSON.parse(X.store.get("gk-votes") || "[]");
    const only = el.dataset.region;
    el.classList.add("city-list");
    el.innerHTML = C.cinemas.filter((c) => !only || (only === "abroad" ? c.region !== "ET" : c.region === only)).map((c) => {
      const key = c.city.en;
      const right = c.status === "vote"
        ? `<button type="button" class="city-vote ${votes.includes(key) ? "voted" : ""}" data-city="${esc(key)}" aria-pressed="${votes.includes(key)}">${esc(votes.includes(key) ? t("voted") : t("voteBtn"))}</button>`
        : `<span class="city-status">${esc(t(c.status))}</span>`;
      const dot = c.status === "confirmed" ? "dot-confirmed" : c.status === "planned" ? "dot-planned" : "dot-vote";
      return `<li class="city"><i class="dot ${dot}"></i><span class="city-name">${esc(L(c.city))}</span><span class="city-region">${esc(c.region)}</span>${right}</li>`;
    }).join("");
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".city-vote");
    if (!b) return;
    // TODO: POST to backend so votes are counted; stored per-browser for now.
    const list = JSON.parse(X.store.get("gk-votes") || "[]");
    const i = list.indexOf(b.dataset.city);
    i === -1 ? list.push(b.dataset.city) : list.splice(i, 1);
    X.store.set("gk-votes", JSON.stringify(list));
    X.track("city_vote", { city: b.dataset.city });
    $$('[data-component="cities"]').forEach(R.cities);
  });

  /* ---------- ጓድ Producer credit roll ---------- */
  R.credits = (el) => {
    const names = C.guadNames;
    const block = `
      <div class="roll-block">
        <p class="roll-head">ጓድ PRODUCERS</p>
        <p class="roll-sub">${GKX_lang() === "am" ? "ይህ ፊልም የተሠራው በእነዚህ ጓዶች ነው" : "This film was made possible by these comrades"}</p>
        <ul>${names.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
        <p class="roll-end">ግራ ቀኝ</p>
      </div>`;
    el.classList.add("roll");
    el.style.setProperty("--dur", `${Math.max(30, names.length * 2.2)}s`);
    el.innerHTML = `<div class="roll-track">${block}${block}</div>`;
  };
  const GKX_lang = () => X.lang;

  /* ---------- Use of funds ---------- */
  R.funds = (el) => {
    const f = C.crowdfunding;
    const shades = ["#c49a4a", "#9e2a20", "#e0bb6e", "#6e3c2a", "#8a7350", "#5d7a4a"];
    el.classList.add("funds");
    el.setAttribute("data-reveal", "up");
    el.innerHTML = `
      <div class="funds-bar">${f.useOfFunds.map((u, i) => `<i style="--p:${u.pct};--c:${shades[i % shades.length]};--i:${i}" title="${esc(L(u.label))} ${u.pct}%"></i>`).join("")}</div>
      <ul class="funds-list">${f.useOfFunds.map((u, i) => `
        <li style="--i:${i}"><span class="sw" style="background:${shades[i % shades.length]}"></span>
          <span class="funds-label">${esc(L(u.label))}</span><b>${u.pct}%</b>
          <span class="funds-amt">${fmt((f.goal * u.pct) / 100)} ${f.currency}</span></li>`).join("")}</ul>`;
  };

  /* ---------- Partner packages ---------- */
  R.packages = (el) => {
    el.classList.add("packages");
    el.setAttribute("data-stagger", "alt");
    el.innerHTML = C.partnerPackages.map((p, i) => `
      <article class="package ${i === 0 ? "featured" : ""}">
        <span class="package-no">0${i + 1}</span>
        <h3>${esc(L(p.title))}</h3>
        <p class="package-slots">${p.slots ? `${p.slots} ${esc(t("slots"))}` : esc(t("onRequest"))}</p>
        <ul>${L(p.perks).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <a href="#enquire" class="btn ${i === 0 ? "btn-gold" : "btn-ghost"} btn-sm" data-package="${esc(p.title.en)}">${esc(t("enquire"))} →</a>
      </article>`).join("");
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-package]");
    const sel = $("#pkgSelect");
    if (a && sel) sel.value = a.dataset.package;
  });

  /* ---------- FAQ ---------- */
  R.faq = (el) => {
    const q = (el._q || "").toLowerCase();
    const active = el._group || "all";
    const groups = C.faq;
    el.innerHTML = `
      <div class="faq-tools">
        <label class="faq-search"><span class="sr">Search</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="search" value="${esc(el._q || "")}" placeholder="${X.lang === "am" ? "ጥያቄ ይፈልጉ…" : "Search questions…"}">
        </label>
        <div class="chips" role="group" aria-label="Topics">
          <button type="button" class="chip" data-g="all" aria-pressed="${active === "all"}">${X.lang === "am" ? "ሁሉም" : "All"}</button>
          ${groups.map((g) => `<button type="button" class="chip" data-g="${g.id}" aria-pressed="${active === g.id}">${esc(L(g.title))}</button>`).join("")}
        </div>
      </div>
      <div class="faq-groups">
        ${groups.filter((g) => active === "all" || g.id === active).map((g) => {
          const items = g.items.filter((it) => !q || (L(it.q) + " " + L(it.a)).toLowerCase().includes(q));
          if (!items.length) return "";
          return `<section class="faq-group" id="faq-${g.id}">
            <h3 class="faq-group-title">${esc(L(g.title))}</h3>
            ${items.map((it) => `<details class="faq-item"><summary>${esc(L(it.q))}<span class="faq-plus" aria-hidden="true"></span></summary><div class="faq-a"><p>${esc(L(it.a))}</p></div></details>`).join("")}
          </section>`;
        }).join("") || `<p class="muted">${X.lang === "am" ? "ምንም አልተገኘም።" : "No questions match your search."}</p>`}
      </div>`;
    const input = $("input", el);
    input.addEventListener("input", () => {
      el._q = input.value; const pos = input.selectionStart;
      R.faq(el); const ni = $("input", el); ni.focus(); ni.setSelectionRange(pos, pos);
    });
    $$(".chip", el).forEach((b) => b.addEventListener("click", () => { el._group = b.dataset.g; R.faq(el); }));
  };

  /* ---------- Featured episodes ---------- */
  const thumb = (ep, s) => {
    const id = X.ytId(ep.youtube);
    return id
      ? `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy">`
      : `<span class="thumb-ph" data-tone="${"abcdef"[(s * 3 + ep.ep) % 6]}"><b>S${s}·E${ep.ep}</b></span>`;
  };
  R.featured = (el) => {
    const list = [];
    C.series.seasons.forEach((s) => s.episodes.forEach((ep) => { if (ep.featured && ep.published !== false) list.push([s.season, ep]); }));
    el.classList.add("ep-featured");
    el.setAttribute("data-stagger", "");
    el.innerHTML = list.map(([s, ep]) => `
      <a class="ep-card" href="series.html?s=${s}&e=${ep.ep}#watch">
        <span class="ep-thumb">${thumb(ep, s)}<span class="play-dot"></span><span class="ep-dur">${esc(ep.duration)}</span></span>
        <span class="ep-kicker">${esc(t("season"))} ${s} · E${String(ep.ep).padStart(2, "0")}</span>
        <span class="ep-title">${esc(L(ep.title))}</span>
      </a>`).join("");
  };

  /* ---------- Series player (YouTube feed) ---------- */
  const S = { season: null, ep: null, player: null, apiReady: null, started: false };
  const seasons = () => C.series.seasons.map((s) => ({ ...s, episodes: s.episodes.filter((e) => e.published !== false) }));
  const findEp = () => {
    const s = seasons().find((x) => x.season === S.season) || seasons()[0];
    const ep = s.episodes.find((e) => e.ep === S.ep) || s.episodes[0];
    return { s, ep };
  };
  function loadYTApi() {
    if (S.apiReady) return S.apiReady;
    S.apiReady = new Promise((res) => {
      window.onYouTubeIframeAPIReady = res;
      const sc = document.createElement("script");
      sc.src = "https://www.youtube.com/iframe_api";
      document.head.append(sc);
    });
    return S.apiReady;
  }
  function playCurrent(autoplay) {
    const { s, ep } = findEp();
    const box = $("#ytPlayer");
    const id = X.ytId(ep.youtube);
    S.started = false;
    if (S.player?.destroy) { S.player.destroy(); S.player = null; }
    box.innerHTML = "";
    if (!id) {
      box.innerHTML = `<div class="player-ph"><span class="thumb-ph" data-tone="${"abcdef"[(s.season * 3 + ep.ep) % 6]}"></span>
        <div><b>ግራ ቀኝ</b><p>${X.lang === "am" ? "ይህ ክፍል በቅርቡ ይቀርባል" : "This episode will be available soon"}</p>
        <a class="btn btn-ghost btn-sm" href="${esc(C.site.youtubeChannel)}" target="_blank" rel="noopener">YouTube ↗</a></div></div>`;
      return;
    }
    const mount = document.createElement("div");
    box.append(mount);
    loadYTApi().then(() => {
      S.player = new YT.Player(mount, {
        videoId: id, host: "https://www.youtube-nocookie.com",
        playerVars: { autoplay: autoplay ? 1 : 0, rel: 0, modestbranding: 1, playsinline: 1, origin: location.origin },
        events: {
          onStateChange: (e) => {
            const meta = { season: s.season, episode: ep.ep, title: ep.title.en };
            if (e.data === YT.PlayerState.PLAYING && !S.started) { S.started = true; X.track("episode_play", meta); }
            if (e.data === YT.PlayerState.ENDED) { X.track("episode_complete", meta); go(1, true); }
          }
        }
      });
    });
  }
  function go(dir, autoplay) {
    const all = [];
    seasons().forEach((s) => s.episodes.forEach((e) => all.push([s.season, e.ep])));
    const i = all.findIndex(([a, b]) => a === S.season && b === S.ep);
    const next = all[i + dir];
    if (!next) return;
    [S.season, S.ep] = next;
    sync(); playCurrent(autoplay);
  }
  function sync() {
    const { s, ep } = findEp();
    S.season = s.season; S.ep = ep.ep;
    history.replaceState(null, "", `?s=${S.season}&e=${S.ep}${location.hash}`);
    const el = $('[data-component="series"]');
    if (!el) return;
    $(".np", el).innerHTML = `
      <p class="np-kicker">${esc(t("season"))} ${s.season} · ${X.lang === "am" ? "ክፍል" : "Episode"} ${ep.ep} · ${esc(ep.duration)}</p>
      <h2 class="np-title">${esc(L(ep.title))}</h2>
      <p class="np-desc">${esc(L(ep.desc))}</p>
      <div class="np-actions">
        <button type="button" class="btn btn-ghost btn-sm" data-step="-1">← ${X.lang === "am" ? "ቀዳሚ" : "Previous"}</button>
        <button type="button" class="btn btn-ghost btn-sm" data-step="1">${X.lang === "am" ? "ቀጣይ" : "Next"} →</button>
        <a class="btn btn-red btn-sm" href="become-a-producer.html">${esc(t("back"))}</a>
      </div>`;
    $(".season-tabs", el).innerHTML = seasons().map((x) =>
      `<button type="button" role="tab" data-season="${x.season}" aria-selected="${x.season === s.season}">${esc(L(x.year))}<small>${x.episodes.length} ${X.lang === "am" ? "ክፍሎች" : "episodes"}</small></button>`).join("");
    $(".season-blurb", el).textContent = L(s.blurb);
    $(".ep-list", el).innerHTML = s.episodes.map((e) => `
      <li><button type="button" class="ep-row" data-ep="${e.ep}" ${e.ep === ep.ep ? 'aria-current="true"' : ""}>
        <span class="ep-thumb">${thumb(e, s.season)}<span class="ep-dur">${esc(e.duration)}</span>${e.ep === ep.ep ? `<span class="eq"><i></i><i></i><i></i></span>` : ""}</span>
        <span class="ep-text"><span class="ep-kicker">E${String(e.ep).padStart(2, "0")}</span><span class="ep-title">${esc(L(e.title))}</span><span class="ep-desc">${esc(L(e.desc))}</span></span>
      </button></li>`).join("");
  }
  R.series = (el) => {
    if (!el._built) {
      el._built = true;
      const p = new URLSearchParams(location.search);
      S.season = +p.get("s") || seasons()[0].season;
      S.ep = +p.get("e") || 1;
      el.innerHTML = `
        <div class="player-grid">
          <div class="player-frame" data-reveal="clip"><div id="ytPlayer" class="player"></div></div>
          <div class="np" data-reveal="right"></div>
        </div>
        <div class="season-tabs" role="tablist" aria-label="Seasons"></div>
        <p class="season-blurb muted"></p>
        <ol class="ep-list"></ol>`;
      el.addEventListener("click", (e) => {
        const tab = e.target.closest("[data-season]");
        if (tab) { S.season = +tab.dataset.season; S.ep = seasons().find((x) => x.season === S.season).episodes[0].ep; sync(); return; }
        const row = e.target.closest("[data-ep]");
        if (row) {
          S.ep = +row.dataset.ep; sync(); playCurrent(true);
          $(".player-frame", el).scrollIntoView({ behavior: X.reduced ? "auto" : "smooth", block: "center" });
          return;
        }
        const step = e.target.closest("[data-step]");
        if (step) go(+step.dataset.step, true);
      });
      sync(); playCurrent(false);
    } else sync();
  };

  /* ---------- Count-up numbers: <b data-count="2317"> ---------- */
  R.count = (el) => {
    const end = el.dataset.to === "episodes"
      ? seasons().reduce((n, s) => n + s.episodes.length, 0)
      : +el.dataset.to;
    if (X.reduced || el._done) { el.textContent = fmt(end); return; }
    el.textContent = "0";
    new IntersectionObserver((en, o) => {
      if (!en[0].isIntersecting) return; o.disconnect(); el._done = true;
      const s0 = performance.now();
      const step = (n) => { const p = Math.min(1, (n - s0) / 1400); el.textContent = fmt(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.5 }).observe(el);
  };

  /* ---------- Credit-name live preview (ጓድ form) ---------- */
  document.addEventListener("input", (e) => {
    const inp = e.target.closest("[data-credit-input]");
    const form = e.target.closest("form");
    if (!inp && !(form && $("[data-credit-input]", form))) return;
    const field = inp || $("[data-credit-input]", form);
    const out = $("[data-credit-preview]");
    if (out) out.textContent = field.value.trim() || (X.lang === "am" ? "ስምዎ እዚህ" : "Your Name Here");
    const n = $("[data-credit-count]"); if (n) n.textContent = `${field.value.length}/${field.maxLength}`;
  });

  window.GKC = {
    renderAll() {
      $$("[data-component]").forEach((el) => { const fn = R[el.dataset.component]; if (fn) fn(el); });
    }
  };
})();
