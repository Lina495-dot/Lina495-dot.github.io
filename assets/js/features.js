
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

  // Map
  const mapEl = document.getElementById("guest-map");
  const listEl = document.querySelector("[data-map-list]");
  let map;
  let markerLayer;
  const categoryColors = {
    accommodation:"#c6a46a",parking:"#4b78b8",cafe:"#a06c45",restaurant:"#a84b45",
    wellness:"#4a927f",sight:"#64814e",shopping:"#6f5a9e"
  };
  const categoryLabels = {
    all:t.all,accommodation:t.accommodation,parking:t.parking,cafe:t.cafe,
    restaurant:t.restaurant,wellness:t.wellness,sight:t.sight,shopping:t.shopping
  };

  const googleLink = (place) => "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(place.name + " " + place.address);

  const renderList = (category="all") => {
    if (!listEl) return;
    listEl.innerHTML = "";
    config.places.filter(p => category === "all" || p.category === category).forEach(place => {
      const item = document.createElement("div");
      item.className = "map-list-item";
      item.innerHTML = `<span><strong>${place.name}</strong><br><small>${place.address}</small></span>
        <a href="${googleLink(place)}" target="_blank" rel="noopener">${t.maps}</a>`;
      listEl.appendChild(item);
    });
  };

  const renderMarkers = (category="all") => {
    if (!map || !window.L) return;
    markerLayer.clearLayers();
    const selected = config.places.filter(p => category === "all" || p.category === category);
    selected.forEach(place => {
      const color = categoryColors[place.category] || "#18352f";
      const icon = L.divIcon({
        className:"",
        html:`<div class="marker-dot" style="background:${color}"></div>`,
        iconSize:[18,18],iconAnchor:[9,9]
      });
      L.marker([place.lat,place.lng],{icon}).bindPopup(
        `<strong>${place.name}</strong><br>${place.address}<br><a href="${googleLink(place)}" target="_blank" rel="noopener">${t.maps}</a>`
      ).addTo(markerLayer);
    });
    if (selected.length) {
      const bounds = L.latLngBounds(selected.map(p => [p.lat,p.lng]));
      map.fitBounds(bounds.pad(.15), {maxZoom:15});
    }
  };

  if (mapEl && window.L) {
    map = L.map(mapEl,{scrollWheelZoom:false}).setView(config.property.coordinates,14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
      maxZoom:19,attribution:'&copy; OpenStreetMap'
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    renderMarkers();
  } else if (mapEl) {
    mapEl.style.display = "none";
    const fallback = document.querySelector("[data-map-fallback]");
    if (fallback) fallback.style.display = "block";
  }
  renderList();

  document.querySelectorAll("[data-map-filter]").forEach(button => {
    button.textContent = categoryLabels[button.dataset.mapFilter] || button.textContent;
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-map-filter]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderMarkers(button.dataset.mapFilter);
      renderList(button.dataset.mapFilter);
    });
  });

  // PWA install
  let deferredPrompt;
  const installButton = document.querySelector("[data-install-app]");
  const installStatus = document.querySelector("[data-install-status]");
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (installButton) installButton.hidden = false;
  });
  if (installButton) {
    installButton.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        installButton.hidden = true;
      } else if (installStatus) {
        installStatus.hidden = false;
      }
    });
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../service-worker.js").catch(() => {});
  }
});
