
document.addEventListener("DOMContentLoaded", async () => {
  const root = document.querySelector("[data-weather]");
  if (!root) return;

  const lang = document.documentElement.lang || "de";
  const labels = {
    de: {
      loading: "Wetterdaten werden geladen …",
      unavailable: "Das Wetter konnte gerade nicht geladen werden.",
      feels: "Gefühlt",
      wind: "Wind",
      rain: "Niederschlag",
      today: "Heute",
    },
    en: {
      loading: "Loading weather data …",
      unavailable: "Weather data is currently unavailable.",
      feels: "Feels like",
      wind: "Wind",
      rain: "Precipitation",
      today: "Today",
    },
    nl: {
      loading: "Weergegevens worden geladen …",
      unavailable: "Het weer kan momenteel niet worden geladen.",
      feels: "Gevoelstemperatuur",
      wind: "Wind",
      rain: "Neerslag",
      today: "Vandaag",
    }
  };
  const t = labels[lang] || labels.de;

  const descriptions = {
    de: {
      0:"Klar",1:"Überwiegend klar",2:"Teilweise bewölkt",3:"Bewölkt",
      45:"Nebel",48:"Nebel",51:"Leichter Nieselregen",53:"Nieselregen",
      55:"Starker Nieselregen",61:"Leichter Regen",63:"Regen",65:"Starker Regen",
      71:"Leichter Schneefall",73:"Schneefall",75:"Starker Schneefall",
      80:"Leichte Schauer",81:"Regenschauer",82:"Starke Schauer",
      95:"Gewitter",96:"Gewitter mit Hagel",99:"Starkes Gewitter"
    },
    en: {
      0:"Clear",1:"Mostly clear",2:"Partly cloudy",3:"Cloudy",
      45:"Fog",48:"Fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",
      61:"Light rain",63:"Rain",65:"Heavy rain",71:"Light snow",73:"Snow",
      75:"Heavy snow",80:"Light showers",81:"Showers",82:"Heavy showers",
      95:"Thunderstorm",96:"Thunderstorm with hail",99:"Severe thunderstorm"
    },
    nl: {
      0:"Helder",1:"Overwegend helder",2:"Gedeeltelijk bewolkt",3:"Bewolkt",
      45:"Mist",48:"Mist",51:"Lichte motregen",53:"Motregen",55:"Zware motregen",
      61:"Lichte regen",63:"Regen",65:"Zware regen",71:"Lichte sneeuw",73:"Sneeuw",
      75:"Zware sneeuw",80:"Lichte buien",81:"Buien",82:"Zware buien",
      95:"Onweer",96:"Onweer met hagel",99:"Zwaar onweer"
    }
  };

  const iconFor = (code, isDay = 1) => {
    if (code === 0) return isDay ? "☀️" : "🌙";
    if ([1,2].includes(code)) return isDay ? "🌤️" : "☁️";
    if ([3,45,48].includes(code)) return "☁️";
    if ([51,53,55,61,63,65,80,81,82].includes(code)) return "🌧️";
    if ([71,73,75,77,85,86].includes(code)) return "❄️";
    if ([95,96,99].includes(code)) return "⛈️";
    return "🌦️";
  };

  const status = root.querySelector("[data-weather-status]");
  if (status) status.textContent = t.loading;

  const url = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=52.0862&longitude=8.7443" +
    "&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
    "&temperature_unit=celsius&wind_speed_unit=kmh&timezone=Europe%2FBerlin&forecast_days=4";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();

    root.querySelector("[data-weather-icon]").textContent =
      iconFor(data.current.weather_code, data.current.is_day);
    root.querySelector("[data-weather-temp]").textContent =
      `${Math.round(data.current.temperature_2m)}°`;
    root.querySelector("[data-weather-condition]").textContent =
      (descriptions[lang] || descriptions.de)[data.current.weather_code] || "—";
    root.querySelector("[data-weather-feels]").textContent =
      `${Math.round(data.current.apparent_temperature)} °C`;
    root.querySelector("[data-weather-wind]").textContent =
      `${Math.round(data.current.wind_speed_10m)} km/h`;
    root.querySelector("[data-weather-rain]").textContent =
      `${Number(data.current.precipitation).toFixed(1)} mm`;

    const locale = lang === "nl" ? "nl-NL" : lang === "en" ? "en-GB" : "de-DE";
    const forecast = root.querySelector("[data-weather-forecast]");
    forecast.innerHTML = "";

    data.daily.time.forEach((date, index) => {
      const day = document.createElement("div");
      day.className = "forecast-day";
      const label = index === 0
        ? t.today
        : new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(`${date}T12:00:00`));
      day.innerHTML = `
        <small>${label}</small>
        <span class="forecast-icon">${iconFor(data.daily.weather_code[index], 1)}</span>
        <strong>${Math.round(data.daily.temperature_2m_max[index])}° / ${Math.round(data.daily.temperature_2m_min[index])}°</strong>
      `;
      forecast.appendChild(day);
    });

    if (status) status.remove();
  } catch (error) {
    if (status) status.textContent = t.unavailable;
  }
});
