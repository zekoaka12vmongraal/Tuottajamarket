# Tuottajamarket - Lähiruokaverkkokauppa

Verkkokauppaprojekti, jossa paikalliset tuottajat voivat myydä tuotteitaan suoraan kuluttajille. Toteutettu osana web-kehityksen opintoja Gradiassa.

## Projektin kuvaus

Tuottajamarket on full-stack verkkokauppasovellus, joka tarjoaa helpon tavan ostaa lähiruokaa. Sovelluksessa käyttäjät voivat selata tuotteita, lisätä niitä ostoskoriin ja suorittaa tilauksen eri maksutavoilla.

### Keskeiset ominaisuudet

- **Etusivu** - Hero-banneri, tervetuloviesti ja "Kuinka se toimii" -osio
- **Verkkokauppa** - Tuoteselaus, haku ja kategoriasuodatus
- **Ostoskori** - Tuotteiden lisäys, määrän muokkaus ja poisto
- **Maksusivu** - Monivaiheinen tilausflow eri maksutavoilla
- **Kaksikielisyys** - Suomi ja englanti
- **Responsiivinen design** - Toimii mobiilissa, tabletissa ja työpöydällä

## Teknologiat

**Frontend:**
- React + Vite
- React Router
- CSS3

**Backend:**
- Node.js + Express
- Supabase (tietokanta ja tiedostot)
- Multer (tiedostojen käsittely)

**Deployment:**
- Render.com

## Toteutusprosessi

Projekti eteni seuraavasti:

1. **Suunnittelu** - Määrittelin ominaisuudet ja tein rakennesuunnitelman
2. **Backend** - Toteutin REST API:n tuotteiden hakemiseen ja tilausten käsittelyyn
3. **Frontend** - Loin React-komponentit ja sivujen reitityksen
4. **Tietokanta** - Konfiguroidin Supabasen ja tuotteiden tallennuksen
5. **Tyylittely** - Tein responsiivisen UI:n CSS:llä
6. **Testaus** - Testasin eri laitteilla ja korjasin bugit
7. **Julkaisu** - Deployasin Renderiin

## Haasteet ja oppiminen

Projektin aikana kohtasin useita haasteita:

- Backend-frontend kommunikointi vaati aluksi säätämistä CORS-asetusten kanssa
- Ostoskorin tilanhallinta Reactissa oli monimutkainen, mutta Context API ratkaisi sen
- Supabasen konfigurointi ja ympäristömuuttujien hallinta tuotannossa
- Responsiivisen designin toteutus eri näyttöko'oille

Opin projektin aikana:
- React hookit ja Context API:n käytön
- REST API:n rakentamisen Node.js:llä
- Tietokannan integroinnin
- Full-stack sovelluksen julkaisemisen

## Asennus ja käyttö
```bash
# Kloonaa repositorio
git clone https://github.com/zekoaka12vmongraal/Tuottajamarket.git

# Siirry projektin hakemistoon
cd Tuottajamarket

# Asenna riippuvuudet
npm install

# Luo .env tiedosto ja lisää Supabase-tunnukset
# SUPABASE_URL=...
# SUPABASE_SERVICE_KEY=...
# SUPABASE_BUCKET=...

# Buildaa ja käynnistä
npm run build
npm start
```

Sovellus käynnistyy osoitteessa `http://localhost:3001`

## Live-demo

Sovellus on julkaistu osoitteessa: https://tuottajamarket-kj36.onrender.com

## Tekijätiedot

**Tekijä:** Aleksi Forssell  
**Oppilaitos:** Gradia  
**Projekti:** Verkkokauppa - Projekti 1  
**Vuosi:** 2025

---

© 2025 Tuottajamarket. Toteutettu oppimistarkoituksessa.
