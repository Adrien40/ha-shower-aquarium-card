# Shower Aquarium Card - Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.8.86] — 2026-10-01

### Changed
- Lighter on weak displays such as the Google Nest Hub 2. What does not move from one frame to the next is now built once and kept instead of being worked out again 20 to 60 times a second: the shape of every fish (and its fins, tail, body and eye, of which only the angles change), the rocks of the reef, the corals, the plants, the pebbles, the body of the anemone, and the fixed parts of the Ancistrus (only its breathing mouth moves), the shrimp (only its legs and swimmerets) and the crab (only its legs and its claws turning). The tentacles of the anemone and the water surface are not worked out again between two ticks of the ambient clock, which the light profile makes about 8 per second. Measured by building one frame of drawing, on the same machine: the reef takes 1.4 ms instead of 2.1 ms in the light profile and 1.1 ms instead of 2.1 ms in the full one, the freshwater tank 0.4 ms instead of 0.9 ms, the coldwater tank 0.3 ms instead of 0.6 ms. The pictures are exactly the same (the visual tests did not change for these).
- The light profile draws 17 tentacles on the anemone instead of 27, which is 30 shapes less to move and to paint (`tentacles` in the animation profiles).
- With the Nest Hub 2 in mind, `show_fps` is the way to see what a screen manages: it prints the frames the browser delivered and the frames drawn each second (README, Animation quality).

### Documentation
- The gallery shows the reef in the light profile too.

## [0.8.85] — 2026-10-01

### Changed
- When the glass is knocked, only the head of the goby stays out of its hole: it backs into its burrow tail first, its body turning about its head with the tail going down into the sand, and the head stops at the mouth of the hole, with the front lip of the mound drawn over it. It comes out slowly a few seconds later, as before.
- The rock in the middle of the reef, next to the anemone, is gone, along with the two small rocks beside it. The crab has one cave left, the one in the pile of live rock, and its route now starts on the sand.
- The plants, the corals and the anemone die with the tank: they shrink and fall over (the plants of the freshwater tank, the two branching corals, the purple coral, the blue fan and the anemone), instead of only turning grey while standing. The tentacles of the anemone hang limp, outward and down, instead of staying up in the air. They stand up again if the tank recovers.

## [0.8.84] — 2026-10-01

### Changed
- The goby no longer drags its burrow around: the mound of sand and the dark hole are drawn on their own, at the place of the goby, and stay there. When the glass is knocked, the goby slides towards its burrow and sinks into the sand (it is cut off at the sand line, tall fin included) instead of darting sideways; it stays hidden for four to seven seconds, then comes out again slowly. A goby that is already hidden stays hidden for longer, and one that is coming out goes back in. Dead, it comes out of the sand and lies there. It still shows the white dots of stress.

## [0.8.83] — 2026-10-01

### Changed
- The fish food is thrown like a pinch from the tips of the fingers: ten flakes (instead of six) start close to the tap and fly sideways, the ones on the left to the left and the ones on the right to the right, then the water slows them down and they sink. A throw now spreads over more than 120 units from left to right instead of about 70. The throw is the same whatever the frame rate, and the flakes stop at the glass.
- Finding the Hydrao Custom entities now uses the translation keys of the integration itself (`shower_volume_comfort`, `shower_volume_raw`, `threshold_4`), and never takes the cumulative comfort volume, whose id also ends with `comfort_shower_volume`.

### Documentation
- A screenshot gallery, `docs/SCREENSHOTS.md` (and `docs/SCREENSHOTS.fr.md` in French), shows all the pictures of `visual/baseline/`: the biotopes in the three looks, the states of the tank, the interactions, the gauges and the cost, the shapes of screen and the light profile. They are the pictures the visual tests compare against, so they are always up to date. A test checks that none is missing. Both READMEs link to it.

## [0.8.82] — 2026-10-01

### Added
- A new card is filled in automatically with the Hydrao Custom entities: shower volume, temperature and minimum comfort temperature. They are found through the entity registry (whatever the language of their ids), or by their english or french ids.
- A knock on the glass now makes the Ancistrus, the shrimp, the crab and the goby run away, much faster than they usually move.
- In the editor preview, the gauges of fullscreen mode are shown even when no water is consumed, so they can be adjusted. On a dashboard they stay hidden at 0 L.
- A swipe sideways on the tank changes the biotope (freshwater, saltwater, coldwater). The choice is kept on the device, the name of the biotope is shown for a moment, and a third keyboard button does the same. It can be turned off with the new `swipe_biotope` option (also in the editor).
- The crab walks all over the reef, from a new grotto of live rock in the middle of the tank, over the sand and up the pile of rock to its flat rock, and hides in the two caves (the grotto and a cave in the pile): it shrinks into the dark until only its eyes show. A knock on the glass sends it to the nearest cave.
- More live rock in the reef: a grotto in the middle of the tank and a few rocks lying on the sand.
- Explanation under the "Current algae age" option: 0 means automatic.
- The new `show_gauges` option draws the gauges (temperature and volume) on the aquarium outside fullscreen mode too. With the tiles removed, the cost is written between the gauges.
- The new `show_tiles` option removes the tiles under the aquarium in the normal mode (on by default).
- A new card also takes the Hydrao Custom "Threshold 4" entity as its target entity.
- The crab and the shrimp move their legs when they walk: the legs swing from their hips one after the other (in opposition on the two sides of the crab), following the distance walked so they never slide, and the claws of the crab sway. They stop when the animal stops, and the swimmerets of the shrimp flutter all the time.
- White dots of stress: a knock on the glass makes white dots appear on the fish (more of them on the ones near the knock) and on the Ancistrus, the shrimp, the crab and the goby, and they fade out one by one in about three and a half seconds.

### Changed
- A new card takes the Hydrao Custom "Comfort Shower Volume" as its volume entity (the plain "Shower Volume" when the device has none). The option is renamed "Comfort shower volume entity".
- "Gauge style (fullscreen)" is now "Gauge style": it applies to the gauges wherever they are drawn.
- The Ancistrus stays in the water: only the tip of its tail may come out of it. How high or low it can be depends on its heading (a long body standing up needs more room), and it is brought back in when the water goes down.
- A knock on the glass makes the Ancistrus flee along a wall when the knock is on the other side of it (it used to move a few units only when it was against the left glass). The shrimp runs farther too.
- The bulb of the fullscreen thermometer is smaller and joined to the tube.
- Looking for the Hydrao Custom entities now also looks at every entity Home Assistant knows, not only at the ones offered by the card picker (those already on a dashboard are left out of it); without any, a sensor is taken rather than leaving the card without an entity.
- "Algae age" is now "Current algae age".
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
