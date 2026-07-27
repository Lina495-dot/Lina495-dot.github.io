# ME LIVING Guest Guide

## Projektstruktur

- `index.html` – zentrale Sprachauswahl
- `de/`, `en/`, `nl/` – eigenständige Sprachversionen
- `assets/css/guide.css` – gemeinsames Design des Gästeguides
- `assets/css/home.css` – gemeinsames Design der Unterkunftsübersichten
- `assets/css/language.css` – Design der Sprachauswahl
- `assets/js/app.js` – Menü und Jahreszahl
- `assets/js/language.js` – unverbindliche Browser-Sprachmarkierung
- `assets/images/logo/` – Logos und Favicon

## Wichtige technische Änderungen

- CSS aus den HTML-Dateien ausgelagert
- JavaScript zentralisiert
- doppelte Codes reduziert
- mobile Touchflächen und Tastaturfokus verbessert
- reduzierte Animationen werden über die Geräteeinstellung respektiert
- WhatsApp-Link auf Martins Nummer korrigiert
- bestehende QR-Code-URL `/villa-am-kurpark.html` bleibt gültig

## Veröffentlichung mit GitHub Desktop

1. Den gesamten Inhalt dieses Ordners in den geklonten Repository-Ordner kopieren.
2. Vorhandene Dateien ersetzen.
3. Auch die neuen Ordner `assets`, `de`, `en` und `nl` mitkopieren.
4. GitHub Desktop öffnen.
5. Summary: `Phase 7 technische Modernisierung`
6. `Commit to main`
7. `Push origin`

Wichtig: Nicht nur einzelne HTML-Dateien kopieren. Die CSS-, JS- und Logo-Ordner werden für die Darstellung benötigt.


## Live-Wetter und Veranstaltungen

- `assets/js/weather.js` lädt aktuelle Wetterdaten für Bad Salzuflen über Open-Meteo.
- `assets/js/events.js` zeigt ausgewählte offizielle Veranstaltungshighlights und blendet vergangene Termine automatisch aus.
- Der Button unter den Veranstaltungen führt zum vollständigen offiziellen Veranstaltungskalender.
- Für das Live-Wetter benötigt der Gast eine Internetverbindung.
- Veranstaltungshighlights sollten regelmäßig ergänzt werden; der offizielle Kalenderlink bleibt immer aktuell.


## Sichtbarkeitskorrektur
- Wetter und Veranstaltungen stehen jetzt direkt unter dem Schnellzugriff.
- Ein zusätzlicher Schnellzugriff führt zum Bereich.
- Veranstaltungskarten sind als statische Absicherung bereits im HTML sichtbar.
- Versionsparameter verhindern, dass Browser alte CSS- oder JavaScript-Dateien aus dem Cache laden.


## Guest Guide 3.0

Neu hinzugefügt:
- interaktive OpenStreetMap-Karte mit Kategorien und Google-Maps-Links
- digitale Gästekarte mit Kopierfunktionen für WLAN und Passwort
- Schritt-für-Schritt-Anreise- und Check-in-Assistent
- installierbare Progressive Web App (PWA)
- Offline-Grundfunktion über Service Worker
- zentrale Unterkunftskonfiguration in `assets/data/villa-am-kurpark.js`

Wichtig:
- Die Karte benötigt beim ersten Laden Internet.
- Persönliche Türcodes werden bewusst nicht in der zentralen Konfiguration gespeichert.
- Änderungen an WLAN, Adresse, Kontakten und Kartenorten können künftig zentral in `assets/data/villa-am-kurpark.js` vorgenommen werden.


## Neues Logo als SVG

- `ME_LIVING_logo_dark.svg` – transparentes Logo für dunkle Hintergründe
- `ME_LIVING_logo_light.svg` – transparente Variante für helle Hintergründe
- `ME_LIVING_logo_full.svg` – vollständige Variante mit schwarzem Hintergrund
- Favicon und PWA-App-Icons wurden auf das neue Logo abgestimmt.
- Alte Logo-Verweise und das zuvor eingebettete Header-Logo wurden ersetzt.


## Logo-Korrektur

Das Logo wird jetzt als originale PNG-Datei eingebunden:
`assets/images/logo/ME_LIVING_logo_final.png`

Die vorherige automatisch vektorisierte SVG-Version wird nicht mehr verwendet.
Eine neue Service-Worker-Cache-Version verhindert, dass weiterhin das alte Logo erscheint.


## Version 4.0 – Boutique-Hotel-Redesign

Vollständig umgesetzt:
- Schwarz-, Champagner-Gold-, Ivory- und Stone-Farbwelt
- neues ME-LIVING-Logo in Header, Hero und Footer
- Cormorant Garamond für Überschriften und Inter für Fließtext
- zweispaltiger Hero mit digitalem Concierge-Auftritt
- einheitliche Premium-Karten, Buttons, Icons, Schatten und Rundungen
- Wetterkarte und Veranstaltungen im Hotel-Event-Stil
- Self Check-In als visuelle Timeline
- digitale Gästekarte in Member-Card-/Goldfolie-Optik
- angepasste Kartenmarker und Pop-ups
- Concierge-Kontaktbereich
- dezente Scroll-Animationen mit Unterstützung für reduzierte Bewegung
- neue PWA-Farben, Icons und Cache-Version

Alle Funktionen und bestehenden Sprachversionen bleiben erhalten.


## Installationsbutton korrigiert

Der Button „Zum Startbildschirm hinzufügen“ funktioniert jetzt browserübergreifend:

- Android/Chrome: öffnet den nativen Installationsdialog, sofern verfügbar.
- Windows/macOS mit unterstütztem Browser: öffnet den nativen Installationsdialog.
- iPhone/iPad: zeigt eine Anleitung über Teilen → Zum Home-Bildschirm.
- Nicht unterstützte Browser: zeigen eine passende manuelle Anleitung.
- Ist die PWA bereits installiert, wird dies angezeigt.


## Version 5.0

- komplett neues Schwarz-Gold-Boutique-Design
- transparentes ME-LIVING-Logo ohne schwarzen Bildkasten
- überarbeitete Start- und Sprachseiten
- neuer Hero, Header, Buttons, Karten und Footer
- Self Check-In als Timeline
- Wetter, Veranstaltungen, Gästekarte, Karte und Empfehlungen neu gestaltet
- Installationsbutton browserübergreifend korrigiert
- PWA-Theme, Icons und Cache aktualisiert
- deutsche, englische und niederländische Version erhalten


## ME LIVING Concierge 6.0 – neue Startseite

- zentrale dreisprachige Startseite
- Standortauswahl: Bad Salzuflen, Bad Pyrmont, Lemgo und Hameln
- Unterkunftsübersicht inklusive Hauptallee- und Brake-Gebäudegruppen
- Villa am Kurpark ist bereits aktiv verlinkt
- weitere Guides sind sichtbar als „wird eingerichtet“
- keine sicherheitsrelevanten Informationen auf der öffentlichen Startseite
- `.git` ist bewusst nicht im Update-Paket enthalten


## ME LIVING Guide 6.1 – Brunnenstraße

- Brunnenstraße in Deutsch, Englisch und Niederländisch
- neues Herzstück „Was möchten Sie tun?“
- Bereiche: Ankunft, Unterkunft, Essen & Trinken, Freizeit, Hilfe und Abreise
- öffentlicher Bereich enthält keine WLAN-Passwörter, Türcodes oder Schlüsselinformationen
- privater Gastbereich wird über den persönlichen Gastlink angekündigt
- Parken am Rathaus und Rauchstraße
- zwei große Balkone, Innenstadtlage und Waschmaschine
- Brunnenstraße ist auf der zentralen Startseite aktiviert


## ME LIVING Guide 6.2 – Mein Aufenthalt

Umgesetzt:
- eigene Login-Seite „Mein Aufenthalt“
- Nachname und fünfstellige Postleitzahl
- Deutsch, Englisch und Niederländisch
- alle privaten Buttons der Brunnenstraße führen zur Login-Seite
- vorbereitetes Dashboard für WLAN, Unterkunft, Geräte, Waschmaschine, Müll und Abreise
- keine Buchungs-, WLAN- oder Zugangsdaten in öffentlichen Dateien
- vorbereiteter sicherer Endpunkt `/api/guest-access`

Noch erforderlich:
- geschützte serverseitige Datenquelle bzw. Buchungssystem-Anbindung
- ohne diese Anbindung zeigt die Maske bewusst keinen privaten Inhalt und täuscht keine Anmeldung vor
