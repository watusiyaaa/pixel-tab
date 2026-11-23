# Pixel Tab

A custom Chrome new-tab extension with a live clock, dynamic date, weather, time-of-day greeting, and app/website shortcuts — including an expandable AI folder.

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
| Shortcuts           | FMHY, Canvas, FB, Twitter, plus an expandable AI folder                   |
| AI folder           | ChatGPT, Claude, DeepSeek, Gemini, Google AI Studio — opens from its tile |
| Same-tab navigation | All links and search load in the current tab                              |

---

## Get Pixel Tab

### 1. Download

Pixel Tab is distributed as a source-code ZIP file:

1. Open the repository's **Releases** page.
2. Download the latest ZIP archive, such as `Pixel-Tab-v1.0.zip`.
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
├── notes.txt              # Inline SVG icon source (referenced during build)
├── Pixel12x10.ttf         # Pixel font used across the dashboard
├── favicon.ico            # Page favicon
├── icons/
│   ├── favicon.ico        # Multi-size favicon source
│   └── extension/
│       ├── icon-16.png    # Extension icon (16×16)
│       ├── icon-48.png    # Extension icon (48×48)
│       └── icon-128.png   # Extension icon (128×128)
└── docs/
    └── script-js.md       # Detailed documentation for script.js
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

Chrome shows a **"Detect your physical location"** warning when the extension is installed because of the `geolocation` permission.

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
| `notes.txt`     | Source SVG icons used in the dashboard                           |

### Detailed script documentation

See [`docs/script-js.md`](docs/script-js.md) for a full breakdown of `script.js` (clock, date, greeting, weather, navigation, error handling, and limitations).

---

## Browser support

- Chrome (Manifest V3 extension)
- Works as an unpacked extension for personal use

---

## License

MIT License

Copyright (c) 2026 Jobelle Sandigan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Weather data provided by [Open-Meteo](https://open-meteo.com/) under CC-BY 4.0.
