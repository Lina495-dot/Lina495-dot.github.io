
document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-events]");
  if (!root) return;

  const events = [{"title": "Rundgang durch die historische Altstadt", "start": "2026-07-29", "end": "2026-12-26", "description_de": "Geführter Rundgang durch die historische Kurstadt.", "description_en": "Guided walk through the historic spa town.", "description_nl": "Rondleiding door de historische kuurstad.", "url": "https://www.staatsbad-salzuflen.de/stadterlebnis/veranstaltungskalender/unsere-veranstaltungs-highlights"}, {"title": "Weinfest", "start": "2026-08-06", "end": "2026-08-09", "description_de": "Weinfest auf dem Salzhof im Herzen der Altstadt.", "description_en": "Wine festival at Salzhof in the heart of the old town.", "description_nl": "Wijnfeest op de Salzhof in het hart van de oude binnenstad.", "url": "https://www.staatsbad-salzuflen.de/e-weinfest-1"}, {"title": "Nachtflohmarkt", "start": "2026-08-22", "end": "2026-08-22", "description_de": "Abendlicher Flohmarkt in der Altstadt.", "description_en": "Evening flea market in the historic town centre.", "description_nl": "Avondvlooienmarkt in de historische binnenstad.", "url": "https://www.staatsbad-salzuflen.de/stadterlebnis/veranstaltungskalender/unsere-veranstaltungs-highlights"}, {"title": "Matti Klein Soul Trio & Max Mutzke", "start": "2026-08-29", "end": "2026-08-29", "description_de": "Live-Konzert mit Soul, Saxophon, Piano und Gesang.", "description_en": "Live concert featuring soul, saxophone, piano and vocals.", "description_nl": "Liveconcert met soul, saxofoon, piano en zang.", "url": "https://www.staatsbad-salzuflen.de/stadterlebnis/veranstaltungskalender/unsere-veranstaltungs-highlights"}, {"title": "Tanztee", "start": "2026-08-30", "end": "2026-12-20", "description_de": "Standard- und lateinamerikanische Tänze im Gala-Saal des Kurhauses.", "description_en": "Ballroom and Latin dancing in the Kurhaus gala hall.", "description_nl": "Standaard- en Latijns-Amerikaanse dansen in de galazaal van het Kurhaus.", "url": "https://www.staatsbad-salzuflen.de/stadterlebnis/veranstaltungskalender/unsere-veranstaltungs-highlights"}, {"title": "Nacht der 10.000 Kerzen", "start": "2026-09-04", "end": "2026-09-05", "description_de": "Kerzen, Lampions und Musik schaffen ein besonderes Ambiente.", "description_en": "Candles, lanterns and music create a special atmosphere.", "description_nl": "Kaarsen, lampions en muziek zorgen voor een bijzondere sfeer.", "url": "https://www.staatsbad-salzuflen.de/stadterlebnis/veranstaltungskalender/unsere-veranstaltungs-highlights"}];
  const lang = document.documentElement.lang || "de";
  const labels = {
    de: { more:"Mehr erfahren", empty:"Zurzeit sind keine der ausgewählten Highlight-Veranstaltungen eingetragen.", months:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"] },
    en: { more:"Learn more", empty:"There are currently no selected highlight events listed.", months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
    nl: { more:"Meer informatie", empty:"Er zijn momenteel geen geselecteerde evenementen opgenomen.", months:["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"] }
  };
  const t = labels[lang] || labels.de;
  const today = new Date();
  today.setHours(0,0,0,0);

  const upcoming = events
    .filter(event => new Date(event.end + "T23:59:59") >= today)
    .sort((a,b) => new Date(a.start) - new Date(b.start))
    .slice(0,4);

  const list = root.querySelector("[data-events-list]");
  const empty = root.querySelector("[data-events-empty]");
  list.innerHTML = "";

  if (!upcoming.length) {
    empty.textContent = t.empty;
    return;
  }

  empty.remove();

  upcoming.forEach(event => {
    const date = new Date(event.start + "T12:00:00");
    const day = String(date.getDate()).padStart(2,"0");
    const month = t.months[date.getMonth()];
    const description = event["description_" + lang] || event.description_de;

    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-date"><strong>${day}</strong><small>${month}</small></div>
      <div class="event-content">
        <h4>${event.title}</h4>
        <p>${description}</p>
        <a class="event-link" href="${event.url}" target="_blank" rel="noopener">${t.more}</a>
      </div>
    `;
    list.appendChild(card);
  });
});
