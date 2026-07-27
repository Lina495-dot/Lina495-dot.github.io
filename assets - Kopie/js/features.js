
document.addEventListener("DOMContentLoaded", () => {
  const config = window.ME_LIVING_CONFIG;
  if (!config) return;
  const lang = document.documentElement.lang || "de";
  const toast = document.querySelector("[data-toast]");
  const words = {
    de:{copied:"Kopiert",all:"Alle",accommodation:"Unterkunft",parking:"Parken",cafe:"Cafés",restaurant:"Restaurants",wellness:"Wellness",sight:"Sehenswert",shopping:"Einkaufen",maps:"Google Maps"},
    en:{copied:"Copied",all:"All",accommodation:"Accommodation",parking:"Parking",cafe:"Cafés",restaurant:"Restaurants",wellness:"Wellness",sight:"Sights",shopping:"Shopping",maps:"Google Maps"},
    nl:{copied:"Gekopieerd",all:"Alles",accommodation:"Accommodatie",parking:"Parkeren",cafe:"Cafés",restaurant:"Restaurants",wellness:"Wellness",sight:"Bezienswaardigheden",shopping:"Winkelen",maps:"Google Maps"}
  };
  const t = words[lang] || words.de;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1800);
  };

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.copy;
      const values = {
        wifi: config.property.wifiName,
        password: config.property.wifiPassword,
        address: config.property.address
      };
      try {
        await navigator.clipboard.writeText(values[key] || "");
        showToast(t.copied);
      } catch {
        showToast(values[key] || "");
      }
    });
  });

  // Arrival assistant
  const steps = [...document.querySelectorAll(".assistant-step")];
  const dots = [...document.querySelectorAll(".progress-dot")];
  let currentStep = 0;
  const renderStep = () => {
    steps.forEach((step,index) => step.classList.toggle("active", index === currentStep));
    dots.forEach((dot,index) => dot.classList.toggle("active", index <= currentStep));
    document.querySelectorAll("[data-assistant-prev]").forEach(btn => btn.disabled = currentStep === 0);
    document.querySelectorAll("[data-assistant-next]").forEach(btn => {
      btn.hidden = currentStep === steps.length - 1;
    });
  };
  document.querySelectorAll("[data-assistant-next]").forEach(btn => btn.addEventListener("click", () => {
    currentStep = Math.min(steps.length - 1, currentStep + 1); renderStep();
  }));
  document.querySelectorAll("[data-assistant-prev]").forEach(btn => btn.addEventListener("click", () => {
    currentStep = Math.max(0, currentStep - 1); renderStep();
  }));
  renderStep();


  // Karte Version 5.1: stabile OpenStreetMap-Einbettung ohne Leaflet.
  const mapEl = document.getElementById("guest-map");
  const listEl = document.querySelector("[data-map-list]");
  const fallback = document.querySelector("[data-map-fallback]");
  const mapToolbar = document.querySelector(".map-toolbar");

  const categoryLabels = {
    all:t.all, accommodation:t.accommodation, parking:t.parking, cafe:t.cafe,
    restaurant:t.restaurant, wellness:t.wellness, sight:t.sight, shopping:t.shopping
  };

  const copyMap = {
    de:{route:"Route",show:"Auf Karte zeigen",fullscreen:"Karte groß öffnen"},
    en:{route:"Route",show:"Show on map",fullscreen:"Open large map"},
    nl:{route:"Route",show:"Op kaart tonen",fullscreen:"Kaart groot openen"}
  };
  const mt = copyMap[lang] || copyMap.de;

  const googleLink = (place) => "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(place.name + " " + place.address);

  const osmLink = (place) =>
    "https://www.openstreetmap.org/?mlat=" + place.lat +
    "&mlon=" + place.lng + "#map=17/" + place.lat + "/" + place.lng;

  const embedUrl = (place) => {
    const lat = Number(place.lat);
    const lng = Number(place.lng);
    const bbox = [lng-.014,lat-.008,lng+.014,lat+.008].join(",");
    return "https://www.openstreetmap.org/export/embed.html?bbox=" +
      encodeURIComponent(bbox) + "&layer=mapnik&marker=" +
      encodeURIComponent(lat + "," + lng);
  };

  let activeCategory = "all";
  let activePlace = config.places.find(p => p.category === "accommodation") || config.places[0];

  const createMapFrame = () => {
    if (!mapEl || !activePlace) return;
    mapEl.innerHTML = "";

    const frame = document.createElement("iframe");
    frame.className = "osm-map-frame";
    frame.title = activePlace.name;
    frame.loading = "eager";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.src = embedUrl(activePlace);
    frame.setAttribute("allowfullscreen", "");
    mapEl.appendChild(frame);

    const controls = document.createElement("div");
    controls.className = "map-overlay-controls";
    controls.innerHTML =
      "<div class='map-active-place'><strong>" + activePlace.name +
      "</strong><small>" + activePlace.address + "</small></div>" +
      "<a class='map-fullscreen-link' target='_blank' rel='noopener' href='" +
      osmLink(activePlace) + "'>" + mt.fullscreen + "</a>";
    mapEl.appendChild(controls);

    if (fallback) fallback.style.display = "none";
  };

  const renderList = () => {
    if (!listEl) return;
    listEl.innerHTML = "";
    listEl.classList.add("map-list-v51");

    config.places
      .filter(place => activeCategory === "all" || place.category === activeCategory)
      .forEach(place => {
        const item = document.createElement("article");
        item.className = "map-place-card" + (activePlace.name === place.name ? " active" : "");
        item.innerHTML =
          "<div class='map-place-content'>" +
          "<span class='map-place-category'>" + (categoryLabels[place.category] || "") + "</span>" +
          "<strong>" + place.name + "</strong><small>" + place.address + "</small></div>" +
          "<div class='map-place-actions'>" +
          "<button type='button'>" + mt.show + "</button>" +
          "<a target='_blank' rel='noopener' href='" + googleLink(place) + "'>" + mt.route + "</a></div>";

        item.querySelector("button").addEventListener("click", () => {
          activePlace = place;
          createMapFrame();
          renderList();
          mapEl.scrollIntoView({behavior:"smooth",block:"center"});
        });
        listEl.appendChild(item);
      });
  };

  if (mapToolbar) {
    mapToolbar.querySelectorAll("[data-map-filter]").forEach(button => {
      button.textContent = categoryLabels[button.dataset.mapFilter] || button.textContent;
      button.addEventListener("click", () => {
        mapToolbar.querySelectorAll("[data-map-filter]").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.dataset.mapFilter;
        const first = config.places.find(place => activeCategory === "all" || place.category === activeCategory);
        if (first) activePlace = first;
        createMapFrame();
        renderList();
      });
    });
  }

  createMapFrame();
  renderList();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../service-worker.js").catch(() => {});
  }
});
