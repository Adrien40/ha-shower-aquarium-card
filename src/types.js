// Shared type definitions. This file holds documentation only (JSDoc
// typedefs, no runtime code); the other files import the names they need with
//   /** @typedef {import("./types.js").Fish} Fish */
// and `npm run typecheck` (tsc, strict) verifies that the code respects them.

/**
 * @typedef {"freshwater" | "saltwater" | "coldwater"} ThemeKey
 * @typedef {"max" | "balanced" | "light"} AnimationQuality
 */

/**
 * The card configuration once setConfig() has applied the defaults.
 *
 * @typedef {object} CardConfig
 * @property {string} entity
 * @property {string} [temperature_entity]
 * @property {string} [target_budget_entity]
 * @property {string} title
 * @property {string} theme
 * @property {number} aspect_ratio_width
 * @property {number} aspect_ratio_height
 * @property {number} fish_count
 * @property {number} target_budget
 * @property {number} survival_volume
 * @property {number} temp_boiling_threshold
 * @property {number} temp_deadly_threshold
 * @property {boolean} algae_enabled
 * @property {number} algae_delay_hours
 * @property {number} algae_age
 * @property {number} fish_speed_multiplier
 * @property {boolean} fullscreen
 * @property {boolean} show_cost
 * @property {number} water_price_per_m3
 * @property {number} energy_price_per_kwh
 * @property {number} cold_water_temp
 * @property {string} animation_quality
 * @property {boolean} respect_reduced_motion
 * @property {boolean} [show_fps]
 * @property {string} gauge_style  "thermometer" or "arc"
 * @property {boolean} show_budget
 * @property {boolean} swipe_biotope  a horizontal swipe on the tank changes the biotope
 * @property {string} creature_style  "flat", "cartoon" or "realistic"
 * @property {number} comfort_temp_min
 * @property {string} [comfort_temp_entity]
 */

/**
 * @typedef {object} HassState
 * @property {string} state
 * @property {string} [last_changed]
 */

/**
 * The part of Home Assistant's `hass` object the card reads.
 *
 * @typedef {object} Hass
 * @property {Record<string, HassState>} states
 * @property {string} [language]
 * @property {{ language?: string }} [locale]
 */

/**
 * The four numbers that decide the state of the tank.
 *
 * @typedef {object} TankMetrics
 * @property {number} consumedVolume
 * @property {number} temperature
 * @property {number} targetBudget
 * @property {number} survivalVolume
 */

/**
 * The last usable reading of the volume sensor: the value, and when it last
 * changed (null when Home Assistant gave no usable time).
 *
 * @typedef {object} LastReading
 * @property {number} volume
 * @property {number | null} changedMs  epoch milliseconds
 */

/**
 * @typedef {TankMetrics & { hoursSinceLastShower: number, comfortMin: number, sensorMissing: boolean, lastReading: LastReading | null }} CachedMetrics
 */

/**
 * Result of computeTankState().
 *
 * @typedef {object} TankState
 * @property {number} targetBudget
 * @property {number} survivalVolume
 * @property {number} totalVolume
 * @property {number} currentVolume
 * @property {number} currentTemp
 * @property {number} boilTemp
 * @property {number} deadlyTemp
 * @property {number} remainingVolumeInTank
 * @property {number} waterRatio
 * @property {number} tankTop
 * @property {number} tankBottom
 * @property {number} tankHeight
 * @property {number} waterSurfaceY
 * @property {boolean} isHeatDead
 * @property {boolean} isWaterDead
 * @property {boolean} isDead
 * @property {boolean} isBoiling
 * @property {boolean} isCritical
 * @property {boolean} isWarning
 * @property {number} speedMultiplier
 */

/**
 * @typedef {object} ThemePreset
 * @property {string} waterTop
 * @property {string} waterBottom
 * @property {string} sandColor
 * @property {string} background
 * @property {string[]} palette
 */

/**
 * @typedef {object} AnimationProfile
 * @property {number} fps
 * @property {number} ambientHz
 * @property {boolean} antialias
 * @property {number} flowBubbles
 * @property {boolean} richSurface
 * @property {boolean} deathFilter
 * @property {boolean} doubleRipple
 * @property {boolean} shading  soft shading of the realistic look
 */

/**
 * @typedef {object} FlowTracker
 * @property {number | null} lastVolume
 * @property {number} lastIncreaseAt
 * @property {number} target
 * @property {boolean} showerActive
 */

/**
 * A fish. The underscore fields are bookkeeping of the food chase.
 *
 * @typedef {object} Fish
 * @property {number} species
 * @property {string} [color]
 * @property {number} [scale]
 * @property {number} phase
 * @property {number} x
 * @property {number} y
 * @property {number} vx
 * @property {number} vy
 * @property {number} dir  1 (right) or -1 (left)
 * @property {number} [deathProgress]  0 (alive) to 1 (skeleton)
 * @property {number} [scare]  0 (calm) to 1 (terrified)
 * @property {number} [kickX]
 * @property {number} [kickY]
 * @property {number} [_baseVy]
 * @property {boolean} [_seeking]
 */

/**
 * @typedef {object} Snail
 * @property {"bottom" | "glass_left" | "glass_right" | string} type
 * @property {number} x
 * @property {number} y
 * @property {number} vx
 * @property {number} vy
 * @property {number} dir
 * @property {string} [color]
 */

/**
 * The plecostomus.
 *
 * @typedef {object} Ancistrus
 * @property {number} x
 * @property {number} y
 * @property {number} targetX
 * @property {number} targetY
 * @property {number} [heading]  direction of the head in degrees, 0 = straight up, 90 = to the right
 * @property {string} state  "idle" or "moving"
 * @property {number} idleUntil
 * @property {number} [deathProgress]
 * @property {number} [fleeUntil]  epoch ms until which it runs away after a knock on the glass
 */

/**
 * A creature that walks along the sand (shrimp, crab).
 *
 * @typedef {object} Crawler
 * @property {number} x
 * @property {number} y
 * @property {number} targetX
 * @property {string} state  "idle" or "moving"; the crab also "hiding", "hidden" and "emerging"
 * @property {number} idleUntil
 * @property {number} dir
 * @property {number} [deathProgress]
 * @property {number} [fleeUntil]  epoch ms until which it runs away after a knock on the glass
 * @property {number} [s]  crab only: distance walked along its route (see reef-layout.js)
 * @property {number} [goalS]  crab only: the distance along its route it is walking to
 * @property {number} [hide]  crab only: 0 = in sight, 1 = hidden in a cave
 */

/**
 * A flake of fish food.
 *
 * @typedef {object} Flake
 * @property {number} x
 * @property {number} y
 * @property {number} vy
 * @property {number} phase
 * @property {number} r
 * @property {string} color
 * @property {number} landedAt  0 while sinking, else the landing time (ms)
 * @property {boolean} eaten
 */

/**
 * A bubble of the stream that rises while water runs.
 *
 * @typedef {object} FlowBubble
 * @property {boolean} active
 * @property {number} x
 * @property {number} baseX
 * @property {number} y
 * @property {number} vy
 * @property {number} r
 * @property {number} phase
 */

/**
 * A decorative bubble that rises from the sand.
 *
 * @typedef {object} Bubble
 * @property {number} x
 * @property {number} y
 * @property {number} vy
 * @property {number} r
 */

/**
 * A large bubble of a boiling tank: it also drifts sideways.
 *
 * @typedef {Bubble & { vx: number }} BoilingBubble
 */

/**
 * @typedef {object} Ripple
 * @property {number} x
 * @property {number} y
 * @property {number} born  creation time (ms)
 */

/**
 * Everything a physics step needs to know about the current frame; built by
 * createFrame() in physics.js.
 *
 * @typedef {object} Frame
 * @property {number} timestamp
 * @property {number} deltaMs
 * @property {number} delta
 * @property {number} nowMs
 * @property {number} animTime
 * @property {number} userSpeed
 * @property {string} themeKey
 * @property {number} tankTop
 * @property {number} tankBottom
 * @property {number} waterSurfaceY
 * @property {number} waterRatio
 * @property {boolean} isDead
 * @property {boolean} isBoiling
 * @property {number} speedMultiplier
 * @property {number} deathStep
 */

/**
 * A field of the visual editor form, or an expandable section holding fields
 * (the part of ha-form's schema used here). A section has `type: "expandable"`
 * and a `schema`; with `flatten` its fields stay at the root of the data, so
 * the configuration is the same flat object with or without sections.
 *
 * @typedef {object} EditorField
 * @property {string} name
 * @property {string} [type]  "expandable" for a section
 * @property {string} [title]  heading of a section
 * @property {boolean} [flatten]
 * @property {EditorField[]} [schema]  the fields of a section
 * @property {boolean} [required]
 * @property {unknown} [default]
 * @property {Record<string, any>} [selector]
 */

export {};

/**
 * What the drawing functions of src/render/ read from the card element (their
 * `ctx` argument). The card passes itself, so tsc checks that it provides all
 * of these with the right types.
 *
 * @typedef {object} RenderHost
 * @property {number} _animTime  animation clock, advances while things move
 * @property {number} _ambientTime  slow clock of the always-on ambient motion
 * @property {number} _flowIntensity  0 (no water running) to 1 (full flow)
 * @property {AnimationProfile} _profile
 * @property {CardConfig | undefined} _config
 * @property {Hass | undefined} _hass
 * @property {FlowBubble[]} _flowBubbles
 * @property {Flake[]} _food
 * @property {Ripple[]} _ripples
 * @property {string} _fpsInfo
 * @property {Ancistrus | null} _ancistrus
 * @property {Crawler | null} _shrimp
 * @property {Crawler | null} _crab
 * @property {Crawler | null} _goby
 * @property {() => number} _getCanvasHeight
 */

/**
 * What the picture of the tank needs to know, worked out by the card before
 * it draws (see render/scene.js).
 *
 * @typedef {object} SceneView
 * @property {boolean} isFullscreen
 * @property {number} canvasH
 * @property {number} canvasBottom
 * @property {string} ariaLabel
 * @property {number} aspectWidth
 * @property {number} aspectHeight
 * @property {string} themeKey
 * @property {ThemePreset} theme
 * @property {string} waterColorStart
 * @property {string} waterColorEnd
 * @property {boolean} isBoiling
 * @property {boolean} isDead
 * @property {number} waterRatio
 * @property {number} waterSurfaceY
 * @property {number} tankBottom
 * @property {number} effectiveAlgaeHours
 * @property {boolean} showReadings  some water was consumed (or the editor preview is open): the gauges and the cost are shown
 * @property {boolean} forceTemp  the thermometer is shown even without a temperature (editor preview with no water)
 * @property {number} displayedTemp  temperature of the thermometer (0: none to show)
 * @property {number} currentVolume
 * @property {number} targetBudget
 * @property {number} comfortMin
 * @property {number} deadlyTemp
 * @property {number} boilTemp
 * @property {string} gaugeStyle
 * @property {boolean} showBudget
 * @property {{ total: number } | null} cost
 * @property {string} lang
 * @property {boolean} sensorLost
 * @property {string} biotopeNotice  name of the biotope just picked with a swipe, "" when there is none
 */

/**
 * What the tiles under the picture show (see render/metrics.js).
 *
 * @typedef {object} MetricsView
 * @property {number} currentVolume
 * @property {number} displayedRemaining
 * @property {number} targetBudget
 * @property {number} currentTemp
 * @property {string} tempTileColor
 * @property {{ total: number } | null} cost
 * @property {string} lang
 * @property {(key: string) => string} t  translation of a key in the language of the card
 */
