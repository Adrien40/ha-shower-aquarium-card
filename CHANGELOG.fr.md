# Shower Aquarium Card - Journal des modifications

Toutes les modifications notables du projet sont documentées dans ce fichier.
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [0.8.80] — 2026-10-01

### Modifié
- La température de confort minimale par défaut (`comfort_temp_min`) passe de 34 °C à 33 °C, celle d'Hydrao Custom : le thermomètre est ainsi d'accord avec le pommeau même sans `comfort_temp_entity`. Une carte qui règle elle-même `comfort_temp_min` n'est pas touchée.

### Documentation
- README : section de compatibilité (conçue pour Hydrao Custom, compatible avec tout capteur en litres), les entités à utiliser avec Hydrao Custom, les trois styles, les espèces de chaque biotope et les nouveaux comportements.