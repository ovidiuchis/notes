# Lista Mea de Resurse

Salut! 👋 Acesta este un proiect simplu și rapid pentru a-ți organiza resursele, link-urile și notițele personale.

A fost gândit să fie cât mai simplu de utilizat, fără baze de date complicate sau configurări greoaie. Totul funcționează direct în browser.

## 🌟 Ce face acest proiect?

- **Păstrează totul la un loc**: Link-uri utile, notițe, sau chiar mici aplicații (tools).
- **Simplu și Rapid**: Se încarcă instant, nu are reclame și nu te distrage.
- **Funcționează și pe mobil**: Poți "instala" site-ul pe telefon ca o aplicație (PWA).
- **Căutare instantă**: Găsești rapid ce cauți tastând câteva litere.

## 🛠️ Cum adaug resurse noi?

Toate datele sunt păstrate într-un singur fișier numit `data/resources.json`. Nu ai nevoie de panou de administrare, doar editezi acel fișier text.

Structura este foarte simplă:
- **Titlu**: Numele resursei.
- **Link (URL)**: Unde duce (poate fi un site extern sau o pagină internă).
- **Notă**: O scurtă descriere (opțional).

### Exemplu:
Dacă vrei să adaugi un link nou, adaugi pur și simplu o linie în listă:

```json
{
  "title": "Un site util",
  "url": "https://exemplu.com",
  "note": "Foarte bun pentru inspirație."
}
```

## � Tipuri de Resurse

Poți adăuga 3 tipuri de conținut în lista ta:

1.  **Link Extern** (Standard)
    - Se deschide într-o fereastră nouă.
    - Ideal pentru site-uri, articole sau video-uri de pe net.
    - *Exemplu:* `{"title": "Google", "url": "https://google.com"}`

2.  **Pagină Internă** (`type: "page"`)
    - Se deschide direct în aplicație, ca o notiță.
    - Poți scrie text formatat, titluri, citate și versete.
    - *Exemplu:* `{"title": "Notițele mele", "id": "notita1", "type": "page"}`
    - (Trebuie să creezi fișierul corespunzător în `data/pages/notita1.json`).

3.  **Unealtă / Tool** (`type: "tool"`)
    - O mică aplicație care rulează în interiorul listei.
    - Utile pentru cronometre, calculatoare sau alte widget-uri.
    - *Exemplu:* `{"title": "Cronometru", "id": "timer", "type": "tool"}`

## �🚀 Cum îl folosesc?

1. **Descarcă** acest folder.
2. Deschide fișierul `index.html` în browserul tău preferat (Chrome, Edge, Safari).
3. Asta e tot! 🎉

Dacă vrei să fie public, poți încărca tot folderul pe orice serviciu de găzduire web (chiar și unul gratuit, pentru că sunt doar fișiere statice).

## 📝 Notițe și Pagini

Pe lângă link-uri, poți avea și pagini de notițe (în folderul `data/pages`). Acestea sunt fișiere simple de text care pot conține titluri, paragrafe și liste.

---
*Proiect creat pentru a fi simplu, util și eficient.*
