# Tóth Dezső EV – Kőművesmunkák

Egyoldalas, reszponzív bemutatkozó oldal (landing page) Tóth Dezső EV részére.

**Szolgáltatások:** kőműves munkák · burkolás · térkövezés · szigetelés · kerítésépítés
**Kapcsolat:** +36 20 464 3790 · tothdedi76@gmail.com

## Felépítés

```
index.html      – az oldal tartalma
css/style.css   – stílusok, animációk, átmenetek
js/main.js      – interakciók (menü, görgetési animációk, űrlap)
favicon.svg     – ikon
.nojekyll       – GitHub Pages: Jekyll feldolgozás kikapcsolása
```

Tisztán statikus oldal: nincs build lépés és nincs függőség (a betűtípusok a Google Fontsról töltődnek).

## Helyi megtekintés

Elég megnyitni az `index.html`-t böngészőben, vagy:

```bash
python3 -m http.server 8000
```

majd: http://localhost:8000

## Közzététel GitHub Pages-en

1. A repó **Settings → Pages** oldalán a *Build and deployment* résznél:
   - **Source:** Deploy from a branch
   - **Branch:** `main`, mappa: `/ (root)`
2. Mentés után pár perc múlva elérhető: `https://<felhasználónév>.github.io/<repó-neve>/`

Saját domainhez a Settings → Pages → *Custom domain* mezőt kell kitölteni.

## Ajánlatkérő űrlap

Az űrlapnak nincs szerveroldala (GitHub Pages csak statikus fájlokat szolgál ki), ezért
küldéskor a látogató levelezőprogramja nyílik meg a kitöltött üzenettel (`mailto:`).
Ha később közvetlen küldés kell, egy űrlapszolgáltatás (pl. Formspree) könnyen beköthető.

## Akadálymentesség, mozgás

- Billentyűzettel bejárható, „Ugrás a tartalomra” link, ARIA címkék.
- A `prefers-reduced-motion` beállítást tiszteletben tartja: ilyenkor az animációk kikapcsolnak.
