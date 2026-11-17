(() => {
  "use strict";

  // Set a name and coordinates here only if you want a manual fallback location.
  const WEATHER_CONFIG = {
    fallbackLocation: {
      name: "",
      latitude: null,
      longitude: null,
    },
    refreshIntervalMs: 30 * 60 * 1000,
  };

  const WEATHER_DESCRIPTIONS = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    97: "Heavy thunderstorm",
    99: "Thunderstorm with heavy hail",
  };

  const clockTime = document.getElementById("clock-time");
  const clockPeriod = document.getElementById("clock-period");
  const currentDate = document.getElementById("current-date");
  const weatherInfo = document.getElementById("weather-info");
  const greetingLabel = document.querySelector(".greet-1");

  const clockFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  });

  let clockTimerId;
  let dateTimerId;
  let greetingTimerId;
  let lastWeatherAttemptAt = 0;
  let weatherRequest = null;

  function getPart(formatter, date, type) {
    return formatter.formatToParts(date).find((part) => part.type === type)
      .value;
  }

  function getLocalDateTime(date) {
    const pad = (value) => String(value).padStart(2, "0");
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
  }

  function updateClock() {
    window.clearTimeout(clockTimerId);

    const now = new Date();
    const hour = getPart(clockFormatter, now, "hour");
    const minute = getPart(clockFormatter, now, "minute");
    const second = getPart(clockFormatter, now, "second");
    const period = getPart(clockFormatter, now, "dayPeriod").toUpperCase();

    clockTime.textContent = `${hour}:${minute}:${second}`;
    clockTime.dateTime = getLocalDateTime(now);
    clockPeriod.textContent = period;
    clockPeriod.style.color = `var(--${period === "AM" ? "am" : "pm"}-color)`;

    if (document.visibilityState === "visible") {
      clockTimerId = window.setTimeout(
        updateClock,
        1000 - now.getMilliseconds(),
      );
    }
  }

  function updateDate() {
    window.clearTimeout(dateTimerId);

    const now = new Date();
    const month = getPart(dateFormatter, now, "month");
    const day = getPart(dateFormatter, now, "day");
    const year = getPart(dateFormatter, now, "year");

    currentDate.textContent = `${month} ${day}, ${year}, ${weekdayFormatter.format(now)}`;
    currentDate.dateTime = getLocalDateTime(now).slice(0, 10);

    if (document.visibilityState === "visible") {
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      dateTimerId = window.setTimeout(
        updateDate,
        Math.max(100, nextMidnight.getTime() - now.getTime() + 50),
      );
    }
  }

  function updateGreeting() {
    window.clearTimeout(greetingTimerId);

    if (!greetingLabel) {
      return;
    }

    const now = new Date();
    const hour = now.getHours();
    const greeting =
      hour >= 5 && hour < 12
        ? "Morning"
        : hour >= 12 && hour < 17
          ? "Afternoon"
          : hour >= 17 && hour < 21
            ? "Evening"
            : "Night";

    if (greetingLabel.textContent !== greeting) {
      greetingLabel.textContent = greeting;
    }
    greetingLabel.style.color = `var(--greet-${greeting.toLowerCase()})`;

    if (document.visibilityState === "visible") {
      const nextBoundaryHour = [5, 12, 17, 21].find(
        (boundaryHour) => boundaryHour > hour,
      );
      const nextBoundary = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (nextBoundaryHour === undefined ? 1 : 0),
        nextBoundaryHour ?? 5,
      );
      greetingTimerId = window.setTimeout(
        updateGreeting,
        Math.max(100, nextBoundary.getTime() - now.getTime() + 50),
      );
    }
  }

  function validateLocation(location) {
    if (!location || location.latitude == null || location.longitude == null) {
      return null;
    }

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    return {
      name: typeof location.name === "string" ? location.name.trim() : "",
      latitude,
      longitude,
    };
  }

  function getCurrentLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      try {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve(validateLocation(coords)),
          () => resolve(null),
          {
            enableHighAccuracy: false,
            maximumAge: 10 * 60 * 1000,
            timeout: 10000,
          },
        );
      } catch {
        resolve(null);
      }
    });
  }

  async function getWeatherLocation() {
    const currentLocation = await getCurrentLocation();
    return currentLocation || validateLocation(WEATHER_CONFIG.fallbackLocation);
  }

  function showWeatherUnavailable() {
    weatherInfo.textContent = "Weather unavailable";
    weatherInfo.setAttribute("aria-label", "Weather unavailable");
  }

  async function requestWeather() {
    try {
      const location = await getWeatherLocation();
      if (!location) {
        showWeatherUnavailable();
        return;
      }

      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.search = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: "temperature_2m,weather_code",
        temperature_unit: "celsius",
      }).toString();

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 12000);
      let response;
      try {
        response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });
      } finally {
        window.clearTimeout(timeoutId);
      }

      if (!response.ok) {
        throw new Error(`Open-Meteo returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const temperature = Number(data?.current?.temperature_2m);
      const code = Number(data?.current?.weather_code);
      const description = WEATHER_DESCRIPTIONS[code];

      if (!Number.isFinite(temperature) || !description) {
        throw new Error(
          "Open-Meteo response is missing valid current conditions.",
        );
      }

      const summary = `${description} ${Math.round(temperature)}°C`;
      weatherInfo.textContent = summary;
      weatherInfo.setAttribute(
        "aria-label",
        location.name ? `${summary} in ${location.name}` : summary,
      );
    } catch (error) {
      showWeatherUnavailable();
      console.warn("Unable to update Pixel Tab weather.", error);
    }
  }

  async function refreshWeather(force = false) {
    if (document.visibilityState !== "visible") {
      return;
    }

    if (weatherRequest) {
      return weatherRequest;
    }

    const now = Date.now();
    if (
      !force &&
      now - lastWeatherAttemptAt < WEATHER_CONFIG.refreshIntervalMs
    ) {
      return;
    }

    lastWeatherAttemptAt = now;
    weatherRequest = requestWeather();
    try {
      await weatherRequest;
    } finally {
      weatherRequest = null;
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState !== "visible") {
      return;
    }

    updateClock();
    updateDate();
    updateGreeting();
    void refreshWeather();
  }

  updateClock();
  updateDate();
  updateGreeting();
  void refreshWeather(true);

  window.setInterval(() => {
    void refreshWeather();
  }, WEATHER_CONFIG.refreshIntervalMs);
  document.addEventListener("visibilitychange", handleVisibilityChange);
})();
