# Lista Mea de Resurse

Salut! 👋 Acesta este un proiect simplu și rapid pentru a-ți organiza resursele, link-urile și notițele personale.

Datele sunt gestionate printr-un backend Supabase, iar conținutul se administrează prin panoul de administrare.

## 🌟 Ce face acest proiect?

- **Păstrează totul la un loc**: Link-uri utile, notițe, sau chiar mici aplicații (tools).
- **Simplu și Rapid**: Se încarcă instant, nu are reclame și nu te distrage.
- **Funcționează și pe mobil**: Poți "instala" site-ul pe telefon ca o aplicație (PWA).
- **Căutare instantă**: Găsești rapid ce cauți tastând câteva litere.

## 🛠️ Cum adaug resurse noi?

Resursele se administrează prin panoul de administrare la [admin.ovidiuchis.ro](https://admin.ovidiuchis.ro/).

## 📦 Tipuri de Resurse

Poți adăuga 2 tipuri de conținut în lista ta:

1.  **Link Extern** (Standard)
    - Se deschide într-o fereastră nouă.
    - Ideal pentru site-uri, articole sau video-uri de pe net.

2.  **Pagină Internă** (`type: "page"`)
    - Se deschide direct în aplicație, ca o notiță.
    - Poți scrie text formatat, titluri, citate și versete.

## 🚀 Configurare

Proiectul necesită un backend Supabase. Configurează credențialele în `config.js`:

```javascript
const CONFIG = {
  supabase: {
    url: "URL_SUPABASE",
    publicKey: "CHEIE_PUBLICA",
  },
};
```

Pentru a rula local, deschide `index.html` în browser sau folosește un server local.

---

_Proiect creat pentru a fi simplu, util și eficient._
