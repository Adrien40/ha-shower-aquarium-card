[![English](https://img.shields.io/badge/Language-English-red)](SCREENSHOTS.md) [![Français](https://img.shields.io/badge/Langue-Fran%C3%A7ais-blue)](#)

# 📸 Captures d'écran

Un tour rapide de l'aspect de la carte selon les configurations. Retour au [README principal](../README.fr.md).

> ℹ️ Ces images sont celles que les tests de régression visuelle du projet comparent (`visual/baseline/`) : elles correspondent donc toujours au code actuel et sont redessinées avec `npm run visual:update` à chaque changement du dessin. Chacune est un instant figé de l'aquarium (même graine aléatoire, même horloge). Elles montrent uniquement le dessin de l'aquarium : les tuiles sous l'aquarium en mode normal sont de simples éléments de Home Assistant et ne sont pas sur les images. Les textes des images sont en anglais.

## Biotopes et styles

Les trois biotopes (`theme`) dans les trois styles des êtres vivants (`creature_style`), avec 12 L consommés à 34 °C. De gauche à droite : `flat` (par défaut), `cartoon` et `realistic`. Voir les [styles](../README.fr.md#-styles-des-êtres-vivants) et les poissons de chaque biotope dans le README principal.

<table>
<tr>
<td align="center" width="33%"><img src="../visual/baseline/freshwater-calm.png" alt="Aquarium d'eau douce, style plat" width="100%"><br><sub>**Eau douce** (`theme: freshwater`), plat. Ancistrus, discus, scalaires, néons et une plante.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/freshwater-cartoon.png" alt="Aquarium d'eau douce, style dessin animé" width="100%"><br><sub>**Eau douce**, `creature_style: cartoon` : contours, gros yeux brillants.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/freshwater-realistic.png" alt="Aquarium d'eau douce, style réaliste" width="100%"><br><sub>**Eau douce**, `creature_style: realistic` : ombrages doux, écailles, nageoires translucides.</sub></td>
</tr>
<tr>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-calm.png" alt="Aquarium d'eau de mer, style plat" width="100%"><br><sub>**Eau de mer** (`theme: saltwater`), plat. Poissons-clowns, chirurgien bleu, un crabe sur son tas de pierres vivantes, une crevette, un gobi.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-cartoon.png" alt="Aquarium d'eau de mer, style dessin animé" width="100%"><br><sub>**Eau de mer**, `creature_style: cartoon`.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-realistic.png" alt="Aquarium d'eau de mer, style réaliste" width="100%"><br><sub>**Eau de mer**, `creature_style: realistic`.</sub></td>
</tr>
<tr>
<td align="center" width="33%"><img src="../visual/baseline/coldwater-calm.png" alt="Aquarium d'eau froide, style plat" width="100%"><br><sub>**Eau froide** (`theme: coldwater`), plat. Six sortes de poissons rouges.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/coldwater-cartoon.png" alt="Aquarium d'eau froide, style dessin animé" width="100%"><br><sub>**Eau froide**, `creature_style: cartoon`.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/coldwater-realistic.png" alt="Aquarium d'eau froide, style réaliste" width="100%"><br><sub>**Eau froide**, `creature_style: realistic`.</sub></td>
</tr>
</table>

## États de l'aquarium

L'eau baisse avec le volume consommé, rougit quand elle est trop chaude, et les animaux ne survivent ni à un bac vide ni à une eau bouillante. Le budget par défaut est de 50 L, avec 5 L de réserve de survie.

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-warning.png" alt="Aquarium d'eau douce à 40 L : eau basse" width="100%"><br><sub>**Avertissement** : 40 L consommés sur un budget de 50 L. Au-delà de 70 % du budget, l'eau est basse et devient d'un bleu plus profond.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-over-budget.png" alt="Aquarium d'eau de mer à 55 L : vide et mort" width="100%"><br><sub>**Budget dépassé** : 55 L, le budget (50 L) et la réserve de survie (5 L) sont épuisés. Le bac est vide.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-drained.png" alt="Aquarium d'eau froide vidé" width="100%"><br><sub>**Vidé** : 60 L, plus que le budget et la réserve réunis. Il ne reste que les squelettes.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-boiling.png" alt="Aquarium d'eau froide avec de l'eau bouillante" width="100%"><br><sub>**Ébullition** : eau à 42 °C (`temp_boiling_threshold: 40`). L'eau rougit, des bulles montent et les poissons sont stressés.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-dead-by-heat.png" alt="Aquarium d'eau douce, mort de chaleur" width="100%"><br><sub>**Mort de chaleur** : 50 °C dépasse `temp_deadly_threshold` (45 °C). Les plantes se couchent, les poissons coulent.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-dead-by-heat.png" alt="Aquarium d'eau de mer, mort de chaleur" width="100%"><br><sub>**Mort de chaleur** dans le récif : les coraux rétrécissent et s'effondrent, l'anémone retombe, molle.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-dirty-algae.png" alt="Aquarium d'eau douce couvert d'algues" width="100%"><br><sub>**Algues** : `algae_age: 40`. Le voile monte sur la vitre et des touffes poussent sur le sol.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-ten-fish.png" alt="Aquarium d'eau douce avec dix poissons" width="100%"><br><sub>**Dix poissons** (`fish_count: 10`) : ils gardent leurs distances et ne s'entassent pas.</sub></td>
</tr>
</table>

## Interactions en direct

Ce qui se passe quand on utilise la carte : l'eau qui coule, une pincée de nourriture, un coup sur la vitre. Voir [Interactions](../README.fr.md#-interactions-et-animations-en-direct).

<table>
<tr>
<td align="center" width="33%"><img src="../visual/baseline/freshwater-water-running.png" alt="Aquarium d'eau douce pendant que l'eau coule" width="100%"><br><sub>**Eau qui coule** : tant que le volume augmente, la surface s'agite et des bulles montent du fond.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-fish-food.png" alt="Aquarium d'eau de mer avec de la nourriture" width="100%"><br><sub>**Nourriture** : un toucher près de la surface jette une pincée de flocons, et les poissons se précipitent.</sub></td>
<td align="center" width="33%"><img src="../visual/baseline/saltwater-knock-on-the-glass.png" alt="Aquarium d'eau de mer avec des ondes de choc sur la vitre" width="100%"><br><sub>**Coup sur la vitre** : ondes de choc, les poissons s'écartent, le crabe court vers une grotte et le gobi s'enfonce dans le sable.</sub></td>
</tr>
</table>

## Capteur indisponible

Quand le capteur de volume n'a plus de valeur utilisable depuis une minute, le dernier volume reste affiché avec un avis. Voir [Capteur indisponible](../README.fr.md#-capteur-indisponible).

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-sensor-unavailable.png" alt="Aquarium d'eau douce avec l'avis de capteur indisponible" width="100%"><br><sub>**Mode normal** : l'avis en haut de l'image.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen-sensor-unavailable.png" alt="Aquarium d'eau froide en plein écran avec l'avis de capteur indisponible" width="100%"><br><sub>**Plein écran** : l'avis sous les jauges et le coût.</sub></td>
</tr>
</table>

## Jauges et coût

Les jauges du plein écran (`fullscreen: true`), dans les deux styles (`gauge_style`). Voir [Jauges du plein écran](../README.fr.md).

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen.png" alt="Plein écran avec un thermomètre et une barre de volume" width="100%"><br><sub>**Thermomètre et barre** (`gauge_style: thermometer`, par défaut) : 30 L à 39 °C.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen-arc.png" alt="Plein écran avec deux arcs ouverts" width="100%"><br><sub>**Arcs ouverts** (`gauge_style: arc`) avec le budget écrit sur la jauge de volume (`show_budget: true`).</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-fullscreen-cost.png" alt="Plein écran avec le coût de la douche" width="100%"><br><sub>**Coût** (`show_cost: true`) entre les deux jauges.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-fullscreen-budget.png" alt="Plein écran avec le budget sur la jauge, presque dépassé" width="100%"><br><sub>**Budget** (`show_budget: true`) : 42 L sur 50 L à 41,5 °C. La barre est ambre au-delà de 70 % et l'eau est chaude.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen-no-consumption.png" alt="Plein écran sans jauges à 0 L" width="100%"><br><sub>**Rien de consommé** : les jauges restent masquées à 0 L sur un tableau de bord (l'aperçu de l'éditeur les montre pour pouvoir les régler).</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-fullscreen-dead.png" alt="Plein écran, mort de chaleur" width="100%"><br><sub>**Plein écran, mort de chaleur** : les jauges restent, en rouge.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-gauges-no-tiles.png" alt="Mode normal avec jauges et sans tuiles" width="100%"><br><sub>**Jauges hors plein écran** (`show_gauges: true`) avec les tuiles supprimées (`show_tiles: false`) : le coût s'écrit entre les jauges.</sub></td>
<td></td>
</tr>
</table>

## Plein écran sur toutes les formes d'écran

En plein écran, le dessin prend exactement la forme de l'écran : rien n'est étiré. Voir `fullscreen` dans le README principal.

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/coldwater-fullscreen-tablet-4x3.png" alt="Plein écran sur une tablette 4:3" width="100%"><br><sub>**Tablette 4:3** (800 × 600).</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-fullscreen-ultrawide.png" alt="Plein écran sur un écran ultra-large" width="100%"><br><sub>**Ultra-large** (3:1) : un aquarium plat.</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/saltwater-fullscreen-portrait.png" alt="Plein écran sur un écran en portrait" width="100%"><br><sub>**Portrait** (1:2) : un aquarium haut, le tas de pierres monte avec le fond.</sub></td>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-fullscreen-dead-portrait.png" alt="Plein écran en portrait, mort de chaleur" width="100%"><br><sub>**Portrait, mort de chaleur**.</sub></td>
</tr>
</table>

## Performance

Le profil d'animation léger est prévu pour les écrans peu puissants comme le Google Nest Hub : 20 images par seconde, effets simplifiés. Voir [Qualité d'animation](../README.fr.md).

<table>
<tr>
<td align="center" width="50%"><img src="../visual/baseline/freshwater-light-profile.png" alt="Aquarium d'eau douce, profil léger" width="100%"><br><sub>**Léger** (`animation_quality: light`) : le dessin est le même, les effets sont plus simples.</sub></td>
<td></td>
</tr>
</table>

## Contribuer

Tu as une capture de la carte dans ton propre tableau de bord ? Ouvre une PR ou une issue avec l'image et les options utilisées pour l'obtenir, et elle pourra être ajoutée ici (à mettre dans `docs/screenshots/`). Les images de cette page ne se modifient pas à la main : elles sont produites par `npm run visual:update`.
