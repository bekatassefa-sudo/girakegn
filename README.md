# ግራ ቀኝ · GERA KEGN — The Movie (website)

Static, dependency-free, bilingual (English / Amharic) site. Run locally:

```bash
python3 -m http.server 5173
```

## Pages (per the Requirements Document)
| # | Page | File |
|---|---|---|
| 1 | Home (+ Why Now and Become a Producer sections) | `index.html` |
| 2 | The Story | `story.html` |
| 3 | The Movie | `movie.html` |
| 4 | The Series — YouTube streaming | `series.html` |
| 5 | Why Now | `why-now.html` |
| 6 | Become a Producer (levels, steps, payment, registration, terms) | `become-a-producer.html` |
| 7 | ጓድ Producer (looping credit roll, name submission, guidelines, terms) | `guad-producer.html` |
| 8 | Corporate Partners (packages, visibility, enquiry form) | `partners.html` |
| 9 | Diaspora (ways to help, city voting, ambassador form) | `diaspora.html` |
| 10 | Transparency (goal, progress, use of funds, milestones, commitments) | `transparency.html` |
| 11 | News / Production Diary (category filters) | `news.html` |
| 12 | FAQ (search + topics) + contact form | `faq.html` |

## Content management & moderation (`/admin`)
The production team edits content at **`https://<domain>/admin`** (Decap CMS) — no code needed.

**Who can get in:** invite-only accounts (Netlify Identity). Nobody can sign up on their own.

**Approval workflow — nothing goes public without sign-off:**
`Draft → In review → Ready → Published`
1. An editor changes something (new episode link, diary post, campaign figures…) and saves → **Draft**.
2. They move it to **In review**.
3. The designated **Content Approver** checks it, moves it to **Ready**, then clicks **Publish**.
Every change is saved as a separate version with the editor's name, so anything can be traced or rolled back.

**What's editable:** episodes (YouTube links, publish / unpublish, featured), production diary, crowdfunding figures, levels,
use of funds, partner packages, ጓድ credit names, cast & crew, case files, milestones, FAQ, release date, social links, cities.
(Page copy written into the HTML — headlines and long text — is edited by the web team.)

**Public submissions are moderated too.** All six forms (producer registration, ጓድ name, partner enquiry, ambassador,
contact, newsletter) go to the private **Netlify → Forms** inbox with spam filtering and a hidden bot trap — never straight onto the site.
ጓድ names only appear in the credit roll after the moderator verifies the payment, checks the guidelines,
and adds the name in **ጓድ Producer credits** (which itself goes through the approval workflow).

### Go-live setup (one-time, ~15 minutes)
1. Put the site in a GitHub repository and deploy it on Netlify (free tier works).
2. Netlify → **Identity** → Enable. Registration: **Invite only**. Services → **Enable Git Gateway**.
3. Identity → **Invite users**: the editors and the Content Approver.
4. Netlify → **Forms**: turn on email notifications for the team.
5. Optional, strict mode: in GitHub, protect `main` so only the approver can merge — the CMS's Publish then
   requires their approval, not just trust.

### Try the admin locally
```bash
npx decap-server
```
then open `http://localhost:5173/admin/` (with the site running). Locally this saves straight to the files;
the Draft → Review → Publish board appears when the folder is a git repository (and always on the live site).

## Code
- `content/*.json` — **all content** (edited through `/admin`)
- `assets/js/content.js` — loads the content files, then starts the site
- `assets/js/core.js` — header / full-screen menu / footer, language switch, motion, forms, pledge & video modals, analytics hook
- `assets/js/components.js` — renders every `data-component="…"` block (series player, meter, tiers, credit roll, FAQ…)
- `assets/css/style.css` — styles + motion system

Static page text is translated with `data-am="…"` on the element (English is the element's content).

## The Series — YouTube feed
Add each episode's YouTube link in **/admin → The Series** (or `content/series.json`)
(any form: `watch?v=`, `youtu.be/`, or the bare ID). Thumbnails come from YouTube automatically.
- `published: false` hides an episode; `featured: true` puts it in the Featured row.
- Deep links: `series.html?s=2&e=3`. Player auto-advances to the next episode.
- Analytics events pushed to `dataLayer`: `episode_play`, `episode_complete`, `pledge_open`, `pledge_click`, `form_submit`, `city_vote`, `video_open`.
- Videos must allow embedding (YouTube Studio → Advanced → Allow embedding).

## Motion
`data-reveal="up|left|right|clip|scale|words"` on any element; `data-stagger` (or `data-stagger="alt"` for alternating left/right) on a container.
`.drift` elements slide horizontally with scroll. Page changes use a curtain wipe. All motion is disabled for visitors with *reduce motion* turned on.

## Before launch — still placeholder
| Item | Where |
|---|---|
| YouTube links for every episode; real episode titles, descriptions, durations | `/admin` → The Series |
| Release date, campaign figures, end date | `content/*.json → site, crowdfunding` |
| Payment URLs (telebirr, CBE Birr, Chapa, international) | `content/*.json → crowdfunding.channels` |
| ጓድ Producer threshold, names, deadlines | `content/*.json → tiers, guadNames`; `guad-producer.html` |
| Use-of-funds split (marked *Draft*) | `content/*.json → crowdfunding.useOfFunds` |
| Cast, crew, synopsis, novel excerpt & author | `content/*.json → cast, crew`; `story.html`, `movie.html` |
| Partner packages & pricing | `content/*.json → partnerPackages` |
| News posts, FAQ answers, terms (marked *Draft — legal review*) | `content/*.json → news, faq`; producer & ጓድ pages |
| Social links, emails, domain (share image is now `assets/img/campaign/og-share.jpg`) | `content/*.json → site`; page `<head>`s |
| Native-speaker review of all Amharic | `data-am` attributes, `/admin` (Amharic fields) |

## Integrations to wire
- **Forms** (producer registration, ጓድ name, partner enquiry, ambassador, contact, newsletter): add `data-endpoint="https://…"` to a `<form>` and it POSTs JSON (Formspree, CMS webhook, Mailchimp, etc.).
- **Live campaign totals**: fetch from the payment provider into `GK.crowdfunding`.
- **City votes**: currently saved per browser; needs a backend to be counted.
- **Analytics**: paste the GA4/GTM tag in each page `<head>`.

## Items requiring confirmation (from the requirements)
Streaming model (free on YouTube assumed) · episode territories & subtitles · crowdfunding platform & levels ·
official meaning/spelling of **ጓድ Producer** (currently “ጓድ (guad, ‘comrade’)”) · hosting & third-party budgets.
