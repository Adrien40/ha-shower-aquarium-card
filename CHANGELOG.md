# Shower Aquarium Card - Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- A new card is filled in automatically with the Hydrao Custom entities: shower volume, temperature and minimum comfort temperature. They are found through the entity registry (whatever the language of their ids), or by their english or french ids.
- A knock on the glass now makes the Ancistrus, the shrimp, the crab and the goby run away, much faster than they usually move.
- In the editor preview, the gauges of fullscreen mode are shown even when no water is consumed, so they can be adjusted. On a dashboard they stay hidden at 0 L.

### Changed
- "Algae age" is now "Current algae age (right now)".
- The "Gauge style" option comes right after "Fullscreen mode" in the editor.
- The help text of the reduced-motion option is clearer.

### Removed
- The `bottom_design` option: only the redrawn Ancistrus, shrimp and crab remain. A saved `bottom_design` is ignored.

## [0.8.80] — 2026-10-01

### Changed
- The default minimum comfort temperature (`comfort_temp_min`) is 33 °C instead of 34 °C, the default of Hydrao Custom, so the thermometer agrees with the showerhead even without `comfort_temp_entity`. A card that sets `comfort_temp_min` itself is not affected.

### Documentation
- READMEs: compatibility section (made for Hydrao Custom, works with any sensor in litres), the entities to use with Hydrao Custom, the three looks, the species of each biotope and the new behaviours.

## [0.8.79] — 2026-10-01

### Added
- A goby (a yellow watchman goby) in its burrow in the sand of the reef tank, in the three looks.
- A tall pile of live rock, made of angular chunks with a lit upper face, in the right-hand corner of the reef tank: the crab lives on its flat rock, at three quarters of the height of the pile. The shrimp now walks on the sand to the left of the pile, and the purple coral moved to make room.

### Changed
- The black moor, the telescope goldfish, has huge bulging eyes.
- The reef has a single yellow tang (never more than one).
- The fish keep a minimum distance from each other instead of gathering in a heap.
- The Ancistrus roams the whole tank in every direction (it used to go up and down along the left glass only) and turns its head towards where it goes.
- The discus is one and a half times as big and moves at 0.6 of the usual speed.
- The snails on the glass are no longer carried down with the water when it goes down: they may be out of the water, and crawl down to rejoin it.

## [0.8.78] — 2026-10-01

### Added
- The Ancistrus, the shrimp and the crab are redrawn (`render/redrawn.js`): a dark slate-grey bristlenose seen from below, with a round sucker mouth, fleshy tentacles on the snout, fins swept back along the body and a lighter spotted belly; a shrimp whose abdomen is arched in five overlapping plates and ends in a tail fan, with long antennae; a crab with a pointed shell, toothed claws and jointed legs. They follow the three looks of `creature_style`.
- More fish, less alike: six species in the freshwater tank (angelfish, neon tetra, discus, guppy, harlequin rasbora, dwarf gourami), seven in the reef (clownfish, blue tang, royal gramma, butterflyfish, yellow tang, chromis, lyretail anthias) and six kinds of goldfish (ryukin, comet, pearlscale, oranda, black moor, shubunkin), each with its own shape and colours. The round pink, teal and purple reef fish are gone.
- The goldfish colours are goldfish colours again: no more dark brown fish.
- The clownfish pair is a male and a female: the female is a little bigger (about 14 %).
- The blue tang of the reef tank is twice as big.
- Three kinds of snail instead of one, in every biotope: a pointed turret shell (on the sand), a flat coiled ramshorn and the round pond snail.
- The new `bottom_design` option (also in the visual editor) keeps the previous drawings: `redrawn` (default) or `classic`.

## [0.8.77] — 2026-10-01

### Added
- Three looks for the fish and the other living things, chosen with the new `creature_style` option (also in the visual editor): `flat` (flat colours with small details, the default), `cartoon` (outlines, big eyes, rosy cheeks, a smile) and `realistic` (soft shading, scales, translucent fins). They apply to the fish of the three biotopes, the Ancistrus, the shrimp, the crab, the snails, the plants, the corals, the anemone and the pebbles.

### Changed
- The fish are described once, as shapes (`render/fish-specs.js`), and drawn by each look, instead of being drawn by hand in each biotope file.
- The `light` animation quality leaves out the soft shading of the realistic look.

## [0.8.76] — 2026-10-01

### Changed
- One switch for the cost: `show_cost` now shows it as a tile in the normal mode **and** in large text in fullscreen. `cost_in_fullscreen` is gone (an older value is ignored). If you had `show_cost` on and `cost_in_fullscreen` off, the cost now also appears in fullscreen.
- The visual editor shows, and saves, the value the card really uses for the number of fish (1 to 10) and the speed of the fish (0.2 to 3): a saved 20 is shown and saved as 10.
- The fullscreen arc style has the same three notches as the thermometer (comfort, boiling, deadly), outside the temperature arc.
- The shapes of the algae are worked out once per growth level and tank size instead of at every frame, which is lighter on low-power screens.
- Internal: the default of every option is written once, in `defaults.js`. The card, the editor, the validation and the card picker read it from there.

## [0.8.75] — 2026-10-01

### Changed
- The visual editor now shows the default of every option: the biotope, the animation quality and the gauge style are ticked, and the boxes (thresholds, fish count, budget...) hold their default value instead of looking empty. They are saved once something is changed.
- New helper texts: the shower target is only used without the target entity, the fish count is limited to 10, the fish speed to 0.2 to 3. The comfort temperature entity is now called "Minimum comfort temperature entity".
- The default `survival_volume` goes from 10 to 5 litres.
- The fullscreen thermometer is shorter (about 17 % less high).
- The algae are redrawn: a film that creeps up from the bottom and along the side glass, and tufts of hair algae along the floor, instead of a uniform mesh over the whole glass.
- In fullscreen, the thermometer, the volume and the cost only appear once some water has been consumed (no more `0.0 L` and `0.00 €` at rest). The thermometer keeps the last temperature measured when the temperature sensor falls back to 0 after a shower.
- Internal reorganisation, no visible change: the picture of the tank, the tiles under it and the starting state of the creatures moved out of `shower-aquarium-card.js` (which went from about 1180 to about 1040 lines) into `render/scene.js`, `render/metrics.js` and `scene.js`.

## [0.8.73] — 2026-09-30

Pre-release under active development.

### Added
- Fullscreen gauges in two styles (`gauge_style`): a glass thermometer with a volume bar (default), or two open arcs.
- A green comfort zone on the temperature gauge: `comfort_temp_min`, or `comfort_temp_entity` to read it from an entity such as a Hydrao showerhead.
- `show_budget` writes the target budget on the volume gauge.
- A "Sensor unavailable" notice at the top of the picture when the volume sensor has had no usable value for one minute (the card keeps showing the last known volume).

### Changed
- The numbers of the gauges and of the tiles follow the language of Home Assistant (decimal comma in French).
- The temperature scale now runs from 10 °C to the deadly threshold plus 5 °C, and the volume gauge no longer shows the budget by default.
- The fullscreen cost is now plain large text at the top of the picture, between the two gauges, without the frame around it.

### Fixed
- A volume sensor that becomes `unavailable` or `unknown` (or disappears) no longer makes the tank look full and healthy: the card keeps the last known volume, and the algae clock does not restart when the sensor comes back with the same value.
- A `target_budget_entity` reading of zero or below is ignored (the `target_budget` option is used), like an invalid `target_budget`.
