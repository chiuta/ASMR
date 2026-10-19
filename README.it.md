# ASMR fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versione:** 1.1.1 · **Ultimo aggiornamento:** 2026-10-18

Paesaggi sonori, stimoli tattili e battiti binaurali, sintetizzati in locale nel browser, in un unico file HTML.

**Online:** https://chiuta.github.io/ASMR/

![Schermata](screenshot.png)

## Che cos'è

Un mixer di suoni per il relax, scritto in JavaScript semplice. Il suono non viene riprodotto da file audio: è generato in tempo reale tramite la Web Audio API. L'app riunisce strati di ambiente combinabili, suoni brevi attivati al tocco, effetti visivi interattivi, battiti binaurali e un timer per addormentarsi.

## Funzioni

- **Paesaggi sonori** (strati combinabili, ciascuno con il proprio volume): Pioggia, Onde dell'oceano, Falò, Vento, Notte con grilli, Rumore bianco, Rumore rosa, Rumore marrone.
- **Stimoli**: Picchiettio sul legno, Picchiettio sul vetro, Picchiettio sul tavolo, Goccia d'acqua, Pagina voltata, Clic di tastiera, Fruscio di carta e Spazzolatura (texture continua finché tieni premuto).
- **Effetti visivi ASMR**: Sabbia cinetica, Pluriball, Inchiostro nell'acqua, Ghiaccio che si crepa, Motivo simmetrico, Onde di luce; pulsante **Pulisci**.
- **Battiti binaurali**: le bande Delta, Theta, Alpha e Beta, con volume separato e pulsante **Avvia**. L'app consiglia cuffie stereo.
- **Timer per addormentarsi**: 15, 30, 45, 60 o 90 min, oppure «Spento»; visualizzazione del tempo rimanente.
- **Preset**: sei preset integrati (Pioggia notturna, Tempesta sull'oceano, Falò, Concentrazione, Addormentamento, Quiete) e preset personali, salvati con un nome (massimo 24 caratteri).
- **Mix condivisibile tramite link**: «Copia il link del mix» genera un indirizzo con `#mix=…` (gli strati attivi con volume e, se attiva, la banda binaurale). Chi apre il link vede il pulsante «Riproduci il mix dal link»; il suono non parte da solo. I valori nel link sono convalidati (solo strati noti, volume 1–100). I preset mostrano messaggi di stato (nome mancante, salvato, link copiato).
- Pulsante **Pausa tutto / Riproduci tutto** e **Volume generale**; pulsante **Ferma tutti gli strati** (porta gli strati a 0 e ferma i battiti binaurali).
- Timer con **durata personalizzata** (1–480 min, con messaggio di errore per un valore non valido); il timer ha il ruolo `timer` per gli screen reader.
- Il preset **Ultima combinazione**: l'ultimo mix con almeno uno strato o i battiti attivi viene conservato automaticamente e si può riprendere con un clic.
- Scorciatoie globali: **Spazio** o **P** = pausa/riproduzione, **+** / **−** = volume generale (±5), quando il focus non è su un campo o un pulsante.
- I tasti Invio e Spazio attivano gli stimoli quando questi hanno il focus.

## Novità (v1.1.0)

- **Registrazione WAV del mix corrente**: cattura in tempo reale l'uscita dell'app (gli strati attivi, i battiti binaurali e gli stimoli toccati nel frattempo), stereo, 16 bit, per la durata scelta (15 s – 5 min) o fino a «Ferma e salva»; il file `asmr-mix-*.wav` viene scaricato alla fine. Senza suono attivo rifiuta con un messaggio. Limite: la registrazione dura quanto il suono (tempo reale, non rendering accelerato) e usa `ScriptProcessorNode`; se il browser non lo ha, compare un messaggio.
- **QR per il mix**: genera un codice QR con i livelli degli strati (e i battiti binaurali) e può rileggerlo da un'immagine o da un testo incollato; il QR senza collegamento web contiene solo `#mix=…`. Un'immagine senza QR non modifica nulla.
- **Guida vocale del respiro** (`FFF.tts`): pronuncia «Inspira» (4 s) ed «Espira» (6 s) a ritmo lento, con testo visibile e `aria-pressed`; senza sintesi vocale compare un messaggio. Non è un'indicazione medica.
- **Kit**: Trasparenza e copia `.fff.json` (i preset sono indicizzati), moduli `core, label, bundle, qr, tts`.
- **Lingue e traduzioni**: l'app ha l'interfaccia solo in rumeno; i nuovi testi sono in rumeno. La finestra «Trasparenza» del kit è in 8 lingue (traduzioni automatiche, **non verificate da madrelingua**).

## Guida all'uso

1. Apri la pagina e tocca un controllo qualsiasi: il browser richiede un gesto dell'utente prima di riprodurre l'audio.
2. In «Paesaggi sonori» alza il cursore di uno o più strati; regola il «Volume generale».
3. In «Stimoli» tocca un pulsante per un suono breve; per «Spazzolatura» tieni premuto per quanto vuoi la texture.
4. In «Effetti visivi ASMR» scegli un effetto e interagisci con esso; «Pulisci» lo reimposta.
5. In «Battiti binaurali» scegli la banda (Delta, Theta, Alpha o Beta), regola il volume e premi **Avvia**.
6. Per addormentarti, scegli la durata in «Timer per addormentarsi»; il suono si ferma allo scadere del tempo. «Spento» annulla il timer.
7. In «Preset» premi un preset integrato oppure scrivi un nome (Invio o **Salva**) per salvare la tua combinazione corrente di strati e la banda binaurale attiva.
8. **Pausa tutto** ferma temporaneamente tutti i suoni; lo stesso pulsante li riprende.

## Avvertenza

Contenuto informativo e di relax; non sostituisce la consulenza medica. Le descrizioni delle bande binaurali (Delta, Theta, Alpha, Beta) sono associazioni popolari; le prove scientifiche sul loro effetto su sonno, concentrazione o umore sono limitate, e l'app non è un dispositivo medico e non cura alcuna condizione. Tieni il volume a un livello confortevole; se hai epilessia, acufene o un'altra condizione, chiedi il parere di un medico prima di un uso prolungato.

## Privacy e rete

- Il kit «senza frontiere» (`fff-kit`, moduli `core, label, bundle, qr, tts`) è incorporato in `index.html`: non effettua richieste di rete. La finestra «Trasparenza» (clic sulla versione) mostra la rete dichiarata (0 richieste esterne), le chiavi di `localStorage`, lo SHA-256 del file e offre una copia di sicurezza `.fff.json` (facoltativamente cifrata con password, AES-GCM). I codici QR vengono generati e letti in locale; la lettura avviene solo da un'immagine scelta dall'utente, senza fotocamera.

- **Archiviazione locale (localStorage):** due chiavi: `asmr_ff_presets` (i tuoi preset salvati: nome, livelli degli strati, banda binaurale) e `asmr_ff_last` (l'ultima combinazione: livelli e banda, senza nome). Se il browser blocca l'archiviazione, i preset restano solo in memoria fino al ricaricamento.
- **Rete:** nel codice non ci sono richieste di rete (`fetch`), né script, font o immagini caricati dall'esterno, né link esterni. Non c'è analytics.

## Esecuzione locale / offline

Scarica `index.html` e aprilo nel browser; non ha bisogno di internet. Serve un browser con supporto alla Web Audio API e JavaScript attivo.

## Cronologia / Changelog

- 1.1.1 — 2026-10-18: l'importazione di un pacchetto `.fff.json` unisce i preset importati a quelli propri (stesso nome = sostituito con quello del file; tetto di 50) invece di cancellarli; test.
- 1.1.0 — 2026-10-14: registrazione WAV, QR per il mix, guida vocale del respiro, kit «senza frontiere». Test: `tests/fff-r8.test.mjs`.

### 12 ottobre 2026 (v1.0.0)
- 1.0.0 — 2026-10-12: la versione e la data dell'ultimo aggiornamento sono mostrate nell'app

### 11 ottobre 2026 (terza voce)
- Mix condivisibile tramite link, applicato solo alla pressione di un pulsante; messaggi di stato per i preset (prima il salvataggio senza nome non dava alcuna risposta).

### 11 ottobre 2026
- Novità: durata personalizzata per il timer, «Ferma tutti gli strati», preset «Ultima combinazione», scorciatoie da tastiera; CSP con hash per lo script (senza `'unsafe-inline'` per gli script). Screenshot aggiornato.
- Aggiunta una CSP rigorosa (senza rete, senza risorse esterne); verifica: axe 0 violazioni, nessun errore in console, nessuno sforamento orizzontale a 360 px.
- La qualità del suono sintetizzato non può essere valutata automaticamente; invariata in questo giro.

## Licenza

MIT per il codice e la struttura dell'app — vedi il file `LICENSE`. Le eventuali librerie di terzi incluse nel file mantengono le proprie licenze.

L'app stessa contiene solo la dicitura: «Il file è tuo. 100% locale — senza account, senza telemetria, senza server.»

## Autore

Alexio — Alexandru-Ionuț Chiuță. Contatto: alexio@trom.tf

## Riepilogo

ASMR fără frontiere è un mixer di suoni ASMR in un unico file: paesaggi sonori a strati (pioggia, oceano, fuoco, vento, grilli, rumore bianco/rosa/marrone), stimoli tattili, effetti visivi interattivi, battiti binaurali (Delta/Theta/Alpha/Beta) e un timer per addormentarsi, il tutto sintetizzato dal vivo con la Web Audio API. Non effettua richieste di rete; in localStorage vengono conservati solo i preset salvati dall'utente. L'interfaccia è in rumeno. Licenza: MIT.

Audit: 2026-10-10 — codice verificato (nessuna richiesta di rete), accessibilità (axe) e funzionamento; aggiunta l'avvertenza.
