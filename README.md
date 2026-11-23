# Pixel Tab

A custom Chrome new-tab extension with a live clock, dynamic date, weather, time-of-day greeting, and app/website shortcuts — including an expandable app folder.

**Current Version:** 1.0.1
**Manifest:** V3  
**Type:** Chrome new-tab override (`chrome_url_overrides`)

---

## Features

| Feature             | Description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| Live digital clock  | `hh:mm:ss AM/PM`, updates every second, local timezone                    |
| Dynamic date        | `Month Day, Year, Weekday`, rolls over at midnight                        |
| Live weather        | Current condition + temperature (°C) via Open-Meteo                       |
| Greeting            | Morning / Afternoon / Evening / Night, color-coded by time of day         |
| Shortcuts           | FMHY, Canvas, FB, Twitter, plus an expandable app folder                  |
| App folder          | Full app folder, in this case contains AI sites.                          |
| Same-tab navigation | All links and search load in the current tab                              |

---

## Get Pixel Tab

### 1. Download:

1. Open the repository's **Releases** page.
2. Download the latest ZIP archive `pixel-tab-ver_1.0.1.zip`.
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

`script.js` tries browser geolocation first. If that's denied or unavailable, it falls back to `WEATHER_CONFIG.fallbackLocation` in `script.js`, which is blank by default (no location is guessed).

To set a manual fallback:

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

### Permissions

`manifest.json` declares:

| Permission                                       | Purpose                                |
| ------------------------------------------------ | -------------------------------------- |
| `geolocation`                                    | Read device location for local weather |
| `host_permissions: https://api.open-meteo.com/*` | Call the Open-Meteo weather API        |

The `geolocation` permission lets the new-tab page request your location for weather. Chrome does not show the **"Detect your physical location"** warning for this new-tab extension, but the permission remains available to the page. Weather also works because the extension is allowed to call the Open-Meteo API through its host permission.

Open-Meteo is free for non-commercial use (< 10,000 calls/day, 5,000/hour, 600/minute) under CC-BY 4.0. Attribution is required — see `index.html` for the commented-out attribution link.

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
