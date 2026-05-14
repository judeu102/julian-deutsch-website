# CLAUDE.md – Bauanweisung für die Website von Julian Deutsch

> Diese Datei ist die operative Anweisung an Claude Code. Lies sie vor jedem Build-Schritt. Strategischer Kontext steht in `SEO-PLAN.md`.

## Kontext

- **Inhaber:** Julian Deutsch
- **Standort:** Essen, NRW
- **Angebot:** SEO Copywriting · Story Branding · Web Design
- **SEO-Hauptziel:** Ranken für „SEO Freelancer" (bundesweit) und „SEO Essen" (lokal)
- **Tonalität:** Persönlich, klar, story-getrieben. Kein Agentursprech, keine Buzzwords ohne Substanz.

---

## Tech-Stack-Empfehlungen

Bevor du Code schreibst, kläre mit Julian:

- **Framework:** Astro oder Next.js (App Router) – beide liefern hervorragendes SEO out-of-the-box (SSG/SSR, schnelles LCP, einfaches Schema-Einbinden). Astro ist für eine Marketing-Site mit Blog meist die ressourcenschonendere Wahl.
- **Styling:** Tailwind CSS.
- **Content:** Markdown/MDX für Blogartikel. Optional Headless CMS (Hygraph, Sanity, Contentful) – nur wenn Julian regelmäßig non-technisch publizieren will.
- **Hosting:** Vercel oder Netlify. CDN-Edge in Deutschland.
- **Analytics:** GA4 + Microsoft Clarity (Heatmaps). DSGVO-Hinweis: Cookie-Banner via klaro.js oder Cookiebot.

---

## Site-Architektur (Pflicht)

```
/                                 Hub: USP, Kurzpitch, Service-Trio, Cases, CTA
/seo-freelancer/                  Money-Page – primärer Ranking-Hebel
/seo-copywriting/                 Service-Page
/story-branding/                  Service-Page
/web-design/                      Service-Page
/seo-essen/                       Lokal-Landingpage (Local Pack-Ziel)
/seo-nrw/                         Regional-Landingpage
/ueber-mich/                      E-E-A-T (Erfahrung, Expertise, Autorität, Trust)
/cases/                           Case-Studies-Übersicht
/cases/[slug]/                    einzelne Case Study
/blog/                            Content-Hub (Listing, paginiert)
/blog/[slug]/                     einzelner Artikel
/kontakt/                         Formular + lokale Kontaktdaten
/impressum/
/datenschutz/
/sitemap.xml                      automatisch generiert
/robots.txt                       statisch
/llms.txt                         AI-Crawler-Steuerung (siehe unten)
```

---

## URL-Regeln

- Alle URLs **lowercase**, mit **Bindestrichen** statt Unterstrichen.
- **Trailing Slash konsistent** (z. B. immer mit Slash). Andere Variante 301-redirecten.
- **Keine** Datum/Kategorie-Präfixe in Blog-URLs (`/blog/seo-freelancer-kosten/`, **nicht** `/blog/2026/05/seo-freelancer-kosten/`).
- Stadt-Landingpages später unter `/seo-freelancer-[stadt]/` (Phase 2).

---

## Meta-Tag-Regeln (für jede Page-Komponente)

Verlange folgende Props auf jeder Page-Komponente:

```ts
type SeoMeta = {
  title: string;            // 50–58 Zeichen, Hauptkeyword vorne
  description: string;      // 140–155 Zeichen, mit Nutzen + CTA
  canonical: string;        // absolute URL
  ogImage: string;          // 1200×630, eigene Variante pro Money-/Service-Page
  noindex?: boolean;        // default false
  jsonLd?: object[];        // Schema.org Snippets
};
```

Pflicht-Output im `<head>`:

- `<title>{title}</title>`
- `<meta name="description" content="{description}">`
- `<link rel="canonical" href="{canonical}">`
- Open-Graph: `og:title`, `og:description`, `og:image`, `og:type=website|article`, `og:locale=de_DE`.
- Twitter-Card: `summary_large_image`.
- `<meta name="robots" content="{noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'}">`.
- JSON-LD-Skripte aus `jsonLd` als `<script type="application/ld+json">`.

---

## Vorgegebene Meta-Inhalte (Erstauflage)

### `/`
- **Title:** `SEO Freelancer aus Essen – Texte, Story, Web Design | Julian Deutsch`
- **Description:** `SEO Freelancer Julian Deutsch verbindet SEO Copywriting, Story Branding und Web Design. Sichtbarkeit, die deine Marke trägt. Jetzt kostenfrei beraten lassen.`

### `/seo-freelancer/`
- **Title:** `SEO Freelancer | Strategie, Texte und Web Design – Julian Deutsch`
- **Description:** `Als SEO Freelancer sorge ich für Rankings, die verkaufen. Story-driven SEO, persönliche Betreuung, transparente Preise. Anfrage in 2 Minuten gestellt.`

### `/seo-copywriting/`
- **Title:** `SEO Copywriting: Texte, die ranken und verkaufen | Julian Deutsch`
- **Description:** `SEO Copywriting auf Deutsch: Suchintention treffen, Story erzählen, Conversion erzeugen. Jetzt SEO-Texte vom Freelancer aus Essen anfragen.`

### `/story-branding/`
- **Title:** `Story Branding: Marken-Story, die im Kopf bleibt | Julian Deutsch`
- **Description:** `Story Branding nach dem StoryBrand-Prinzip – auf Deutsch. Klare Markenbotschaft, konsistente Texte, mehr Conversion. Beratung anfragen.`

### `/web-design/`
- **Title:** `Web Design mit SEO im Kern | Julian Deutsch`
- **Description:** `Web Design, das schnell lädt, ranking-freundlich ist und deine Story trägt. Konzept, UX, Build, SEO – alles aus einer Hand.`

### `/seo-essen/`
- **Title:** `SEO Essen: Sichtbar im Ruhrgebiet | Julian Deutsch`
- **Description:** `SEO Essen für Unternehmen aus dem Ruhrgebiet. Lokale Sichtbarkeit, Google-Business-Optimierung, persönliche Beratung. Jetzt anfragen.`

### `/seo-nrw/`
- **Title:** `SEO NRW: Freelancer für Düsseldorf, Köln, Essen, Dortmund | Julian Deutsch`
- **Description:** `SEO Freelancer für Nordrhein-Westfalen. Strategie, Content, technisches SEO. Persönlich, transparent, mit Story-Branding-DNA.`

---

## Schema.org (JSON-LD) – Pflicht-Snippets

Erzeuge eine Helper-Funktion `buildJsonLd(type, data)` und exportiere fertige Schemas. Auf der jeweiligen Page einfügen.

### Globale `Person`-Markup (auf `/` und `/ueber-mich/`)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Julian Deutsch",
  "jobTitle": "SEO Freelancer & Storybranding-Consultant",
  "url": "https://[DOMAIN]/",
  "image": "https://[DOMAIN]/img/julian-deutsch.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/[HANDLE]",
    "https://[andere-profile]"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Essen",
    "addressRegion": "NRW",
    "addressCountry": "DE"
  },
  "knowsAbout": ["Suchmaschinenoptimierung", "Story Branding", "Web Design", "SEO Copywriting", "Generative Engine Optimization"]
}
```

### `ProfessionalService`-Markup auf `/seo-freelancer/`
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Julian Deutsch – SEO Freelancer",
  "description": "SEO Freelancer mit Spezialisierung auf SEO Copywriting, Story Branding und Web Design.",
  "url": "https://[DOMAIN]/seo-freelancer/",
  "areaServed": [
    {"@type": "Country", "name": "Deutschland"},
    {"@type": "AdministrativeArea", "name": "Nordrhein-Westfalen"}
  ],
  "priceRange": "€€",
  "image": "https://[DOMAIN]/img/julian-portrait.jpg",
  "provider": {"@type": "Person", "name": "Julian Deutsch"}
}
```

### `LocalBusiness`-Markup auf `/seo-essen/`
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Julian Deutsch – SEO Freelancer Essen",
  "image": "https://[DOMAIN]/img/julian-portrait.jpg",
  "url": "https://[DOMAIN]/seo-essen/",
  "telephone": "+49-...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Strasse + Nr.]",
    "addressLocality": "Essen",
    "postalCode": "[PLZ]",
    "addressRegion": "NRW",
    "addressCountry": "DE"
  },
  "geo": {"@type": "GeoCoordinates", "latitude": "51.4556", "longitude": "7.0116"},
  "areaServed": "NRW",
  "priceRange": "€€"
}
```

### `BreadcrumbList` – auf jeder Unterseite
### `Article` + `FAQPage` – auf Blog-Artikeln
### `WebSite` + `SearchAction` – auf `/`

---

## Komponenten (vorgeschlagene Sammlung)

```
src/components/
  Hero.astro                  Hauptbanner mit H1, Sub, CTA
  ServiceTrio.astro           3-Spalten-Karten (SEO Copy, Story Branding, Web Design)
  ProofBar.astro              Logo-Leiste / „X Projekte seit Y"
  CaseCard.astro              Einzel-Case mit Zahlen
  TestimonialBlock.astro
  ProcessSteps.astro          5 Schritte-Layout
  FaqAccordion.astro          + automatisches FAQ-Schema
  AuthorBox.astro             auf jedem Blogartikel: Foto, 3 Sätze, LinkedIn-Link
  CtaSection.astro            wiederverwendbar, mit Form-/Phone-Optionen
  StickyCta.astro             mobile bottom-bar
  Header.astro / Footer.astro NAP im Footer (siehe Local-SEO)
```

---

## Performance-Regeln (nicht verhandelbar)

- Hero-Bild: priority hint (`loading="eager"`, `fetchpriority="high"`), kein Lazy-Load.
- Bilder: WebP/AVIF, mit `srcset` und `sizes`.
- `font-display: swap` und höchstens 2 Schriftfamilien.
- Critical-CSS inline; unkritisches CSS async.
- Drittanbieter-Skripte (Analytics, Chat) erst nach Consent laden.
- Lighthouse-Mobile-Score Ziel: Performance ≥ 90, SEO ≥ 95, Best Practices ≥ 90, Accessibility ≥ 95.
- Core Web Vitals: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms.

---

## Accessibility (Pflicht, kein Bonus)

- Semantisches HTML (`<main>`, `<nav>`, `<article>`, `<section>`).
- Sichtbarer Fokus-Stil auf allen interaktiven Elementen.
- Alt-Texte beschreibend, nicht stuffend.
- Kontrast WCAG AA mindestens.
- Formulare mit `<label>` verknüpft, Fehler per `aria-live`.

---

## Internationalisierung

- Sprache: ausschließlich Deutsch.
- `<html lang="de">` setzen.
- `og:locale=de_DE`.

---

## Robots & Sitemap

**`/robots.txt`**
```
User-agent: *
Allow: /

Sitemap: https://[DOMAIN]/sitemap.xml
```

**`/sitemap.xml`** automatisch aus dem Routing generieren. Blog-Artikel mit `lastmod`. Money-/Service-Pages `priority=0.9`, Blog `priority=0.7`.

---

## `llms.txt` (Generative-Engine-Steuerung)

Lege in den Root:
```
# llms.txt – Julian Deutsch
> SEO Freelancer aus Essen mit Spezialisierung auf SEO Copywriting, Story Branding und Web Design.

## Kern-Inhalte
- /seo-freelancer/  – Money-Page mit Leistungs- und Preis-Kontext
- /seo-essen/       – Lokale Beratung im Ruhrgebiet
- /seo-copywriting/ – Service Copywriting
- /story-branding/  – Service Story Branding
- /web-design/      – Service Web Design
- /ueber-mich/      – Person, Erfahrung, Schwerpunkte

## Blog
- /blog/            – Sitemap der Fachartikel
```

---

## NAP & Local-SEO im Footer

Pflicht-Datenblock im Footer **identisch** mit Google Business Profil und allen Verzeichnissen:

```
Julian Deutsch – SEO Freelancer
[Strasse + Nr.]
[PLZ] Essen
Tel: +49-...
E-Mail: [hallo@domain]
```

Zusätzlich `<address>`-Element im Footer.

---

## Formular & Conversion-Tracking

- Kontaktformular: Felder Name, E-Mail, Projektkontext, Budget-Range (Drop-down).
- Spam-Schutz: Honeypot + Cloudflare-Turnstile (kein reCAPTCHA, datenschutzfreundlicher).
- Submit-Event in GA4: `lead_form_submit` mit Parameter `form_location`.
- Telefon-Klicks: `phone_click`-Event.
- WhatsApp/Calendly-Klicks: separate Events.
- Erfolg-Page (`/danke/`) mit `noindex`.

---

## DSGVO-Hinweise

- Cookie-Banner: Consent-First. Analytics, Heatmaps, externe Fonts erst nach Opt-in.
- Lokale Schriften statt Google Fonts (oder selbst hosten).
- Datenschutzerklärung: alle eingesetzten Tools listen.
- Impressum nach §5 TMG vollständig.

---

## Definition of Done für eine Seite

Bevor eine Seite als „fertig" gilt:

- [ ] H1 enthält Hauptkeyword, ist einzigartig auf der Site.
- [ ] Title und Meta-Description gemäß Vorgabe (Längen geprüft).
- [ ] Canonical gesetzt, korrekt absolut.
- [ ] OG-Image vorhanden, 1200×630, optisch zur Seite passend.
- [ ] Mind. 3 interne Links auf themenverwandte Seiten.
- [ ] Schema.org-Snippet eingebaut und in Rich-Result-Test validiert.
- [ ] Lighthouse Mobile ≥ 90 / 95 / 90 / 95.
- [ ] Tracking-Events feuern bei CTA, Form-Submit, Telefon-Klick.
- [ ] In Sitemap enthalten.
- [ ] In Search Console eingereicht & Indexierung beantragt.
