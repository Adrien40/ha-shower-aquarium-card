[![English](https://img.shields.io/badge/Language-English-red)](README.md) [![Français](https://img.shields.io/badge/Langue-Fran%C3%A7ais-blue)](#)

# Shower Aquarium Card pour Home Assistant 🐠
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/Adrien40/ha-shower-aquarium-card)](https://github.com/Adrien40/ha-shower-aquarium-card/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/Adrien40/ha-shower-aquarium-card/blob/main/LICENSE)
[![Tests](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/tests.yaml)
[![Lint](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/lint.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/lint.yaml)
[![Typing](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/typecheck.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/typecheck.yaml)
[![Build](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/build.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/build.yaml)
[![HACS](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/hacs.yaml/badge.svg?branch=main)](https://github.com/Adrien40/ha-shower-aquarium-card/actions/workflows/hacs.yaml)

Si ce projet vous est utile, vous pouvez soutenir son développement 🙏

<a href="https://www.buymeacoffee.com/adrien40"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="160"></a>

---

## ⚡ En résumé
* 🚿 **Carte Lovelace animée et ludique** pour le suivi de la consommation d'eau de douche.
* 🐠 **Niveau d'eau dynamique**, banc de poissons, escargots et Ancistrus en vue ventrale.
* 🌡️ **Prise en compte de la température de l'eau** avec alertes visuelles (ébullition, seuils critiques).
* 🌿 **Accumulation progressive d'algues** en micro-points sur la vitre selon le temps sans douche.
* 🎨 **3 biotopes inclus :** Eau douce (Tropical), Eau de mer (Récif) et Eau froide (Poissons rouges), avec 6 à 7 espèces de poissons chacun.
* 🖌️ **3 styles** pour les êtres vivants : plat et détaillé, dessin animé ou réaliste.
* 🔌 **Conçue pour l'intégration [Hydrao Custom](https://github.com/Adrien40/ha-hydrao-custom), mais compatible avec n'importe quel capteur d'eau** (voir [Compatibilité](#-compatibilité--prérequis)).
* 📱 **Optimisé pour tablettes et Nest Hub** (Mode Plein écran & Ratio personnalisable).
* ⚙️ **Configuration 100 % graphique** via l'éditeur visuel (sans YAML obligatoire).
* 📦 **Installation rapide** via HACS.

---

## 📸 Exemples dans Home Assistant

### 📊 Visualisation

<p align="center">
  <img src="docs/screenshots/card_preview.png" width="600">
</p>

<p align="center">
  <em>📊 Aperçu de l'aquarium en direct dans votre tableau de bord Home Assistant</em>
</p>

---

### 🔍 Éditeur visuel

<p align="center">
  <img src="docs/screenshots/editor_preview.png" width="600">
</p>

<p align="center">
  <em>🔍 Personnalisation complète des seuils, des biotopes et des effets visuels</em>
</p>

### 🖼️ Galerie

Chaque biotope, chaque style, chaque état de l'aquarium, les jauges du plein écran et les formes d'écran : voir la **[galerie de captures](docs/SCREENSHOTS.fr.md)**.

---

Une **carte personnalisée Lovelace pour Home Assistant** qui transforme le suivi du volume de votre douche (pommeau Hydrao, capteur d'impulsion, compteur d'eau connecté) en un aquarium vivant et interactif. 🛡️

---

## 💡 Pourquoi cette carte ?

Suivre sa consommation d'eau sous forme de jauges ou de chiffres peut vite devenir monotone, surtout pour sensibiliser toute la famille :

* 🎮 **Ludique et pédagogique :** Le niveau de l'eau baisse en temps réel à mesure que l'eau coule. Dépasser son objectif met les poissons sous stress.
* 🌡️ **Gestion thermique :** Si l'eau devient trop chaude, des bulles d'ébullition apparaissent pour avertir visuellement d'une surconsommation d'énergie.
* 🌿 **Évolution vivante :** Des micro-points d'algues se déposent progressivement sur la vitre si aucune douche n'est prise après plusieurs heures, nettoyés au fur et à mesure.
* 📱 **Polyvalence d'affichage :** Utilisable aussi bien en widget discret sur un tableau de bord qu'en affichage plein écran dédié sur un Nest Hub ou une tablette murale de salle de bain.

---

## ✅ Compatibilité / Prérequis

### Conçue pour Hydrao Custom, ouverte à tout le reste

Cette carte a été développée pour **[Hydrao Custom](https://github.com/Adrien40/ha-hydrao-custom)**, une intégration Home Assistant 100 % locale (Bluetooth) pour les pommeaux de douche connectés Hydrao, du même auteur. Elle lui fournit tout ce qu'elle affiche : le volume de la douche en cours, la température de l'eau, et même la température de confort minimale et les seuils en litres du pommeau.

**Elle n'y est pas liée.** La carte ne lit que des entités Home Assistant : elle fonctionne donc avec toute source qui lui donne un nombre de litres.

| Ta source | Ce qu'il faut donner à la carte |
| :--- | :--- |
| Hydrao Custom | Voir [Avec Hydrao Custom](#avec-hydrao-custom) ci-dessous. |
| Un compteur d'eau connecté, un compteur d'impulsions (ESPHome, Zigbee, Z-Wave...) | Un capteur en **litres** qui repart de 0 à chaque douche ou chaque jour. Un compteur qui ne fait que monter a besoin d'un helper `utility_meter` (par exemple remis à zéro chaque jour) pour devenir un volume comparable à un budget. |
| Un capteur de débit (L/min) | Un helper `integration` (somme du débit dans le temps), puis un `utility_meter`, pour obtenir des litres. |
| Un capteur en m³ ou en gallons | Un capteur template qui le convertit en litres : la carte ne convertit pas les unités. |
| Pas de capteur de température | Laisse `temperature_entity` vide : la carte fonctionne sans. |

### Avec Hydrao Custom

La température de confort minimale par défaut de la carte (33 °C) est celle d'Hydrao Custom : le thermomètre est donc d'accord avec le pommeau même sans `comfort_temp_entity`.

Hydrao Custom nomme ses entités d'après l'appareil (`Hydrao` suivi de la fin de son adresse Bluetooth, ou le nom que tu as choisi) : leurs identifiants ressemblent à `sensor.hydrao_xxxx_shower_volume`. Utilise ceux de ton installation (l'identifiant suit la langue de Home Assistant au moment de l'ajout : sur une installation en français, il ressemble plutôt à `sensor.hydrao_xxxx_volume_douche`) :

| Option de la carte | Entité Hydrao Custom | Remarque |
| :--- | :--- | :--- |
| `entity` | **Volume Douche Confort** (L) | Trouvé automatiquement dans une nouvelle carte : seule l'eau assez chaude est comptée. Tu peux prendre **Volume Douche** à la place pour compter toute l'eau (c'est aussi celui que prend une nouvelle carte quand l'appareil n'a pas de volume confort). |
| `temperature_entity` | **Température** (°C) | |
| `comfort_temp_entity` | **Température de confort minimum** (number, 0 à 50 °C) | La zone verte du thermomètre suit alors le réglage que tu changes dans Home Assistant. |
| `target_budget_entity` | **Seuil 4** (L) | Trouvé automatiquement dans une nouvelle carte : le dernier palier en litres du pommeau devient le budget cible. |

Les volumes *cumulés totaux* ne font que monter : ne les utilise pas comme `entity`.

À savoir, d'après le fonctionnement de l'intégration :

* Les capteurs de volume et de température **gardent leur dernière valeur** entre deux douches au lieu de devenir indisponibles : l'avis *Capteur indisponible* n'apparaît donc pas juste parce que l'eau est coupée.
* Le **volume de la douche** retombe à 0 quand on appuie sur le bouton **Douche Terminée**, et repart de la nouvelle valeur à la douche suivante. Pour remettre l'aquarium plein sans attendre la prochaine douche, appuie sur ce bouton (ou lance-le depuis une automatisation). Après cela, la température retombe à 0 : la carte garde alors la dernière température mesurée.
* Le pommeau ne parle en Bluetooth que pendant que l'eau coule : les valeurs ne changent donc que pendant la douche.

La carte n'est pas limitée aux douches : elle peut afficher toute consommation que tu veux garder sous un budget (une journée d'eau, un bain, un arrosage...).

* 🏷️ **Entité requise :** un `sensor` numérique donnant un volume en **litres**. Il peut retomber à 0 (nouvelle douche) : la carte le remarque et repart de zéro.
* 🌡️ **Entités optionnelles :** température de l'eau (°C), objectif de volume (`input_number`, `number` ou `sensor`) et température de confort minimale (`number`, `input_number` ou `sensor`).
* 🖥️ **Navigateurs supportés :** Application Home Assistant Companion (Android/iOS), Chrome, Firefox, Safari, WebView Nest Hub.

---

## ✨ Points forts

* 🐠 **Aquarium entièrement animé :** Rendu vectoriel SVG haute fluidité, nage dynamique des poissons avec battement de nageoires et déplacement autonome.
* 🌿 **Algues réalistes :** Un voile granuleux monte depuis le fond et le long des vitres latérales, et des touffes d'algues filamenteuses poussent sur le sol, de plus en plus épais jusqu'à 48 h sans douche.
* 🧹 **Ancistrus :** Vu de dessous, avec sa bouche-ventouse ronde, ses tentacules charnus et ses nageoires rabattues, il parcourt tout l'aquarium dans toutes les directions et tourne la tête vers là où il va.
* 🦀 **Vie du récif :** un crabe qui parcourt tout le récif (sur le sable, puis en montant le tas de pierres vivantes jusqu'à sa pierre plate) et se cache dans les grottes quand l'envie lui prend ou quand on tape sur la vitre, une crevette sur le sable et un gobi à son terrier qui plonge dans le sable quand on tape sur la vitre.
* 👆 **Glisser pour changer de biotope :** un glissement du doigt sur l'aquarium fait passer de l'eau douce à l'eau de mer puis à l'eau froide.
* 🐟 **Des poissons qui gardent leurs distances :** ils ne s'entassent jamais, et chaque biotope a des poissons de formes et de couleurs très différentes (discus, scalaires, poissons-clowns, poissons rouges à bosse, à capuchon ou aux yeux télescopes...).
* 🐌 **Faune diversifiée :** Trois sortes d'escargots (tourelle, planorbe, escargot rond) qui broutent sur le sable et sur les vitres latérales. Quand l'eau descend, ils peuvent se retrouver au-dessus : ils descendent pour la rejoindre.
* 🎛️ **Contrôle total des animations :** Curseur de vitesse des poissons et curseur d'âge des algues pour tester et caler votre rendu idéal.
* ⚙️ **Configuration 100 % UI :** Tout se configure via l'éditeur de carte standard de Home Assistant.
* 🌍 **Bilingue :** Interface de configuration disponible en français 🇫🇷 et anglais 🇬🇧.

---

## 🚀 Installation

### Via HACS (recommandé)

1. Ouvrez **HACS** dans votre Home Assistant.
2. Cliquez sur les trois petits points en haut à droite > **Dépôts personnalisés**.
3. Dans **Dépôt**, collez l'URL : `https://github.com/Adrien40/ha-shower-aquarium-card`
4. Dans **Type**, sélectionnez **Tableau de bord** (ou *Dashboard* / *Lovelace plugin*), puis cliquez sur **Ajouter**.
5. Cliquez sur **Télécharger**.
6. Videz le cache de votre navigateur (`Ctrl + F5`).

### Installation manuelle

1. Téléchargez le fichier `shower-aquarium-card.js` depuis la dernière release.
2. Placez-le dans votre dossier `/config/www/`.
3. Allez dans **Paramètres** > **Tableaux de bord** > **Trois petits points** (en haut à droite) > **Ressources**.
4. Ajoutez la ressource `/local/shower-aquarium-card.js` en type **Module JavaScript**.

---

## 📊 Options de configuration

| Option | Type | Défaut | Description |
| :--- | :--- | :--- | :--- |
| `entity` | Entité | **Requis** | Entité du volume d'eau consommé (L). |
| `temperature_entity` | Entité | `-` | Entité de température de l'eau (°C). |
| `title` | Texte | `""` | Titre de la carte (laisser vide pour masquer). |
| `theme` | Choix | `freshwater` | Biotope : `freshwater` (Tropical), `saltwater` (Récif), `coldwater` (Poissons rouges). |
| `fish_count` | Nombre | `4` | Nombre de poissons dans l'aquarium (1 à 10). |
| `target_budget` | Nombre | `50` | Volume cible de la douche en litres. |
| `target_budget_entity` | Entité | `-` | Entité dynamique pour définir le budget max. |
| `survival_volume` | Nombre | `5` | Volume d'eau de réserve avant disparition totale de l'eau. |
| `temp_boiling_threshold` | Nombre | `40` | Seuil d'apparition des bulles d'eau très chaude (°C). |
| `temp_deadly_threshold` | Nombre | `45` | Seuil critique de température (°C). |
| `comfort_temp_min` | Nombre | `33` | Température minimale de confort de l'eau (°C) : le thermomètre passe au vert à partir de là. Doit rester inférieure à `temp_boiling_threshold`. |
| `comfort_temp_entity` | Entité | `-` | Entité donnant la température minimale de confort (par exemple celle d'un pommeau Hydrao). Remplace `comfort_temp_min` tant qu'elle a une valeur utilisable. |
| `algae_enabled` | Booléen | `true` | Active l'accumulation d'algues avec le temps. |
| `algae_delay_hours` | Nombre | `12` | Heures d'attente avant l'apparition des premières algues. |
| `algae_age` | Nombre | `0` | Curseur de forçage de l'âge des algues (0 à 48h). |
| `fish_speed_multiplier` | Nombre | `1.2` | Vitesse de nage des poissons (0.2 à 3.0). |
| `show_cost` | Booléen | `false` | Affiche le coût estimé de la douche (eau + énergie de chauffe) : en carte de chiffres en mode normal, et en grand en haut de l'image, entre les deux jauges, en plein écran. |
| `water_price_per_m3` | Nombre | `4.5` | Prix de l'eau en €/m³. |
| `energy_price_per_kwh` | Nombre | `0.25` | Prix de l'énergie en €/kWh. |
| `cold_water_temp` | Nombre | `15` | Température de l'eau froide (°C), pour estimer l'énergie de chauffe. |
| `fullscreen` | Booléen | `false` | Mode plein écran immersif (sans bordures ni cartes de métriques). Le dessin prend exactement la forme de votre écran (portrait, 4:3, ultra-large...) : rien n'est étiré. |
| `creature_style` | Sélection | `flat` | Style des poissons et des autres êtres vivants : `flat` (aplats de couleur avec de petits détails), `cartoon` (contours, gros yeux, joues roses) ou `realistic` (ombrages doux, écailles, nageoires translucides). |
| `show_gauges` | Booléen | `false` | Dessine aussi les jauges (température et volume) sur l'aquarium hors du plein écran, où elles sont toujours dessinées. Comme en plein écran, elles apparaissent dès le premier litre (toujours visibles dans l'aperçu de l'éditeur). Sans les tuiles, le coût s'écrit entre les jauges. |
| `show_tiles` | Booléen | `true` | Les tuiles sous l'aquarium en mode normal (Consommé, Restant, Objectif, Température, Coût). Mettre `false` pour ne garder que l'aquarium. Le plein écran n'a pas de tuiles. |
| `gauge_style` | Sélection | `thermometer` | Jauges : `thermometer` (thermomètre en verre + barre de volume) ou `arc` (deux arcs ouverts avec un repère). |
| `swipe_biotope` | Booléen | `true` | Un glissement horizontal sur l'aquarium change le biotope (eau douce → eau de mer → eau froide). Le choix est gardé sur l'appareil ; changer `theme` dans l'éditeur repart du nouveau. Mettre `false` pour le désactiver. |
| `show_budget` | Booléen | `false` | Écrit le budget cible sur la jauge de volume (par exemple `18.0 / 50 L`). |
| `respect_reduced_motion` | Booléen | `true` | Fige l'animation quand l'appareil demande une réduction des animations (réglage d'accessibilité). Mettre `false` pour toujours animer. |
| `animation_quality` | Sélection | `max` | Qualité d'animation : `max` (fréquence de l'écran), `balanced` (30 i/s), `light` (20 i/s, effets simplifiés — pour le Google Nest Hub et les écrans peu puissants). |
| `show_fps` | Booléen | `false` | Affichage de débogage : indique une fois par seconde le nombre d'images dessinées. Aussi disponible dans l'éditeur visuel (section Affichage). |
| `aspect_ratio_width` | Nombre | `1024` | Ratio d'affichage - Largeur (inutilisé en plein écran : l'écran décide). |
| `aspect_ratio_height` | Nombre | `600` | Ratio d'affichage - Hauteur (inutilisé en plein écran : l'écran décide). |

---

## 🐠 Styles des êtres vivants

`creature_style` change la façon dont sont dessinés les poissons, l'ancistrus, la crevette, le crabe, les escargots et les décors (plantes, coraux, anémone, galets), dans tous les biotopes. Il est aussi dans l'éditeur visuel.

| Style | Ce que tu obtiens |
| :--- | :--- |
| `flat` (par défaut) | Aplats de couleur avec de petits détails : ventre clair, ligne des ouïes, rayons des nageoires, nervures des feuilles, polypes sur les coraux. |
| `cartoon` | Un contour foncé autour de chaque forme, de gros yeux brillants, des joues roses et un sourire. L'anémone a un visage. |
| `realistic` | Ombrage doux et reflet sur les formes, écailles sur les poissons, nageoires translucides. L'ombrage est supprimé par la qualité d'animation `light` (écrans peu puissants) ; les écailles et le reflet restent. |

### Les poissons de chaque biotope

| Biotope | Espèces |
| :--- | :--- |
| Eau douce | scalaire, néon, discus (une fois et demie plus gros, et plus calme), guppy, rasbora arlequin, gourami nain |
| Eau de mer | poisson-clown (un mâle et une femelle un peu plus grande), chirurgien bleu, poisson-papillon, chirurgien jaune (un seul), gramma royal, chromis, anthias queue-de-lyre, et un gobi dans son terrier, dans le sable |
| Eau froide | ryukin, comète, pearlscale, oranda, black moor, shubunkin (tous des poissons rouges) |

Ils se suivent à mesure que `fish_count` augmente : dix poissons montrent toutes les espèces de leur aquarium. Les poissons gardent une distance minimale entre eux, pour ne pas s'entasser. L'ancistrus parcourt tout l'aquarium, dans toutes les directions, la tête tournée vers là où il va. En eau de mer, le crabe part d'une grotte au milieu de l'aquarium, traverse le sable et monte un grand tas de pierres vivantes, dans le coin droit, jusqu'à sa pierre plate (aux trois quarts de la hauteur du tas), et va se cacher dans les grottes. L'ancistrus reste toujours dans l'eau : seul le bout de sa queue peut en sortir. Les escargots peuvent se retrouver hors de l'eau quand elle descend : ils descendent le long de la vitre pour la rejoindre.

---

## 🌡️ Jauges du plein écran

En mode plein écran (ou avec `show_gauges` en mode normal), la température s'affiche en haut à gauche et le volume consommé en haut à droite, dans l'un des deux styles (`gauge_style`). Les jauges, et le coût s'il est activé, apparaissent dès le premier litre consommé et disparaissent quand le volume repasse à 0. Si le capteur de température retombe à 0 après une douche, le thermomètre garde la dernière température mesurée.

**Température.** Le thermomètre va de 10 °C au seuil critique plus 5 °C, arrondi à la dizaine supérieure (10 à 50 °C avec les seuils par défaut). Son liquide, ou l'arc, prend la couleur de la zone :

| Zone | Couleur |
| :--- | :--- |
| En dessous de la température minimale de confort | Bleu |
| De la température minimale de confort jusqu'à `temp_boiling_threshold` | Vert |
| De `temp_boiling_threshold` jusqu'à `temp_deadly_threshold` | Orange |
| À partir de `temp_deadly_threshold` | Rouge |

Trois repères marquent le début des zones verte, orange et rouge : à droite du tube dans le style thermomètre, à l'extérieur de l'arc dans le style arc.

**Volume.** La barre (ou l'arc) se remplit jusqu'au budget cible : bleue sous 70 % du budget, ambre jusqu'à 100 %, rouge au-delà. Le budget lui-même n'est écrit que si `show_budget` est activé.

---

## 🎮 Interactions et animations en direct

- **Toucher l'eau** : un coup sur la vitre fait naître une onde de choc, les poissons proches s'écartent vivement puis reprennent leur nage, et des points blancs de stress apparaissent quelques secondes sur eux et sur les autres animaux.
- **Glisser horizontalement** : change de biotope (`swipe_biotope`). Le nom du biotope s'affiche un instant.
- **Toucher près de la surface** : la nourriture est jetée comme une pincée du bout des doigts, éparpillée de gauche à droite, et les poissons se précipitent pour attraper les flocons pendant leur descente.
- **Clavier et lecteurs d'écran** : appuyez sur <kbd>Tab</kbd> pour atteindre les boutons **Nourrir les poissons**, **Taper sur la vitre** et **Changer de biotope** (ils apparaissent sur l'aquarium quand ils ont le focus), puis sur <kbd>Entrée</kbd> ou <kbd>Espace</kbd> ; un lecteur d'écran annonce le résultat. Les deux premiers sont désactivés quand les animaux sont morts, que le bac est vide, ou que votre système demande une réduction des animations.
- **Eau qui coule** : tant que le volume augmente, la surface s'agite et un flux de bulles remonte du fond. L'intensité suit le débit déduit du capteur de volume.
- **Coût** (`show_cost`) : l'énergie de chauffe est estimée d'après le volume et la température de l'eau (`4,186 kJ/kg/K`), puis valorisée avec les deux tarifs ci-dessus. C'est une estimation, pas une facture.

---

## ✅ Validation et accessibilité

- Une option invalide ne casse jamais le dessin : elle est corrigée et signalée dans la console du navigateur (`[shower-aquarium-card] …`). Par exemple un `theme` inconnu, un `target_budget` négatif, ou un `temp_deadly_threshold` qui n'est pas supérieur à `temp_boiling_threshold`.
- L'image est décrite aux lecteurs d'écran (volume, température, état du bac) dans la langue de l'utilisateur.
- Dans la vue **Sections**, la carte prend toute la largeur par défaut (minimum 6 colonnes) et sa hauteur suit son contenu.

---

## 📡 Capteur indisponible

Si le capteur de volume passe en `unavailable` ou `unknown` (ou disparaît), la carte garde le dernier volume connu au lieu d'afficher un aquarium plein et en bonne santé. Après une minute sans valeur utilisable, un message **Capteur indisponible** apparaît en haut de l'image (sous la ligne de chiffres en plein écran), et disparaît dès que le capteur répond de nouveau. L'entité de température n'est pas figée : sans valeur, elle compte comme « pas de température ».

---

## 🔋 Économie d'énergie

- L'animation **se met en pause toute seule** quand la carte sort de l'écran, sur un onglet de tableau de bord masqué, ou quand l'onglet du navigateur passe en arrière-plan, et reprend dès qu'elle est de nouveau visible.
- Home Assistant envoie à la carte un nouvel objet d'état à chaque changement de *n'importe quelle* entité de votre installation. La carte ne se redessine que si une valeur affichée (volume, température, objectif, langue) a réellement changé.
- Avec la **réduction des animations** activée dans le système, la carte dessine un aquarium immobile qui ne se met à jour que lorsque les données changent : ni nage, ni bulles de débit, ni ondes, ni nourriture. Mettez `respect_reduced_motion: false` pour animer malgré tout.

---

## ⚙️ Qualité d'animation

| | `max` | `balanced` | `light` (Google Nest Hub) |
| :--- | :--- | :--- | :--- |
| Images par seconde | fréquence de l'écran | 30 | 20 |
| Bulles du débit d'eau | 36 | 24 | 12 |
| Surface de l'eau | agitation complète | complète | plus simple, sans clapotis fin |
| Plantes et coraux morts | fanage progressif gris-brun | fanage progressif gris-brun | estompage progressif |
| Onde de choc (coup sur la vitre) | double cercle | double cercle | un seul cercle |
| Mouvement de la surface et de l'anémone | à chaque image | à chaque image | rafraîchi environ 8 fois par seconde |
| Lissage des bords (anti-crénelage) | oui | oui | non (plus rapide à dessiner) |
| Ombrage doux (style `realistic`) | oui | oui | non (les écailles et le reflet restent) |

Poissons, nourriture, jauges et coût sont identiques dans tous les modes.

---

## 📝 Exemple de configuration YAML

```yaml
type: custom:shower-aquarium-card
entity: sensor.hydrao_shower_volume
temperature_entity: sensor.hydrao_shower_temperature
title: Douche
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

Un affichage plein écran sur tablette pour Hydrao Custom, avec le style dessin animé, les jauges et le coût :

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

`xxxx` désigne la fin de l'adresse de ton pommeau (ou le nom que tu lui as donné) : utilise les identifiants d'entités de ton installation.

---

## 🐛 Dépannage

### Erreur `Custom element doesn't exist: shower-aquarium-card`
* Vérifiez que la ressource est bien déclarée dans **Paramètres** > **Tableaux de bord** > **Ressources** avec l'URL `/local/shower-aquarium-card.js` (ou `/local/community/ha-shower-aquarium-card/shower-aquarium-card.js` si gérée par HACS) en type **Module JavaScript**.
* Pensez à forcer le rechargement du cache (`Ctrl + F5`).

### L'aquarium ne prend pas toute la hauteur sur tablette
* Activez l'option **Mode plein écran** (`fullscreen: true`) dans l'éditeur de carte pour supprimer les marges et adapter automatiquement le ratio à votre écran.

---

## 🤝 Contributions et Support

Pour tout bug ou suggestion d'amélioration, vous pouvez ouvrir une issue sur ce dépôt.

---

## ⚖️ Licence

Projet sous licence **GPLv3**.

---

**Développé avec ❤️ par @Adrien40**

<a href="https://www.buymeacoffee.com/adrien40"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="180"></a>
