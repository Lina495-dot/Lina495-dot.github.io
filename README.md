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
