# Shower Aquarium Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/default)
[![GitHub Release](https://img.shields.io/github/v/release/Adrien40/ha-shower-aquarium-card)](https://github.com/Adrien40/ha-shower-aquarium-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive, animated Lovelace custom card for Home Assistant designed to gamify shower water conservation. 

As water is consumed during a shower session, the aquarium level decreases in real time. If the shower exceeds the allocated target budget, the water level drops into the survival reserve zone. If the tank runs dry, the fish run out of water!

---

## Features

- **Real-Time Physics & Animation**: Vector SVG-based fish swimming smoothly within the available water volume.
- **Dynamic Water Level**: Water surface drops proportionally to your shower session consumption.
- **Survival Mechanics**:
  - **Safe Zone** (<= 70% of budget): Fish swim calmly.
  - **Warning Zone** (70% - 100% of budget): Water level noticeably lowers, fish pick up speed.
  - **Survival Zone** (> 100% of budget): Water enters the critical reserve volume, fish become agitated.
  - **Game Over** (Total volume depleted): Aquarium is empty, fish flip upside down.
- **Customizable Household Fish**: Define any number of fish with custom labels and colors to represent every family member.
- **Optimized Performance**: 100% vector SVG rendering with low CPU and battery usage, fully responsive on wall dashboards and mobile devices.
- **Plug-and-Play with Hydrao**: Works seamlessly with real-time shower metrics from showerheads such as Hydrao or inline pulse meters.

---

## Installation

### Method 1: HACS (Recommended)

1. Open **HACS** in your Home Assistant instance.
2. Click the top-right three dots menu and select **Custom repositories**.
3. Add the repository URL: `https://github.com/Adrien40/ha-shower-aquarium-card`
4. Set the Category to **Dashboard** (or **Lovelace**) and click **Add**.
5. Find **Shower Aquarium Card** in HACS and click **Download**.
6. Refresh your browser window.

### Method 2: Manual Installation

1. Download `aquarium-shower-card.js` from the [latest release](https://github.com/Adrien40/ha-shower-aquarium-card/releases).
2. Copy `aquarium-shower-card.js` into your `<config>/www/` directory.
3. In Home Assistant, go to **Settings** > **Dashboards** > **Resources**.
4. Add a new resource:
   - **URL**: `/local/aquarium-shower-card.js`
   - **Resource type**: `JavaScript Module`
5. Refresh your browser.

---

## Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Required** | `custom:aquarium-shower-card` |
| `entity` | `string` | **Required** | Entity tracking the current shower session volume (in liters). |
| `title` | `string` | `Shower Aquarium` | Card header title. |
| `target_budget` | `number` | `35` | Target shower volume budget (in liters). |
| `survival_volume` | `number` | `10` | Emergency reserve buffer before the tank runs completely dry (in liters). |
| `fishes` | `list` | *Default 4 fish* | List of fish objects representing family members. |

### Fish Object Schema

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Label displayed next to the fish. |
| `color` | `string` | Hex code or CSS color string (e.g. `#3b82f6` or `teal`). |

---

## Lovelace Configuration Examples

### Basic Setup

```yaml
type: custom:aquarium-shower-card
entity: sensor.hydrao_shower_volume
