[![Français](https://img.shields.io/badge/Langue-Fran%C3%A7ais-blue)](README.fr.md) [![English](https://img.shields.io/badge/Language-English-red)](#)

# Shower Aquarium Card for Home Assistant 🐠
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/Adrien40/ha-shower-aquarium-card)](https://github.com/Adrien40/ha-shower-aquarium-card/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/Adrien40/ha-shower-aquarium-card/blob/main/LICENSE)
[![Tests](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/tests.yaml)
[![Lint](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/lint.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/lint.yaml)
[![Typing](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/typecheck.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/typecheck.yaml)
[![Build](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/build.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/build.yaml)
[![HACS](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/hacs.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/hacs.yaml)

If this project is useful to you, please consider supporting its development 🙏

<a href="https://www.buymeacoffee.com/adrien40"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="160"></a>

---

## ⚡ Overview
* 🚿 **Animated and engaging Lovelace card** for tracking shower water consumption.
* 🐠 **Dynamic water level**, school of fish, snails, and ventral-view Ancistrus.
* 🌡️ **Water temperature tracking** with visual alerts (boiling bubbles, deadly thermal thresholds).
* 🌿 **Progressive micro-dot algae accumulation** on the glass based on time elapsed since the last shower.
* 🎨 **3 built-in biotopes:** Freshwater (Tropical), Saltwater (Reef), and Coldwater (Goldfish), with 6 to 7 species of fish each.
* 🖌️ **3 looks** for the living things: flat and detailed, cartoon, or realistic.
* 🔌 **Made for the [Hydrao Custom](https://github.com/Adrien40/ha-hydrao-custom) integration, but works with any water sensor** (see [Compatibility](#-compatibility--prerequisites)).
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

### Made for Hydrao Custom, open to everything

This card was developed for **[Hydrao Custom](https://github.com/Adrien40/ha-hydrao-custom)**, a 100 % local (Bluetooth) Home Assistant integration for Hydrao smart showerheads, by the same author. It gives the card everything it shows: the volume of the current shower, the water temperature and even the minimum comfort temperature and the liter thresholds of the showerhead.

**It is not tied to it.** The card only reads Home Assistant entities, so it works with any source that gives it a number of litres:

| Your source | What to give the card |
| :--- | :--- |
| Hydrao Custom | See [With Hydrao Custom](#with-hydrao-custom) below. |
| A smart water meter, a pulse counter (ESPHome, Zigbee, Z-Wave...) | A sensor in **litres** that starts again from 0 for each shower or each day. A meter that only counts up forever needs a `utility_meter` helper (for example one that resets every day) to turn it into a volume you can compare with a budget. |
| A flow sensor (L/min) | An `integration` helper (sum of the flow over time) then a `utility_meter`, to get litres. |
| A sensor in m³ or gallons | A template sensor that converts it to litres: the card does not convert units. |
| No temperature sensor | Leave `temperature_entity` empty: the card works without one. |

### With Hydrao Custom

The default minimum comfort temperature of the card (33 °C) is the one of Hydrao Custom, so the thermometer agrees with the showerhead even without `comfort_temp_entity`.

Hydrao Custom names its entities after the device (`Hydrao` followed by the end of its Bluetooth address, or the name you chose), so their ids look like `sensor.hydrao_xxxx_shower_volume`. Use the ones of your installation (the id follows the language Home Assistant had when the device was added, so on a French installation it looks like `sensor.hydrao_xxxx_volume_douche`):

| Card option | Hydrao Custom entity | Note |
| :--- | :--- | :--- |
| `entity` | **Comfort Shower Volume** (L) | Found automatically in a new card: only the water that was warm enough counts. You can take **Shower Volume** instead to count all the water (it is also the one a new card takes when the device has no comfort volume). |
| `temperature_entity` | **Temperature** (°C) | |
| `comfort_temp_entity` | **Minimum Comfort Temperature** (number, 0 to 50 °C) | The green zone of the thermometer then follows the setting you change in Home Assistant. |
| `target_budget_entity` | **Threshold 4** (L) | Found automatically in a new card: the last liter tier of the showerhead becomes the target budget. |

The *Total Cumulative* volumes only ever go up: do not use them as `entity`.

Good to know, from how the integration works:

* The volume and temperature sensors **keep their last value** between two showers instead of becoming unavailable, so the *Sensor unavailable* notice does not appear just because the water is off.
* The **Shower Volume** goes back to 0 when the **Shower Ended** button is pressed, and starts again from the new value at the next shower. To send the aquarium back to a full tank without waiting for the next shower, press that button (or run it from an automation). After it, the temperature falls back to 0: the card then keeps the last temperature it measured.
* The showerhead only talks over Bluetooth while the water is running, so values change during the shower only.

The card is not limited to showers: it can show any consumption you want to keep under a budget (a day of water, a bath, a garden watering...).

* 🏷️ **Required entity:** a numeric `sensor` giving a volume in **litres**. It may go back to 0 (a new shower): the card notices and starts over.
* 🌡️ **Optional entities:** water temperature (°C), target volume (`input_number`, `number` or `sensor`) and minimum comfort temperature (`number`, `input_number` or `sensor`).
* 🖥️ **Supported clients:** Home Assistant Companion app (Android/iOS), Chrome, Firefox, Safari, Nest Hub WebView.

---

## ✨ Key Features

* 🐠 **Fully animated aquarium:** Ultra-smooth SVG vector rendering, dynamic fish swimming physics with fin motion, and autonomous wandering.
* 🌿 **Realistic algae:** A granular film creeps up from the bottom and along the side glass, and tufts of hair algae grow along the floor, thicker and thicker up to 48 hours without showers.
* 🧹 **Ancistrus:** Seen from below with its round suction mouth, fleshy tentacles and fins swept back, it roams the whole tank in every direction and turns its head towards where it goes.
* 🦀 **Reef life:** a crab that walks all over the reef (over the sand, up the pile of live rock to its flat rock) and hides in the caves when it feels like it or when you knock on the glass, a shrimp on the sand and a goby in its burrow.
* 👆 **Swipe to change the biotope:** slide a finger sideways on the aquarium to go from freshwater to saltwater to coldwater.
* 🐟 **Fish that keep their distance:** they never pile up, and every biotope has fish of very different shapes and colours (discus, angelfish, clownfish, goldfish with a hump, a hood or telescope eyes...).
* 🐌 **Diverse fauna:** Three kinds of snail (turret, ramshorn, round pond snail) grazing along the sand floor and the glass walls. When the water goes down they may be left above it: they crawl down to rejoin it.
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
| `survival_volume` | Number | `5` | Reserve water volume before the tank runs completely dry. |
| `temp_boiling_threshold` | Number | `40` | Threshold (°C) for hot water boiling bubble effects. |
| `temp_deadly_threshold` | Number | `45` | Critical temperature threshold (°C). |
| `comfort_temp_min` | Number | `33` | Minimum comfortable water temperature (°C): the thermometer turns green from there. Must stay below `temp_boiling_threshold`. |
| `comfort_temp_entity` | Entity | `-` | Entity giving the minimum comfort temperature (for example the one of a Hydrao showerhead). Replaces `comfort_temp_min` while it holds a usable value. |
| `algae_enabled` | Boolean | `true` | Enable progressive algae accumulation over time. |
| `algae_delay_hours` | Number | `12` | Hours to wait before algae starts appearing. |
| `algae_age` | Number | `0` | Manual slider to test/force algae age (0 to 48h). |
| `fish_speed_multiplier` | Number | `1.2` | Fish swimming speed multiplier (0.2 to 3.0). |
| `show_cost` | Boolean | `false` | Show the estimated shower cost (water + heating energy): as a tile in the normal mode, and in large text at the top of the picture, between the two gauges, in fullscreen. |
| `water_price_per_m3` | Number | `4.5` | Water price in €/m³. |
| `energy_price_per_kwh` | Number | `0.25` | Energy price in €/kWh. |
| `cold_water_temp` | Number | `15` | Cold water inlet temperature (°C), used to estimate the heating energy. |
| `fullscreen` | Boolean | `false` | Immersive fullscreen mode (removes borders and metric cards). The drawing takes the exact shape of your screen (portrait, 4:3, ultra-wide...): nothing is stretched. |
| `creature_style` | Select | `flat` | Look of the fish and the other living things: `flat` (flat colours with small details), `cartoon` (outlines, big eyes, rosy cheeks) or `realistic` (soft shading, scales, translucent fins). |
| `show_gauges` | Boolean | `false` | Also draw the gauges (temperature and volume) on the aquarium outside fullscreen mode, where they are always drawn. Like in fullscreen, they appear with the first litre (always shown in the preview of the editor). With the tiles removed, the cost is written between the gauges. |
| `show_tiles` | Boolean | `true` | The tiles under the aquarium in the normal mode (Consumed, Remaining, Target, Temperature, Cost). Set to `false` to keep only the aquarium. Fullscreen mode has no tiles. |
| `gauge_style` | Select | `thermometer` | Gauges: `thermometer` (glass thermometer + volume bar) or `arc` (two open arcs with a marker dot). |
| `swipe_biotope` | Boolean | `true` | A sideways swipe on the aquarium changes the biotope (freshwater → saltwater → coldwater). The choice is kept on the device; changing `theme` in the editor starts over from the new one. Set to `false` to turn it off. |
| `show_budget` | Boolean | `false` | Write the target budget on the volume gauge (for example `18.0 / 50 L`). |
| `respect_reduced_motion` | Boolean | `true` | Freeze the animation when the device asks for reduced motion (accessibility setting). Set to `false` to always animate. |
| `animation_quality` | Select | `max` | Animation quality: `max` (display frame rate), `balanced` (30 fps), `light` (20 fps, simplified effects — for the Google Nest Hub and other low-power screens). |
| `show_fps` | Boolean | `false` | Debug overlay: once per second, shows how many frames were drawn. Also available in the visual editor (Display section). |
| `aspect_ratio_width` | Number | `1024` | Aspect ratio - Width (not used in fullscreen mode: the screen decides). |
| `aspect_ratio_height` | Number | `600` | Aspect ratio - Height (not used in fullscreen mode: the screen decides). |

---

## 🐠 Looks of the living things

`creature_style` changes how the fish, the Ancistrus, the shrimp, the crab, the snails and the decor (plants, corals, anemone, pebbles) are drawn, in every biotope. It is also in the visual editor.

| Look | What you get |
| :--- | :--- |
| `flat` (default) | Flat colours with small details: a light belly, a gill line, fin rays, veins on the leaves, polyps on the corals. |
| `cartoon` | A dark outline round every shape, big shiny eyes, rosy cheeks and a smile. The anemone gets a face. |
| `realistic` | Soft shading and a shine over the shapes, scales on the fish, translucent fins. The shading is left out by the `light` animation quality (weak screens); the scales and the shine stay. |

### The fish of each biotope

| Biotope | Species |
| :--- | :--- |
| Freshwater | angelfish, neon tetra, discus (one and a half times as big, and calmer), guppy, harlequin rasbora, dwarf gourami |
| Saltwater | clownfish (a male and a slightly bigger female), blue tang, butterflyfish, yellow tang (only one), royal gramma, chromis, lyretail anthias, and a goby in its burrow in the sand |
| Cold water | ryukin, comet, pearlscale, oranda, black moor, shubunkin (all goldfish) |

They follow one another as `fish_count` grows, so ten fish show every species of their tank. The fish keep a minimum distance from each other, so they do not pile up. The Ancistrus roams the whole tank, in every direction, turning its head towards where it goes. In the reef, the crab walks from a grotto in the middle of the tank, over the sand and up a tall pile of live rock in the right-hand corner, to its flat rock (at three quarters of the height of the pile), and goes into the caves to hide. The Ancistrus always stays in the water: only the tip of its tail may come out of it. The snails may be out of the water when it goes down: they crawl down to rejoin it.

---

## 🌡️ Fullscreen gauges

In fullscreen mode (or with `show_gauges` in the normal mode) the temperature is shown top left and the consumed volume top right, in one of two styles (`gauge_style`). The gauges, and the cost when it is enabled, appear with the first litre consumed and disappear when the volume is back to 0. If the temperature sensor falls back to 0 after a shower, the thermometer keeps the last temperature measured.

**Temperature.** The thermometer goes from 10 °C to the deadly threshold plus 5 °C, rounded up to a multiple of 10 (10 to 50 °C with the default thresholds). Its liquid, or the arc, takes the colour of the zone:

| Zone | Colour |
| :--- | :--- |
| Below the minimum comfort temperature | Blue |
| From the minimum comfort temperature up to `temp_boiling_threshold` | Green |
| From `temp_boiling_threshold` up to `temp_deadly_threshold` | Orange |
| From `temp_deadly_threshold` | Red |

Three notches mark where the green, orange and red zones begin: on the right of the tube in the thermometer style, and outside the arc in the arc style.

**Volume.** The bar (or arc) fills up to the target budget: blue below 70 % of it, amber up to 100 %, red beyond. The budget itself is only written when `show_budget` is on.

---

## 🎮 Interactions & live animations

- **Tap the water** to knock on the glass: a shock wave ripples out, nearby fish dart away before resuming their swim, and white dots of stress appear on them and on the other animals for a few seconds.
- **Swipe sideways** to change the biotope (`swipe_biotope`). The name of the biotope appears for a moment.
- **Tap near the surface** to drop fish food: the fish rush to catch the flakes as they sink.
- **Keyboard and screen readers**: press <kbd>Tab</kbd> to reach the **Feed the fish**, **Knock on the glass** and **Change biotope** buttons (they appear over the tank while focused) and <kbd>Enter</kbd> or <kbd>Space</kbd> to use them; a screen reader announces the result. The first two are disabled when the animals are dead, the tank is empty, or your system asks for reduced motion.
- **Water running**: while the volume keeps growing, the surface becomes choppier and a stream of bubbles rises from the bottom. The intensity follows the flow inferred from the volume sensor.
- **Cost** (`show_cost`): the heating energy is estimated from the volume and the water temperature (`4.186 kJ/kg/K`), then priced with the two rates above. It is an estimate, not a bill.

---

## ✅ Validation & accessibility

- Invalid options never break the drawing: they are corrected and reported in the browser console (`[shower-aquarium-card] …`). For example an unknown `theme`, a negative `target_budget`, or a `temp_deadly_threshold` that is not above `temp_boiling_threshold`.
- The picture is exposed to screen readers with a translated description of the volume, the temperature and the state of the tank.
- In the **sections** view the card takes the full width by default (minimum 6 columns) and its height follows its content.

---

## 📡 Sensor unavailable

If the volume sensor becomes `unavailable` or `unknown` (or disappears), the card keeps showing the last known volume instead of an empty, healthy-looking tank. After one minute without a usable value, a **Sensor unavailable** notice appears at the top of the picture (under the row of numbers in fullscreen), and goes away as soon as the sensor answers again. The temperature entity is not frozen: without a value it counts as "no temperature".

---

## 🔋 Power saving

- The animation **pauses by itself** when the card is scrolled out of view, on a hidden dashboard tab, or when the browser tab is in the background, and resumes as soon as it is visible again.
- Home Assistant hands the card a new state object every time *any* entity of your installation changes. The card only redraws when a value it displays (volume, temperature, target, language) actually changed.
- With **reduced motion** enabled in the operating system, the card draws a still aquarium that updates only when the data changes: no swimming, flow bubbles, ripples or fish food. Set `respect_reduced_motion: false` to keep animating anyway.

---

## ⚙️ Animation quality

| | `max` | `balanced` | `light` (Google Nest Hub) |
| :--- | :--- | :--- | :--- |
| Frames per second | display rate | 30 | 20 |
| Water-flow bubbles | 36 | 24 | 12 |
| Water surface | full choppy detail | full | simpler, no fine chop |
| Dead plants and corals | gradual grey-brown wilt | gradual grey-brown wilt | gradual fade |
| Knock shock wave | double ring | double ring | single ring |
| Water surface and anemone motion | every frame | every frame | refreshed ~8 times per second |
| Edge anti-aliasing | yes | yes | no (faster to draw) |
| Soft shading (`realistic` look) | yes | yes | no (scales and shine stay) |

Fish, food, gauges and cost are identical in every mode.

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
survival_volume: 5
fish_speed_multiplier: 1.2
algae_enabled: true
algae_delay_hours: 12
algae_age: 0
creature_style: flat
fullscreen: false
```

A fullscreen tablet display for Hydrao Custom, with the cartoon look, gauges and cost:

```yaml
type: custom:shower-aquarium-card
entity: sensor.hydrao_xxxx_shower_volume
temperature_entity: sensor.hydrao_xxxx_temperature
comfort_temp_entity: number.hydrao_xxxx_minimum_comfort_temperature
target_budget_entity: sensor.hydrao_xxxx_threshold_4
theme: saltwater
fish_count: 10
target_budget: 50
creature_style: cartoon
gauge_style: arc
show_budget: true
show_cost: true
animation_quality: balanced
fullscreen: true
```

`xxxx` stands for the end of your showerhead's address (or the name you gave it): use the entity ids of your installation.

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
