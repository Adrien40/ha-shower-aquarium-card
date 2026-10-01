[![Français](https://img.shields.io/badge/Langue-Fran%C3%A7ais-blue)](SCREENSHOTS.fr.md) [![English](https://img.shields.io/badge/Language-English-red)](#)

# 📸 Screenshots

A quick tour of what the card looks like in different configurations. Back to the [main README](../README.md).

> ℹ️ These pictures are the ones the project's visual regression tests compare against (`visual/baseline/`), so they always match the current code: they are redrawn with `npm run visual:update` whenever the drawing changes. Each one is a fixed moment of the tank (same random seed, same clock). They show the aquarium drawing only: the tiles under it in the normal mode are plain Home Assistant elements and are not in the pictures. The text in the pictures is in English.

## Biotopes and looks

The three biotopes (`theme`) in the three looks of the living things (`creature_style`), with 12 L consumed at 34 °C. Left to right: `flat` (the default), `cartoon` and `realistic`. See the [looks](../README.md#-looks-of-the-living-things) and the fish of each biotope in the main README.

<table>
<tr>
<td align="center" width="33%"><img src="../visual/baseline/freshwater-calm.png" alt="Freshwater tank, flat look" width="100%"><br><sub>**Freshwater** (`theme: freshwater`), flat. Ancistrus, discus, angelfish, neons and a pond plant.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/freshwater-cartoon.png" alt="Freshwater tank, cartoon look" width="100%"><br><sub>**Freshwater**, `creature_style: cartoon`: outlines, big shiny eyes.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/freshwater-realistic.png" alt="Freshwater tank, realistic look" width="100%"><br><sub>**Freshwater**, `creature_style: realistic`: soft shading, scales, translucent fins.</sub></td>
</tr>
<tr>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-calm.png" alt="Saltwater reef tank, flat look" width="100%"><br><sub>**Saltwater** (`theme: saltwater`), flat. Clownfish, blue tang, a crab on its pile of live rock, a shrimp, a goby.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-cartoon.png" alt="Saltwater reef tank, cartoon look" width="100%"><br><sub>**Saltwater**, `creature_style: cartoon`.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-realistic.png" alt="Saltwater reef tank, realistic look" width="100%"><br><sub>**Saltwater**, `creature_style: realistic`.</sub></td>
</tr>
<tr>
<td align="center" width="33%"><img src="../visual/baseline/coldwater-calm.png" alt="Coldwater goldfish tank, flat look" width="100%"><br><sub>**Coldwater** (`theme: coldwater`), flat. Six kinds of goldfish.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/coldwater-cartoon.png" alt="Coldwater goldfish tank, cartoon look" width="100%"><br><sub>**Coldwater**, `creature_style: cartoon`.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/coldwater-realistic.png" alt="Coldwater goldfish tank, realistic look" width="100%"><br><sub>**Coldwater**, `creature_style: realistic`.</sub></td>
</tr>
</table>

## States of the tank

The water goes down with the volume consumed, turns red when it is too hot, and the animals do not survive an empty or boiling tank. The default budget is 50 L with 5 L of survival reserve.

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-warning.png" alt="Freshwater tank at 40 L: low water" width="100%"><br><sub>**Warning**: 40 L consumed of a 50 L budget. Above 70 % of the budget the water is low and turns a deeper blue.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-over-budget.png" alt="Saltwater tank at 55 L: empty and dead" width="100%"><br><sub>**Over budget**: 55 L, the budget (50 L) and the survival reserve (5 L) are used up. The tank is empty.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-drained.png" alt="Coldwater tank drained" width="100%"><br><sub>**Drained**: 60 L, more than the budget and the reserve together. Only the skeletons are left.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-boiling.png" alt="Coldwater tank with boiling water" width="100%"><br><sub>**Boiling**: water at 42 °C (`temp_boiling_threshold: 40`). The water turns red, bubbles rise and the fish are stressed.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-dead-by-heat.png" alt="Freshwater tank, dead by heat" width="100%"><br><sub>**Dead by heat**: 50 °C is above `temp_deadly_threshold` (45 °C). Plants wither, the fish sink.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-dead-by-heat.png" alt="Saltwater tank, dead by heat" width="100%"><br><sub>**Dead by heat** in the reef: the corals and the anemone turn grey.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-dirty-algae.png" alt="Freshwater tank covered with algae" width="100%"><br><sub>**Algae**: `algae_age: 40`. The film creeps up the glass and tufts grow along the floor.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-ten-fish.png" alt="Freshwater tank with ten fish" width="100%"><br><sub>**Ten fish** (`fish_count: 10`): they keep their distance and never pile up.</sub></td>
</tr>
</table>

## Live interactions

What happens when you use the card: water running, a pinch of fish food, a knock on the glass. See [Interactions](../README.md#-interactions--live-animations).

<table>
<tr>
<td align="center" width="33%"><img src="../visual/baseline/freshwater-water-running.png" alt="Freshwater tank while the water runs" width="100%"><br><sub>**Water running**: while the volume grows, the surface is choppier and bubbles rise from the bottom.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-fish-food.png" alt="Saltwater tank with fish food" width="100%"><br><sub>**Fish food**: a tap near the surface throws a pinch of flakes, and the fish rush to them.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-knock-on-the-glass.png" alt="Saltwater tank with shock waves on the glass" width="100%"><br><sub>**Knock on the glass**: shock waves, the fish dart away, the crab runs to a cave and the goby goes into the sand.</sub></td>
</tr>
</table>

## Sensor unavailable

When the volume sensor has had no usable value for a minute, the last volume stays and a notice says so. See [Sensor unavailable](../README.md#-sensor-unavailable).

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-sensor-unavailable.png" alt="Freshwater tank with the sensor unavailable notice" width="100%"><br><sub>**Normal mode**: the notice at the top of the picture.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen-sensor-unavailable.png" alt="Fullscreen coldwater tank with the sensor unavailable notice" width="100%"><br><sub>**Fullscreen**: the notice under the gauges and the cost.</sub></td>
</tr>
</table>

## Gauges and cost

The gauges of fullscreen mode (`fullscreen: true`), in the two styles (`gauge_style`). See [Fullscreen gauges](../README.md).

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen.png" alt="Fullscreen with a thermometer and a volume bar" width="100%"><br><sub>**Thermometer and bar** (`gauge_style: thermometer`, the default): 30 L at 39 °C.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen-arc.png" alt="Fullscreen with two open arcs" width="100%"><br><sub>**Open arcs** (`gauge_style: arc`) with the budget written on the volume gauge (`show_budget: true`).</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-fullscreen-cost.png" alt="Fullscreen with the cost of the shower" width="100%"><br><sub>**Cost** (`show_cost: true`) between the two gauges.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-fullscreen-budget.png" alt="Fullscreen with the budget on the gauge, almost over" width="100%"><br><sub>**Budget** (`show_budget: true`): 42 L of 50 L at 41.5 °C. The bar is amber above 70 % and the water is hot.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen-no-consumption.png" alt="Fullscreen with no gauges at 0 L" width="100%"><br><sub>**Nothing consumed**: the gauges stay hidden at 0 L on a dashboard (the editor's preview shows them so they can be adjusted).</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-fullscreen-dead.png" alt="Fullscreen, dead by heat" width="100%"><br><sub>**Fullscreen, dead by heat**: the gauges stay, in red.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-gauges-no-tiles.png" alt="Normal mode with gauges and no tiles" width="100%"><br><sub>**Gauges outside fullscreen** (`show_gauges: true`) with the tiles removed (`show_tiles: false`): the cost is written between the gauges.</sub></td>
<td></td>
</tr>
</table>

## Fullscreen on every shape of screen

In fullscreen mode the drawing takes the exact shape of the screen: nothing is stretched. See `fullscreen` in the main README.

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen-tablet-4x3.png" alt="Fullscreen on a 4:3 tablet" width="100%"><br><sub>**Tablet 4:3** (800 × 600).</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-fullscreen-ultrawide.png" alt="Fullscreen on an ultra-wide screen" width="100%"><br><sub>**Ultra-wide** (3:1): a flat tank.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-fullscreen-portrait.png" alt="Fullscreen on a portrait screen" width="100%"><br><sub>**Portrait** (1:2): a tall tank, the pile of rock rises with the bottom.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-fullscreen-dead-portrait.png" alt="Fullscreen on a portrait screen, dead by heat" width="100%"><br><sub>**Portrait, dead by heat**.</sub></td>
</tr>
</table>

## Performance

The light animation profile is meant for weak screens such as the Google Nest Hub: 20 images per second, simplified effects. See [Animation quality](../README.md).

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-light-profile.png" alt="Freshwater tank, light profile" width="100%"><br><sub>**Light** (`animation_quality: light`): the drawing is the same, the effects are simpler.</sub></td>
<td></td>
</tr>
</table>

## Contributing

Have a picture of the card in your own dashboard? Open a PR or an issue with the image and the options used to produce it, and it can be added here (put it in `docs/screenshots/`). The pictures of this page are not to be edited by hand: they are produced by `npm run visual:update`.
