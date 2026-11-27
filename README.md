# Pixel Tab

A custom Chrome new-tab extension with a live clock, dynamic date, weather, time-of-day greeting, and app/website shortcuts — including an expandable app folder.

**Current Version:** 1.0.2  
**Manifest:** V3  
**Type:** Chrome new-tab override (`chrome_url_overrides`)

---

## Features

| Feature | Description |
| ------------------- | ------------------- |
| Live digital clock  | `hh:mm:ss AM/PM`, updates every second, local timezone |
| Dynamic date        | `Month Day, Year, Weekday`, rolls over at midnight |
| Live weather        | Displays the current weather condition and temperature in Celsius through the Open-Meteo API, using browser geolocation or an optional manual fallback; refreshes every 30 minutes |
| Greeting            | Morning / Afternoon / Evening / Night, color-coded by time of day |
| Shortcuts           | FMHY, Canvas, FB, Twitter, plus an expandable app folder |
| App folder          | Full app folder, in this case contains AI sites. |
| Same-tab navigation | All links and search load in the current tab |

---

## Get Pixel Tab

### 1. Download:

1. Open the repository's **Releases** page.
2. Download the latest ZIP archive `pixel-tab-ver_1.0.2.zip`.
3. Extract the archive to a permanent folder on your computer.

### 2. Install in Chrome or Brave

1. Open `chrome://extensions` in Chrome or `brave://extensions` in Brave.
2. Turn on **Developer mode**.
3. Select **Load unpacked**.
4. Choose the extracted `Pixel-Tab` folder.
5. Open a new tab.

The extension replaces the new-tab page through `chrome_url_overrides` in `manifest.json`.

### 3. Update

To update an unpacked installation:

1. Download and extract the latest release.
2. Replace the existing project folder, or extract the new release over it.
3. Open the extensions page and click the reload control for **Pixel Tab**.

---

## Project structure

```
Pixel-Tab/
├── .gitignore
├── manifest.json          # Chrome extension manifest (MV3)
├── index.html             # New-tab page markup
├── style.css              # Stylesheet (pixel font, dashboard, folder panel)
├── script.js              # Clock, date, greeting, weather, navigation logic
├── Pixel12x10.ttf         # Pixel font used across the dashboard
├── LICENSE                # MIT license
├── icons/
│   ├── favicon.ico        # Page favicon
│   └── extension/
│       ├── icon-16.png    # Extension icon (16×16)
│       ├── icon-48.png    # Extension icon (48×48)
│       └── icon-128.png   # Extension icon (128×128)
└── README.md              # Project documentation
```

---

## Configuration

### Weather location

The weather feature uses the following location priority:

1. Browser geolocation is attempted first.
2. If geolocation is unavailable or permission is denied, the configured manual fallback location is used.
3. If neither source provides a valid location, the appropriate location status is displayed.

The default fallback is blank, so no location is guessed or automatically configured:

```js
const WEATHER_CONFIG = {
  fallbackLocation: {
    name: "",
    latitude: null,
    longitude: null,
  },
  refreshIntervalMs: 30 * 60 * 1000,
};
```

To configure a fallback location, set a latitude and longitude within valid ranges:

```js
const WEATHER_CONFIG = {
  fallbackLocation: {
    name: "Your City",
    latitude: 12.34,
    longitude: 56.78,
  },
  refreshIntervalMs: 30 * 60 * 1000,
};
```

Latitude must be between `-90` and `90`. Longitude must be between `-180` and `180`. Browser geolocation requires the relevant location permission. Users who prefer not to rely on browser geolocation can configure the manual fallback coordinates instead.

### Permissions

`manifest.json` declares:

| Permission                                       | Purpose                                |
| ------------------------------------------------ | -------------------------------------- |
| `geolocation`                                    | Read device location for local weather |
| `host_permissions: https://api.open-meteo.com/*` | Call the Open-Meteo weather API        |

The `geolocation` permission lets the new-tab page request browser location for weather. Weather is allowed to call the Open-Meteo API through the extension's host permission.

---

## Weather Status Messages

| Situation | Display text |
| --------- | ------------ |
| Initial weather fetch | `Loading weather...` |
| Weather successfully retrieved | `24°C · Cloudy` |
| Location permission denied, with no valid fallback | `Location unavailable` |
| API or network error | `Weather unavailable` |
| No usable location configured | `Set a location` |

The successful weather display is built from the temperature and weather description returned by Open-Meteo. Values such as `24°C` and `Cloudy` are examples only. The text changes to match the actual retrieved Celsius temperature and condition.

`Loading weather...` appears while the initial request is starting. `Location unavailable` appears when geolocation is denied and no valid manual fallback is available. `Set a location` appears when no usable browser or fallback location can be obtained. `Weather unavailable` appears when the API request fails or the response is missing valid current weather data.

---

## Refresh and Error Behavior

Weather refreshes every 30 minutes. The initial request shows `Loading weather...`, and successful API responses replace it with the retrieved Celsius temperature and weather description.

When the tab becomes visible again, the extension may repeat a refresh decision. The browser location is cached after a successful location lookup, and geolocation permission denial is remembered for the current page session. API and invalid-response failures are reported through `Weather unavailable` and do not affect the clock, date, or greeting.

Weather refresh handling remains isolated from the rest of the dashboard, so a location or API problem does not interrupt clock, date, or greeting updates.

## Attribution and API Information

Weather data is provided by [Open-Meteo](https://open-meteo.com/). See the existing attribution and licensing references in `index.html` and at the end of this README.

Attribution is required. `index.html` contains a commented-out Open-Meteo attribution link that can be enabled where displayed attribution is appropriate. This README does not add or infer API limits or licensing terms beyond the attribution requirement referenced by the project.

---

## Development

No build step or dependencies are required. Edit the files directly and reload the extension on `chrome://extensions` to see changes.

| File            | Role                                                             |
| --------------- | ---------------------------------------------------------------- |
| `manifest.json` | Extension metadata, permissions, new-tab override                |
| `index.html`    | Dashboard HTML (clock, date, weather, search, shortcuts, folder) |
| `style.css`     | Responsive layout, pixel font, folder panel animation            |
| `script.js`     | Live clock, date, greeting, weather, same-tab navigation         |

---

## Browser support

- Chrome (Manifest V3 extension)
- Works as an unpacked extension for personal use

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for the complete license text.

Weather data provided by [Open-Meteo](https://open-meteo.com/) under CC-BY 4.0.
