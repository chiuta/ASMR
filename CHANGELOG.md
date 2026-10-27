# Jurnal de modificări — ASMR fără frontiere

Format: [SemVer](https://semver.org/lang/ro/) MAJOR.MINOR.PATCH.

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
