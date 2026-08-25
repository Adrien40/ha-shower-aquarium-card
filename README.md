[![Français](https://img.shields.io/badge/Langue-Fran%C3%A7ais-blue)](README.fr.md) [![English](https://img.shields.io/badge/Language-English-red)](#)

# Shower Aquarium Card for Home Assistant 🐠
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/Adrien40/ha-shower-aquarium-card)](https://github.com/Adrien40/ha-shower-aquarium-card/releases)

If this project is useful to you, please consider supporting its development 🙏

<a href="https://www.buymeacoffee.com/adrien40"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="160"></a>

---

## ⚡ Overview
* 🚿 **Animated and engaging Lovelace card** for tracking shower water consumption.
* 🐠 **Dynamic water level**, school of fish, snails, and ventral-view Ancistrus.
* 🌡️ **Water temperature tracking** with visual alerts (boiling bubbles, deadly thermal thresholds).
* 🌿 **Progressive micro-dot algae accumulation** on the glass based on time elapsed since the last shower.
* 🎨 **3 built-in biotopes:** Freshwater (Tropical), Saltwater (Reef), and Coldwater (Goldfish).
* 📱 **Optimized for tablets and Nest Hub** (Fullscreen mode & customizable aspect ratio).
* ⚙️ **100% UI-based configuration** via the visual card editor (no YAML required).
* 📦 **Quick installation** via HACS.

---

## 📸 Examples in Home Assistant

### 📊 Visualization

<p align="center">
  <img src="docs/screenshots/card_preview.png" width="600">
</p>

<p align="center">
  <em>📊 Live aquarium overview in your Home Assistant dashboard</em>
</p>

---

### 🔍 Visual Editor

<p align="center">
  <img src="docs/screenshots/editor_preview.png" width="600">
</p>

<p align="center">
  <em>🔍 Full customization of thresholds, biotopes, and visual effects</em>
</p>

---

A **custom Lovelace card for Home Assistant** that turns tracking your shower water volume (Hydrao showerhead, pulse counter, smart water meter) into a lively and interactive aquarium. 🛡️

---

## 💡 Why this card?

Tracking water consumption with plain gauges or raw numbers can quickly become monotonous, especially when encouraging sustainable habits with the family:

* 🎮 **Fun and educational:** The water level drops in real-time as water flows. Exceeding your target budget stresses the fish.
* 🌡️ **Thermal alerts:** If the water gets excessively hot, boiling bubble effects appear to visually warn against energy waste.
* 🌿 **Living evolution:** Micro-dot algae steadily build up on the glass when no shower has been taken for several hours, disappearing as showers are taken.
* 📱 **Versatile display:** Works great as a compact widget on a dashboard or as a dedicated fullscreen display on a Nest Hub or bathroom wall tablet.

---

## ✅ Compatibility / Prerequisites

* 🏷️ **Required entities:** Any sensor entity (`sensor`) measuring water volume in liters (e.g. Hydrao smart showerhead, smart water meter, utility consumption helper).
* 🌡️ **Optional entities:** Water temperature sensor (°C) and target volume helper/entity (`input_number`, `number`, or `sensor`).
* 🖥️ **Supported clients:** Home Assistant Companion app (Android/iOS), Chrome, Firefox, Safari, Nest Hub WebView.

---

## ✨ Key Features

* 🐠 **Fully animated aquarium:** Ultra-smooth SVG vector rendering, dynamic fish swimming physics with fin motion, and autonomous wandering.
* 🌿 **Realistic micro-dot algae:** Granular, realistic algae texture that intensifies up to 48 hours without showers.
* 🧹 **Realistic Ancistrus:** Rendered in ventral view with its suction mouth, tentacle crown, and spread fins, climbing vertically along the side glass.
* 🐌 **Diverse fauna:** Grazing snails moving along the sand floor and glass walls.
* 🎛️ **Full animation controls:** Fish speed multiplier and algae age sliders for easy previewing and tuning.
* ⚙️ **100% UI configuration:** Complete setup via Home Assistant's standard card editor (`ha-form`).
* 🌍 **Bilingual:** Card editor available in French 🇫🇷 and English 🇬🇧.

---

## 🚀 Installation

### Via HACS (Recommended)

1. Open **HACS** in your Home Assistant instance.
2. Click the three dots in the top-right corner > **Custom repositories**.
3. In **Repository**, paste the URL: `https://github.com/Adrien40/ha-shower-aquarium-card`
4. In **Type**, select **Dashboard** (or *Lovelace plugin*), then click **Add**.
5. Click **Download**.
6. Clear your browser cache (`Ctrl + F5`).

### Manual Installation

1. Download `shower-aquarium-card.js` from the latest release.
2. Place it inside your `/config/www/` directory.
3. Navigate to **Settings** > **Dashboards** > **Three dots** (top right) > **Resources**.
4. Add `/local/shower-aquarium-card.js` with resource type **JavaScript Module**.

---

## 📊 Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `entity` | Entity | **Required** | Consumed water volume entity (L). |
| `temperature_entity` | Entity | `-` | Water temperature entity (°C). |
| `title` | String | `""` | Card title (leave empty to hide). |
| `theme` | Select | `freshwater` | Biotope: `freshwater` (Tropical), `saltwater` (Reef), `coldwater` (Goldfish). |
| `fish_count` | Number | `4` | Number of fish in the aquarium (1 to 10). |
| `target_budget` | Number | `50` | Shower target budget in liters. |
| `target_budget_entity` | Entity | `-` | Dynamic entity defining the target water budget. |
| `survival_volume` | Number | `10` | Reserve water volume before the tank runs completely dry. |
| `temp_boiling_threshold` | Number | `40` | Threshold (°C) for hot water boiling bubble effects. |
| `temp_deadly_threshold` | Number | `45` | Critical temperature threshold (°C). |
| `algae_enabled` | Boolean | `true` | Enable progressive algae accumulation over time. |
| `algae_delay_hours` | Number | `12` | Hours to wait before algae starts appearing. |
| `algae_age` | Number | `0` | Manual slider to test/force algae age (0 to 48h). |
| `fish_speed_multiplier` | Number | `1.2` | Fish swimming speed multiplier (0.2 to 3.0). |
| `fullscreen` | Boolean | `false` | Immersive fullscreen mode (removes borders and metric cards). |
| `aspect_ratio_width` | Number | `1024` | Aspect ratio - Width. |
| `aspect_ratio_height` | Number | `600` | Aspect ratio - Height. |

---

## 📝 YAML Configuration Example

```yaml
type: custom:shower-aquarium-card
entity: sensor.hydrao_shower_volume
temperature_entity: sensor.hydrao_shower_temperature
title: Shower
theme: freshwater
fish_count: 4
target_budget: 45
survival_volume: 10
fish_speed_multiplier: 1.2
algae_enabled: true
algae_delay_hours: 12
algae_age: 0
fullscreen: false
```

---

## 🐛 Troubleshooting

### Error `Custom element doesn't exist: shower-aquarium-card`
* Check that the resource is properly registered in **Settings** > **Dashboards** > **Resources** with the URL `/local/shower-aquarium-card.js` (or `/local/community/ha-shower-aquarium-card/shower-aquarium-card.js` if managed via HACS) as a **JavaScript Module**.
* Remember to force-refresh your browser cache (`Ctrl + F5`).

### The aquarium does not fit the full tablet height
* Enable **Fullscreen mode** (`fullscreen: true`) in the card editor to remove padding/margins and fit your screen ratio automatically.

---

## 🤝 Contributions & Support

For bug reports or feature requests, feel free to open an issue on this repository.

---

## ⚖️ License

Project licensed under **GPLv3**.

---

**Developed with ❤️ by @Adrien40**

<a href="https://www.buymeacoffee.com/adrien40"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="180"></a>
