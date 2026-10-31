# Jurnal de modificări — ASMR fără frontiere

Format: [SemVer](https://semver.org/lang/ro/) MAJOR.MINOR.PATCH.

## 2.2.1 — 2026-10-31

Doar interfață (accesibilitate pe telefon, 360×740): câmpul de text „scName” (21 px înălțime) → minim 24 px. Fără alte schimbări de comportament.

## 2.2.0 — 2026-10-27 (anterior: v2.1.0)

Stare: stabil · Offline: complet

### Adăugat
- **Sunetul meu**: încarci un fișier audio local (maximum 25 MB și 5 minute); se redă în buclă, cu volum propriu, printr-un limitator (DynamicsCompressor, prag −12 dB, raport 20). Urmează volumul general, pauza și estomparea temporizatorului; intră în înregistrarea WAV a ieșirii. „Oprește toate straturile” îl aduce la 0.
- Rămâne doar în sesiune și NU intră în presetări, linkul `#mix=`, codul QR sau scene (un fișier nu poate fi pus într-un link și nu se salvează nimic).
- README (8 limbi): listele de straturi completate cu Pârâu, Ventilator, Tunet îndepărtat; secțiune nouă; linia „Neimplementat încă” actualizată.
- Texte noi scrise în RO și EN; traduceri FR/IT/ES/PT/DE/HU adăugate ulterior — traducere automată, nevalidată de vorbitori nativi.
- Test nou `tests/own-sound-v22.test.mjs` (20 verificări: refuzuri de fișiere, limitator, buclă, volum, oprire, eliminare, limbi).

### Neimplementat
- Bibliotecă persistentă de sunete proprii (IndexedDB), mai multe fișiere simultan, partajarea fișierelor prin link: omise — fișierele pot fi mari și nu pot fi puse într-un link; se păstrează caracterul 100% local și fără stocare ascunsă.

## 2.1.0 — 2026-10-27 (anterior: v2.0.0)

Stare: stabil · Offline: complet

Aplicat după mini-recenzia din 2026-10-27.

### Adăugat / modificat
- **Straturi noi (sintetizate local, fără fișiere audio):** Pârâu, Ventilator, Tunet îndepărtat; sunt incluse automat în presetări, linkul `#mix=`, codul QR și scene.
- **Durata estompării (fade-out) configurabilă** pentru temporizatorul de adormire: 10 s / 30 s (implicit, ca înainte) / 2 min / 5 min; se păstrează în `localStorage` (`asmr_ff_fade`).
- Nota „vezi și” în README (8 limbi): diferența dintre ASMR, CalmWaves, BorderlessMelodies și Aurora; aplicațiile NU au fost fuzionate.
- README (8 limbi): linii „Stare: stabil”, „Offline: complet”; secțiuni noi; istoric.
- Test nou `tests/layers-fade-v21.test.mjs` (19 verificări: straturi, 8 limbi, estompare măsurată pe nodul de câștig, persistență).

### Neimplementat
- Fuziunea cu CalmWaves/Aurora/BorderlessMelodies (recenzia o sugera): omisă intenționat; doar notă „vezi și”.
- Temporizatorul de oprire exista deja (15–90 min + durată proprie 1–480 min) și avea estompare fixă de 30 s; s-a adăugat doar configurabilitatea. „Mai multe sunete”: adăugate 3; lista nu e exhaustivă.
- Lista de straturi din secțiunea „Funcții” a README-urilor nu a fost rescrisă (noile straturi sunt descrise în secțiunea nouă).

## 2.0.0
- Versiunea anterioară (vezi istoricul din README).
