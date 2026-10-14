# ASMR fără frontiere

Peisaje sonore, declanșatoare tactile și bătăi binaurale, sintetizate local în browser, într-un singur fișier HTML.

**Live:** https://chiuta.github.io/ASMR/

**Versiune:** 1.1.0 · **Ultima actualizare:** 14 octombrie 2026

![Captura de ecran](screenshot.png)

## Ce este

Un mixer de sunete pentru relaxare, scris în JavaScript simplu. Sunetul nu este redat din fișiere audio: este generat în timp real prin Web Audio API. Aplicația reunește straturi de ambient care se pot combina, sunete scurte declanșate prin atingere, efecte vizuale interactive, bătăi binaurale și un cronometru de adormire.

## Funcții

- **Peisaje sonore** (straturi combinabile, fiecare cu propriul volum): Ploaie, Valuri de ocean, Foc de tabără, Vânt, Noapte cu greieri, Zgomot alb, Zgomot roz, Zgomot maro.
- **Declanșatoare**: Ciocănit lemn, Ciocănit sticlă, Ciocănit masă, Picătură de apă, Foaie întoarsă, Clic tastatură, Foșnet hârtie și Periere (textura continuă cât timp ții apăsat).
- **Efecte vizuale ASMR**: Nisip kinetic, Baloane cu folie, Cerneală în apă, Gheață care crapă, Model simetric, Valuri de lumină; buton **Curăță**.
- **Bătăi binaurale**: benzile Delta, Theta, Alpha și Beta, cu volum separat și buton **Pornește**. Aplicația recomandă căști stereo.
- **Cronometru de adormire**: 15, 30, 45, 60 sau 90 min, sau „Oprit”; afișaj al timpului rămas.
- **Presetări**: șase presetări încorporate (Ploaie de noapte, Furtună pe ocean, Foc de tabără, Concentrare, Adormire, Liniște) și presetări proprii, salvate cu nume (maximum 24 de caractere).
- **Mix partajabil prin link**: „Copiază linkul mixului” generează o adresă cu `#mix=…` (straturile active cu volum și, dacă e pornită, banda binaurală). Cine deschide linkul vede butonul „Redă mixul din link”; sunetul nu pornește singur. Valorile din link sunt validate (doar straturi cunoscute, volum 1–100). Presetările afișează mesaje de stare (nume lipsă, salvat, link copiat).
- Buton **Pauză tot / Redă tot** și **Volum general**; buton **Oprește toate straturile** (aduce straturile la 0 și oprește bătăile binaurale).
- Cronometru cu **durată personalizată** (1–480 min, cu mesaj de eroare la valoare invalidă); cronometrul are rol `timer` pentru cititoarele de ecran.
- Presetarea **Ultima combinație**: ultimul mix cu cel puțin un strat sau bătăi active se păstrează automat și se poate relua dintr-un clic.
- Scurtături globale: **Spațiu** sau **P** = pauză/redare, **+** / **−** = volum general (±5), când focusul nu e pe un câmp sau buton.
- Tastele Enter și Spațiu activează declanșatoarele când acestea au focus.

## Funcții noi (v1.1.0)

- **Înregistrare WAV a mixului curent**: captează în timp real ieșirea aplicației (straturile active, bătăile binaurale și declanșatoarele atinse în acest timp), stereo, 16 biți, la durata aleasă (15 s – 5 min) sau până la „Oprește și salvează”; fișierul `asmr-mix-*.wav` se descarcă la final. Fără sunet activ refuză cu mesaj. Limită: înregistrarea durează cât durează sunetul (timp real, nu randare accelerată) și folosește `ScriptProcessorNode`; dacă browserul nu îl are, apare un mesaj.
- **QR pentru mix**: generează un cod QR cu nivelurile straturilor (și bătăile binaurale) și îl poate citi înapoi din imagine sau din text lipit; QR-ul fără legătură web conține doar `#mix=…`. Imaginea fără QR nu modifică nimic.
- **Ghid vocal de respirație** (`FFF.tts`): rostește „Inspiră” (4 s) și „Expiră” (6 s) în ritm lent, cu text vizibil și `aria-pressed`; fără sinteză vocală apare mesaj. Nu este indicație medicală.
- **Kit**: Transparență și copie `.fff.json` (presetările sunt indexate), modulele `core, label, bundle, qr, tts`.
- **Limbi și traduceri**: Aplicația are interfață doar în română; textele noi sunt în română. Dialogul „Transparență” al kitului este în 8 limbi (traduceri automate, **neverificate de vorbitori nativi**).

## Manual de utilizare

1. Deschide pagina și atinge orice control: browserul cere un gest al utilizatorului înainte de a reda audio.
2. În „Peisaje sonore”, ridică glisorul unuia sau mai multor straturi; reglează „Volum general”.
3. În „Declanșatoare”, atinge un buton pentru un sunet scurt; la „Periere” ține apăsat cât vrei textura.
4. În „Efecte vizuale ASMR”, alege un efect și interacționează cu el; „Curăță” îl resetează.
5. În „Bătăi binaurale”, alege banda (Delta, Theta, Alpha sau Beta), ajustează volumul și apasă **Pornește**.
6. Pentru adormire, alege durata în „Cronometru de adormire”; sunetul se oprește la expirarea timpului. „Oprit” anulează cronometrul.
7. În „Presetări”, apasă o presetare încorporată sau scrie un nume (Enter sau **Salvează**) pentru a-ți salva combinația curentă de straturi și banda binaurală activă.
8. **Pauză tot** oprește temporar toate sunetele; același buton le reia.

## Avertisment

Conținut informativ și de relaxare; nu înlocuiește sfatul medical. Descrierile benzilor binaurale (Delta, Theta, Alpha, Beta) sunt asocieri populare; dovezile științifice privind efectul lor asupra somnului, concentrării sau stării de spirit sunt limitate, iar aplicația nu este un dispozitiv medical și nu tratează nicio afecțiune. Ține volumul la un nivel confortabil; dacă ai epilepsie, tinnitus sau altă afecțiune, cere sfatul unui medic înainte de utilizare îndelungată.

## Confidențialitate și rețea

- Kitul „fără frontiere” (`fff-kit`, modulele `core, label, bundle, qr, tts`) este lipit în `index.html`: nu face cereri de rețea. Dialogul „Transparență” (clic pe versiune) arată rețeaua declarată (0 cereri externe), cheile din `localStorage`, SHA-256 al fișierului și oferă copie de siguranță `.fff.json` (opțional criptată cu parolă, AES-GCM). Codurile QR se generează și se citesc local; citirea se face doar dintr-o imagine aleasă de utilizator, fără cameră.

- **Stocare locală (localStorage):** două chei: `asmr_ff_presets` (presetările tale salvate: nume, niveluri ale straturilor, bandă binaurală) și `asmr_ff_last` (ultima combinație: niveluri și bandă, fără nume). Dacă browserul blochează stocarea, presetările rămân doar în memorie până la reîncărcare.
- **Rețea:** în cod nu există cereri de rețea (`fetch`), scripturi, fonturi sau imagini încărcate din exterior și nici linkuri externe. Nu există analytics.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; nu are nevoie de internet. Este nevoie de un browser cu suport Web Audio API și JavaScript activat.

## Istoric / Changelog

- 1.1.0 — 2026-10-14: înregistrare WAV, QR pentru mix, ghid vocal de respirație, kit „fără frontiere”. Teste: `tests/fff-r8.test.mjs`.

### 12 octombrie 2026 (v1.0.0)
- 1.0.0 — 2026-10-12: versiunea și data ultimei actualizări sunt afișate în aplicație

### 11 octombrie 2026 (a treia intrare)
- Mix partajabil prin link, cu aplicare doar la apăsarea unui buton; mesaje de stare la presetări (înainte, salvarea fără nume nu dădea niciun răspuns).

### 11 octombrie 2026
- Nou: durată personalizată pentru cronometru, „Oprește toate straturile”, presetarea „Ultima combinație”, scurtături de tastatură; CSP cu hash pentru script (fără `'unsafe-inline'` la scripturi). Captura de ecran actualizată.
- Adăugat CSP strict (fără rețea, fără resurse externe); verificare: axe 0 violări, fără erori în consolă, fără depășire orizontală la 360 px.
- Calitatea sunetului sintetizat nu poate fi evaluată automat; neschimbată în această rundă.

## Licență

Licența nu este încă declarată explicit în acest repository; vezi nota din aplicație.

Aplicația însăși conține doar mențiunea: „Fișierul e al tău. 100% local — fără cont, fără telemetrie, fără server.”

## Autor

Alexio — Alexandru-Ionuț Chiuță. Contact: alexio@trom.tf

## English summary

ASMR fără frontiere is a single-file ASMR sound mixer: layered soundscapes (rain, ocean, fire, wind, crickets, white/pink/brown noise), touch triggers, interactive visual effects, binaural beats (Delta/Theta/Alpha/Beta) and a sleep timer, all synthesised live with the Web Audio API. It makes no network requests; only user-saved presets are kept in localStorage. UI is in Romanian. License not yet declared explicitly.

Audit: 2026-10-10 — verificat cod (fără cereri de rețea), accesibilitate (axe) și funcționare; adăugat avertisment.
