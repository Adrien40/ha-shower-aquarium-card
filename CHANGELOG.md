# Shower Aquarium Card - Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.8.80] — 2026-10-01

### Changed
- The default minimum comfort temperature (`comfort_temp_min`) is 33 °C instead of 34 °C, the default of Hydrao Custom, so the thermometer agrees with the showerhead even without `comfort_temp_entity`. A card that sets `comfort_temp_min` itself is not affected.

### Documentation
- READMEs: compatibility section (made for Hydrao Custom, works with any sensor in litres), the entities to use with Hydrao Custom, the three looks, the species of each biotope and the new behaviours.