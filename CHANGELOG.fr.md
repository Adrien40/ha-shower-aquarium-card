# Shower Aquarium Card - Journal des modifications

Toutes les modifications notables du projet sont documentées dans ce fichier.
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [Non publié]

### Ajouté
- Une nouvelle carte se remplit automatiquement avec les entités de Hydrao Custom : volume de la douche, température et température de confort minimum. Elles sont trouvées via le registre des entités (quelle que soit la langue de leurs identifiants), ou par leurs identifiants français ou anglais.
- Un coup sur la vitre fait maintenant fuir l'ancistrus, la crevette, le crabe et le gobi, bien plus vite que d'habitude.
- Dans l'aperçu de l'éditeur, les jauges du plein écran s'affichent même sans consommation, pour pouvoir les régler. Sur un tableau de bord, elles restent masquées à 0 L.

### Modifié
- « Âge des algues » devient « Âge actuel des algues (maintenant) ».
- L'option « Style des jauges » passe juste après « Mode plein écran » dans l'éditeur.
- Le texte d'aide de l'option de mouvement réduit est plus clair.

### Supprimé
- L'option `bottom_design` : seuls l'ancistrus, la crevette et le crabe redessinés subsistent. Un `bottom_design` enregistré est ignoré.

## [0.8.80] — 2026-10-01

### Modifié
- La température de confort minimale par défaut (`comfort_temp_min`) passe de 34 °C à 33 °C, celle d'Hydrao Custom : le thermomètre est ainsi d'accord avec le pommeau même sans `comfort_temp_entity`. Une carte qui règle elle-même `comfort_temp_min` n'est pas touchée.

### Documentation
- README : section de compatibilité (conçue pour Hydrao Custom, compatible avec tout capteur en litres), les entités à utiliser avec Hydrao Custom, les trois styles, les espèces de chaque biotope et les nouveaux comportements.

## [0.8.79] — 2026-10-01

### Ajouté
- Un gobi (un gobi-guetteur jaune) dans son terrier, dans le sable de l'aquarium d'eau de mer, dans les trois styles.
- Un grand tas de pierres vivantes, fait de blocs anguleux à face supérieure éclairée, dans le coin droit de l'aquarium d'eau de mer : le crabe vit sur sa pierre plate, aux trois quarts de la hauteur du tas. La crevette marche maintenant sur le sable, à gauche du tas, et le corail violet s'est décalé pour faire de la place.

### Modifié
- Le black moor, le poisson rouge télescope, a de très gros yeux globuleux.
- Le récif n'a qu'un seul chirurgien jaune (jamais plus d'un).
- Les poissons gardent une distance minimale entre eux au lieu de se rassembler en tas.
- L'ancistrus parcourt tout l'aquarium dans toutes les directions (il ne montait et ne descendait que le long de la vitre gauche) et tourne la tête vers là où il va.
- Le discus est une fois et demie plus gros et se déplace à 0,6 de la vitesse habituelle.
- Les escargots des vitres ne sont plus entraînés vers le bas avec l'eau quand elle descend : ils peuvent se retrouver hors de l'eau, et descendent pour la rejoindre.

## [0.8.78] — 2026-10-01

### Ajouté
- L'ancistrus, la crevette et le crabe sont redessinés (`render/redrawn.js`) : un ancistrus gris ardoise foncé vu de dessous, avec sa bouche-ventouse ronde, ses tentacules charnus sur le museau, ses nageoires rabattues le long du corps et son ventre plus clair tacheté ; une crevette dont l'abdomen est arqué en cinq plaques qui se chevauchent et finit par un éventail caudal, avec de longues antennes ; un crabe à la carapace pointue, aux pinces dentées et aux pattes articulées. Ils suivent les trois styles de `creature_style`.
- Plus de poissons, moins ressemblants : six espèces en eau douce (scalaire, néon, discus, guppy, rasbora arlequin, gourami nain), sept en eau de mer (poisson-clown, chirurgien bleu, gramma royal, poisson-papillon, chirurgien jaune, chromis, anthias queue-de-lyre) et six sortes de poissons rouges (ryukin, comète, pearlscale, oranda, black moor, shubunkin), chacune avec sa forme et ses couleurs. Les poissons ronds roses, turquoise et violets de l'eau de mer disparaissent.
- Les couleurs des poissons rouges sont de nouveau celles de poissons rouges : plus de poissons brun foncé.
- Le couple de poissons-clowns est un mâle et une femelle : la femelle est un peu plus grande (environ 14 %).
- Le chirurgien bleu de l'aquarium d'eau de mer est deux fois plus gros.
- Trois sortes d'escargots au lieu d'une seule, dans tous les biotopes : une coquille pointue en tourelle (sur le sable), une planorbe enroulée à plat et l'escargot rond des étangs.
- La nouvelle option `bottom_design` (aussi dans l'éditeur visuel) conserve les anciens dessins : `redrawn` (par défaut) ou `classic`.

## [0.8.77] — 2026-10-01

### Ajouté
- Trois styles pour les poissons et les autres êtres vivants, choisis avec la nouvelle option `creature_style` (aussi dans l'éditeur visuel) : `flat` (aplats de couleur avec de petits détails, par défaut), `cartoon` (contours, gros yeux, joues roses, sourire) et `realistic` (ombrage doux, écailles, nageoires translucides). Ils s'appliquent aux poissons des trois biotopes, à l'ancistrus, à la crevette, au crabe, aux escargots, aux plantes, aux coraux, à l'anémone et aux galets.

### Modifié
- Les poissons sont décrits une seule fois, en formes (`render/fish-specs.js`), et dessinés par chaque style, au lieu d'être dessinés à la main dans chaque fichier de biotope.
- La qualité d'animation `light` supprime l'ombrage doux du style réaliste.

## [0.8.76] — 2026-10-01

### Modifié
- Un seul interrupteur pour le coût : `show_cost` l'affiche maintenant en carte de chiffres en mode normal **et** en grand en plein écran. `cost_in_fullscreen` disparaît (une ancienne valeur est ignorée). Si `show_cost` était activé et `cost_in_fullscreen` désactivé, le coût apparaît maintenant aussi en plein écran.
- L'éditeur visuel montre, et enregistre, la valeur que la carte utilise vraiment pour le nombre de poissons (1 à 10) et leur vitesse (0,2 à 3) : un 20 enregistré est affiché et sauvegardé comme 10.
- Le style arc du plein écran a les trois mêmes repères que le thermomètre (confort, ébullition, mortel), à l'extérieur de l'arc de température.
- Le tracé des algues est calculé une fois par niveau de croissance et par taille d'aquarium au lieu de chaque image, ce qui allège les écrans peu puissants.
- Interne : la valeur par défaut de chaque option est écrite une seule fois, dans `defaults.js`. La carte, l'éditeur, la validation et le sélecteur de cartes la lisent de là.

## [0.8.75] — 2026-10-01

### Modifié
- L'éditeur visuel montre maintenant la valeur par défaut de chaque option : le biotope, la qualité d'animation et le style de jauges sont cochés, et les cases (seuils, nombre de poissons, budget...) contiennent leur valeur par défaut au lieu d'avoir l'air vides. Elles sont enregistrées dès qu'on change quelque chose.
- Nouveaux textes d'aide : l'objectif de douche n'est utilisé que sans l'entité d'objectif, le nombre de poissons est limité à 10, la vitesse des poissons de 0,2 à 3. L'entité de température de confort s'appelle maintenant « Entité de température de confort minimum ».
- Le `survival_volume` par défaut passe de 10 à 5 litres.
- Le thermomètre du plein écran est plus court (environ 17 % de hauteur en moins).
- Les algues sont redessinées : un voile qui monte depuis le fond et le long des vitres latérales, et des touffes d'algues filamenteuses sur le sol, au lieu d'un maillage uniforme sur toute la vitre.
- En plein écran, le thermomètre, le volume et le coût n'apparaissent qu'une fois de l'eau consommée (plus de `0,0 L` ni de `0,00 €` au repos). Le thermomètre garde la dernière température mesurée quand le capteur de température retombe à 0 après une douche.
- Réorganisation interne, sans changement visible : le dessin de l'aquarium, les cartes de chiffres et l'état de départ des créatures sont sortis de `shower-aquarium-card.js` (qui passe d'environ 1180 à environ 1040 lignes) vers `render/scene.js`, `render/metrics.js` et `scene.js`.

## [0.8.73] — 2026-09-30

Version de développement en cours.

### Ajouté
- Jauges du plein écran en deux styles (`gauge_style`) : un thermomètre en verre avec une barre de volume (par défaut), ou deux arcs ouverts.
- Une zone de confort verte sur la jauge de température : `comfort_temp_min`, ou `comfort_temp_entity` pour la lire depuis une entité, par exemple un pommeau Hydrao.
- `show_budget` écrit le budget cible sur la jauge de volume.
- Un message « Capteur indisponible » en haut de l'image quand le capteur de volume n'a plus de valeur utilisable depuis une minute (la carte continue d'afficher le dernier volume connu).

### Modifié
- Les nombres des jauges et des cartes de chiffres suivent la langue de Home Assistant (virgule décimale en français).
- L'échelle de température va maintenant de 10 °C au seuil critique plus 5 °C, et la jauge de volume n'affiche plus le budget par défaut.
- Le coût en plein écran est maintenant un grand texte en haut de l'image, entre les deux jauges, sans cadre autour.

### Corrigé
- Un capteur de volume qui passe en `unavailable` ou `unknown` (ou qui disparaît) ne fait plus paraître l'aquarium plein et en bonne santé : la carte garde le dernier volume connu, et le compteur d'algues ne redémarre pas quand le capteur revient avec la même valeur.
- Une valeur de `target_budget_entity` égale ou inférieure à zéro est ignorée (l'option `target_budget` est utilisée), comme pour un `target_budget` invalide.
