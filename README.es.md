# ASMR fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versión:** 1.2.0 · **Última actualización:** 2026-10-19

Idiomas de la interfaz: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Paisajes sonoros, desencadenantes táctiles y pulsos binaurales, sintetizados en local en el navegador, en un único archivo HTML.

**En línea:** https://chiuta.github.io/ASMR/

![Captura de pantalla](screenshot.png)

## Qué es

Un mezclador de sonidos para relajarse, escrito en JavaScript sencillo. El sonido no se reproduce a partir de archivos de audio: se genera en tiempo real mediante la Web Audio API. La aplicación reúne capas de ambiente combinables, sonidos breves activados al tocar, efectos visuales interactivos, pulsos binaurales y un temporizador para dormir.

## Funciones

- **Paisajes sonoros** (capas combinables, cada una con su propio volumen): Lluvia, Olas del océano, Hoguera, Viento, Noche con grillos, Ruido blanco, Ruido rosa, Ruido marrón.
- **Desencadenantes**: Golpeteo en madera, Golpeteo en cristal, Golpeteo en mesa, Gota de agua, Página pasada, Clic de teclado, Crujido de papel y Cepillado (textura continua mientras lo mantienes pulsado).
- **Efectos visuales ASMR**: Arena cinética, Plástico de burbujas, Tinta en el agua, Hielo que se agrieta, Patrón simétrico, Ondas de luz; botón **Limpiar**.
- **Pulsos binaurales**: las bandas Delta, Theta, Alpha y Beta, con volumen separado y botón **Iniciar**. La aplicación recomienda auriculares estéreo.
- **Temporizador para dormir**: 15, 30, 45, 60 o 90 min, o «Apagado»; muestra el tiempo restante.
- **Preajustes**: seis preajustes integrados (Lluvia nocturna, Tormenta en el océano, Hoguera, Concentración, Conciliar el sueño, Calma) y preajustes propios, guardados con un nombre (máximo 24 caracteres).
- **Mezcla compartible mediante enlace**: «Copiar el enlace de la mezcla» genera una dirección con `#mix=…` (las capas activas con su volumen y, si está activada, la banda binaural). Quien abre el enlace ve el botón «Reproducir la mezcla del enlace»; el sonido no se inicia solo. Los valores del enlace se validan (solo capas conocidas, volumen 1–100). Los preajustes muestran mensajes de estado (falta el nombre, guardado, enlace copiado).
- Botón **Pausar todo / Reproducir todo** y **Volumen general**; botón **Detener todas las capas** (lleva las capas a 0 y detiene los pulsos binaurales).
- Temporizador con **duración personalizada** (1–480 min, con mensaje de error si el valor no es válido); el temporizador tiene el rol `timer` para los lectores de pantalla.
- El preajuste **Última combinación**: la última mezcla con al menos una capa o con pulsos activos se conserva automáticamente y se puede retomar con un clic.
- Atajos globales: **Espacio** o **P** = pausa/reproducción, **+** / **−** = volumen general (±5), cuando el foco no está en un campo o botón.
- Las teclas Intro y Espacio activan los desencadenantes cuando tienen el foco.

## Novedades (v1.1.0)

- **Grabación WAV de la mezcla actual**: captura en tiempo real la salida de la aplicación (las capas activas, los pulsos binaurales y los desencadenantes tocados durante ese tiempo), estéreo, 16 bits, durante la duración elegida (15 s – 5 min) o hasta «Detener y guardar»; el archivo `asmr-mix-*.wav` se descarga al final. Sin sonido activo se niega con un mensaje. Límite: la grabación dura lo que dura el sonido (tiempo real, no renderizado acelerado) y usa `ScriptProcessorNode`; si el navegador no lo tiene, aparece un mensaje.
- **QR para la mezcla**: genera un código QR con los niveles de las capas (y los pulsos binaurales) y puede leerlo de nuevo desde una imagen o desde texto pegado; el QR sin enlace web contiene solo `#mix=…`. Una imagen sin QR no cambia nada.
- **Guía vocal de respiración** (`FFF.tts`): dice «Inspira» (4 s) y «Espira» (6 s) a ritmo lento, con texto visible y `aria-pressed`; sin síntesis de voz aparece un mensaje. No es una indicación médica.
- **Kit**: Transparencia y copia `.fff.json` (los preajustes están indexados), módulos `core, label, bundle, qr, tts`.
- **Idiomas y traducciones**: la aplicación tiene la interfaz solo en rumano; los textos nuevos están en rumano. El cuadro «Transparencia» del kit está en 8 idiomas (traducciones automáticas, **no verificadas por hablantes nativos**).

## Guía de uso

1. Abre la página y toca cualquier control: el navegador exige un gesto del usuario antes de reproducir audio.
2. En «Paisajes sonoros», sube el control deslizante de una o varias capas; ajusta el «Volumen general».
3. En «Desencadenantes», toca un botón para un sonido breve; en «Cepillado», mantén pulsado el tiempo que quieras la textura.
4. En «Efectos visuales ASMR», elige un efecto e interactúa con él; «Limpiar» lo restablece.
5. En «Pulsos binaurales», elige la banda (Delta, Theta, Alpha o Beta), ajusta el volumen y pulsa **Iniciar**.
6. Para dormir, elige la duración en «Temporizador para dormir»; el sonido se detiene al expirar el tiempo. «Apagado» cancela el temporizador.
7. En «Preajustes», pulsa un preajuste integrado o escribe un nombre (Intro o **Guardar**) para guardar tu combinación actual de capas y la banda binaural activa.
8. **Pausar todo** detiene temporalmente todos los sonidos; el mismo botón los reanuda.

## Advertencia

Contenido informativo y de relajación; no sustituye el consejo médico. Las descripciones de las bandas binaurales (Delta, Theta, Alpha, Beta) son asociaciones populares; las pruebas científicas de su efecto sobre el sueño, la concentración o el estado de ánimo son limitadas, y la aplicación no es un producto sanitario ni trata ninguna afección. Mantén el volumen en un nivel cómodo; si tienes epilepsia, acúfenos u otra afección, consulta a un médico antes de un uso prolongado.

## Privacidad y red

- El kit «sin fronteras» (`fff-kit`, módulos `core, label, bundle, qr, tts`) está incorporado en `index.html`: no realiza solicitudes de red. El cuadro «Transparencia» (clic en la versión) muestra la red declarada (0 solicitudes externas), las claves de `localStorage`, el SHA-256 del archivo y ofrece una copia de seguridad `.fff.json` (opcionalmente cifrada con contraseña, AES-GCM). Los códigos QR se generan y se leen en local; la lectura se hace solo desde una imagen elegida por el usuario, sin cámara.

- **Almacenamiento local (localStorage):** dos claves: `asmr_ff_presets` (tus preajustes guardados: nombre, niveles de las capas, banda binaural) y `asmr_ff_last` (la última combinación: niveles y banda, sin nombre). Si el navegador bloquea el almacenamiento, los preajustes permanecen solo en memoria hasta recargar.
- **Red:** en el código no hay solicitudes de red (`fetch`), ni scripts, fuentes o imágenes cargados desde el exterior, ni enlaces externos. No hay analítica.

## Ejecución local / sin conexión

Descarga `index.html` y ábrelo en un navegador; no necesita internet. Se necesita un navegador con compatibilidad con la Web Audio API y JavaScript activado.

## Historial / Changelog

- 1.1.1 — 2026-10-18: la importación de un paquete `.fff.json` fusiona los preajustes importados con los propios (mismo nombre = reemplazado por el del archivo; tope de 50) en lugar de borrarlos; pruebas.
- 1.1.0 — 2026-10-14: grabación WAV, QR para la mezcla, guía vocal de respiración, kit «sin fronteras». Pruebas: `tests/fff-r8.test.mjs`.

### 12 de octubre de 2026 (v1.0.0)
- 1.0.0 — 2026-10-12: la versión y la fecha de la última actualización se muestran en la aplicación

### 11 de octubre de 2026 (tercera entrada)
- Mezcla compartible mediante enlace, aplicada solo al pulsar un botón; mensajes de estado en los preajustes (antes, guardar sin nombre no daba ninguna respuesta).

### 11 de octubre de 2026
- Novedad: duración personalizada del temporizador, «Detener todas las capas», preajuste «Última combinación», atajos de teclado; CSP con hash para el script (sin `'unsafe-inline'` en los scripts). Captura de pantalla actualizada.
- Añadida una CSP estricta (sin red, sin recursos externos); verificación: axe 0 infracciones, sin errores en la consola, sin desbordamiento horizontal a 360 px.
- La calidad del sonido sintetizado no puede evaluarse automáticamente; sin cambios en esta ronda.

## Licencia

MIT para el código y la estructura de la aplicación — véase el archivo `LICENSE`. Las eventuales bibliotecas de terceros incluidas en el archivo conservan sus propias licencias.

La aplicación en sí contiene solo la mención: «El archivo es tuyo. 100 % local — sin cuenta, sin telemetría, sin servidor.»

## Autor

Alexio — Alexandru-Ionuț Chiuță. Contacto: alexio@trom.tf

## Resumen

ASMR fără frontiere es un mezclador de sonidos ASMR de un solo archivo: paisajes sonoros por capas (lluvia, océano, fuego, viento, grillos, ruido blanco/rosa/marrón), desencadenantes táctiles, efectos visuales interactivos, pulsos binaurales (Delta/Theta/Alpha/Beta) y un temporizador para dormir, todo sintetizado en directo con la Web Audio API. No realiza solicitudes de red; solo los preajustes guardados por el usuario se conservan en localStorage. La interfaz está en rumano. Licencia: MIT.

Auditoría: 2026-10-10 — código verificado (sin solicitudes de red), accesibilidad (axe) y funcionamiento; añadida una advertencia.
