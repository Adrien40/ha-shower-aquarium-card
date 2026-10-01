# Shower Aquarium Card - Journal des modifications

Toutes les modifications notables du projet sont documentées dans ce fichier.
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [0.8.88] — 2026-10-01

### Modifié
- Quand on tape sur la vitre, la crevette s'enfuit en bondissant : deux bonds, la tête devant, le premier long et haut (environ 110 unités, plus d'une demi-seconde), le second plus court et plus bas, soit environ une seconde en tout. En l'air elle suit un arc, son nez passe de relevé à baissé, et une ombre sur le sable rétrécit et pâlit à mesure qu'elle monte. Plus le coup est près, plus elle va loin (150 à 240 unités) ; au bout du sable où elle peut aller, elle bondit dans l'autre sens. Elle reste sous la surface (les bonds sont plus bas quand l'eau est basse), garde son bond si on retape pendant qu'elle est en l'air, retombe là où elle est quand l'aquarium meurt, et se repose un moment avant de remarcher.
- L'ancistrus file beaucoup plus vite : 18 fois sa vitesse de glisse au lieu de 7 (environ 17 unités par image), et il tourne la tête de 16 degrés par image au lieu de 6. Il est le plus rapide au début de la course puis ralentit sur la fin, si bien qu'une fuite de plusieurs centaines d'unités dure environ une demi-seconde.
- La crevette regarde maintenant dans le sens où elle marche : la tête devant. Son dessin a la tête à gauche, mais il était retourné à l'envers, si bien qu'elle marchait à reculons.
- L'option qui affiche les images par seconde (`show_fps`) est maintenant la dernière de la section Affichage de l'éditeur, deux places plus bas, après les deux options de ratio.

## [0.8.87] — 2026-10-01

### Ajouté
- Les quatre seuils colorés d'un pommeau Hydrao. La jauge de volume (barre, arc et tuile *Consommé*) prend la couleur du seuil atteint par le volume : chaque couleur est active tant que son seuil n'est pas dépassé (le seuil 1 jusqu'à ses litres, puis le 2, puis le 3, puis le 4), et une fois le seuil 4 dépassé sa couleur clignote, une fois par seconde (pas avec le mouvement réduit : la couleur reste alors allumée). Les couleurs et les litres sont lus sur les capteurs de seuil de Hydrao Custom (état et attribut `color_hex`) : ils suivent donc les couleurs choisies sur le pommeau.
- Les nouvelles options `threshold_1_entity`, `threshold_2_entity` et `threshold_3_entity` (le quatrième seuil est l'entité d'objectif), remplies automatiquement dans une nouvelle carte, et `use_threshold_colors`, activée par défaut. Sans les quatre seuils, ou avec `use_threshold_colors: false`, les couleurs habituelles (bleu, ambre, rouge) sont utilisées, comme avant. Les derniers seuils lus sont gardés tant que les capteurs ne sont pas lisibles.
- Deux images de cela dans la galerie.

## [0.8.86] — 2026-10-01

### Modifié
- Plus léger sur les écrans peu puissants comme le Google Nest Hub 2. Ce qui ne bouge pas d'une image à l'autre est maintenant construit une seule fois et gardé, au lieu d'être recalculé 20 à 60 fois par seconde : la forme de chaque poisson (et ses nageoires, sa queue, son corps et son œil, dont seuls les angles changent), les rochers du récif, les coraux, les plantes, les galets, le corps de l'anémone, et les parties fixes de l'ancistrus (seule sa bouche qui respire bouge), de la crevette (seulement ses pattes et ses pléopodes) et du crabe (seulement ses pattes et ses pinces qui tournent). Les tentacules de l'anémone et la surface de l'eau ne sont pas recalculés entre deux tops de l'horloge d'ambiance, que le profil léger ramène à 8 par seconde environ. Mesuré en construisant une image du dessin, sur la même machine : le récif prend 1,4 ms au lieu de 2,1 ms en profil léger et 1,1 ms au lieu de 2,1 ms en profil complet, l'eau douce 0,4 ms au lieu de 0,9 ms, l'eau froide 0,3 ms au lieu de 0,6 ms. Les images sont exactement les mêmes (les tests visuels n'ont pas changé pour cela).
- Le profil léger dessine 17 tentacules à l'anémone au lieu de 27, soit 30 formes de moins à déplacer et à peindre (`tentacles` dans les profils d'animation).
- Avec le Nest Hub 2 en tête, `show_fps` est le moyen de voir ce que fait un écran : il affiche chaque seconde les images livrées par le navigateur et les images dessinées (README, Qualité d'animation).

### Documentation
- La galerie montre aussi le récif en profil léger.

## [0.8.85] — 2026-10-01

### Modifié
- Quand on tape sur la vitre, seule la tête du gobi reste hors de son trou : il recule dans son terrier la queue la première, son corps tournant autour de la tête avec la queue qui s'enfonce dans le sable, et la tête s'arrête à l'entrée du trou, la lèvre avant du monticule dessinée par-dessus. Il ressort lentement quelques secondes plus tard, comme avant.
- La pierre du milieu du récif, à côté de l'anémone, a disparu, ainsi que les deux petits cailloux à côté. Le crabe n'a plus qu'une grotte, celle du tas de pierres vivantes, et son parcours commence maintenant sur le sable.
- Les plantes, les coraux et l'anémone meurent avec l'aquarium : ils rétrécissent et s'effondrent (les plantes de l'eau douce, les deux coraux ramifiés, le corail violet, l'éventail bleu et l'anémone), au lieu de seulement grisonner debout. Les tentacules de l'anémone pendent, mous, vers l'extérieur et vers le bas, au lieu de rester en l'air. Ils se redressent si l'aquarium revit.

## [0.8.84] — 2026-10-01

### Modifié
- Le gobi ne traîne plus son terrier avec lui : le monticule de sable et le trou sombre sont dessinés à part, à la place du gobi, et y restent. Quand on tape sur la vitre, le gobi glisse vers son terrier et s'enfonce dans le sable (il est coupé à la ligne du sable, nageoire dorsale comprise) au lieu de filer sur le côté ; il reste caché de quatre à sept secondes, puis ressort lentement. Un gobi déjà caché reste caché plus longtemps, et celui qui ressort rentre aussitôt. Mort, il sort du sable et reste allongé. Il montre toujours les points blancs de stress.

## [0.8.83] — 2026-10-01

### Modifié
- La nourriture des poissons est jetée comme une pincée du bout des doigts : dix flocons (au lieu de six) partent près du doigt et filent sur le côté, ceux de gauche vers la gauche et ceux de droite vers la droite, puis l'eau les ralentit et ils coulent. Un jet s'étale maintenant sur plus de 120 unités de gauche à droite au lieu de 70 environ. Le jet est le même quelle que soit la cadence d'images, et les flocons s'arrêtent à la vitre.
- La recherche des entités Hydrao Custom utilise maintenant les clés de traduction de l'intégration elle-même (`shower_volume_comfort`, `shower_volume_raw`, `threshold_4`), et ne prend jamais le volume confort cumulé, dont l'identifiant se termine aussi par `comfort_shower_volume`.

### Documentation
- Une galerie de captures, `docs/SCREENSHOTS.fr.md` (et `docs/SCREENSHOTS.md` en anglais), montre toutes les images de `visual/baseline/` : les biotopes dans les trois styles, les états de l'aquarium, les interactions, les jauges et le coût, les formes d'écran et le profil léger. Ce sont les images que les tests visuels comparent, elles sont donc toujours à jour. Un test vérifie qu'aucune ne manque. Les deux README y renvoient.

## [0.8.82] — 2026-10-01

### Ajouté
- Une nouvelle carte se remplit automatiquement avec les entités de Hydrao Custom : volume de la douche, température et température de confort minimum. Elles sont trouvées via le registre des entités (quelle que soit la langue de leurs identifiants), ou par leurs identifiants français ou anglais.
- Un coup sur la vitre fait maintenant fuir l'ancistrus, la crevette, le crabe et le gobi, bien plus vite que d'habitude.
- Dans l'aperçu de l'éditeur, les jauges du plein écran s'affichent même sans consommation, pour pouvoir les régler. Sur un tableau de bord, elles restent masquées à 0 L.
- Un glissement horizontal sur l'aquarium change de biotope (eau douce, eau de mer, eau froide). Le choix est gardé sur l'appareil, le nom du biotope s'affiche un instant, et un troisième bouton pour le clavier fait la même chose. On peut le désactiver avec la nouvelle option `swipe_biotope` (aussi dans l'éditeur).
- Le crabe parcourt tout le récif, depuis une nouvelle grotte de pierres vivantes au milieu de l'aquarium, sur le sable puis en montant le tas de pierres jusqu'à sa pierre plate, et se cache dans les deux grottes (la grotte du milieu et une cavité du tas) : il rétrécit dans le noir jusqu'à ne montrer que ses yeux. Un coup sur la vitre l'envoie dans la grotte la plus proche.
- Plus de pierres vivantes dans le récif : une grotte au milieu de l'aquarium et quelques roches posées sur le sable.
- Explication sous l'option « Âge actuel des algues » : 0 veut dire automatique.
- La nouvelle option `show_gauges` dessine aussi les jauges (température et volume) sur l'aquarium hors du plein écran. Sans les tuiles, le coût s'écrit entre les jauges.
- La nouvelle option `show_tiles` supprime les tuiles sous l'aquarium en mode normal (activée par défaut).
- Une nouvelle carte prend aussi l'entité « Seuil 4 » de Hydrao Custom comme entité d'objectif.
- Le crabe et la crevette bougent leurs pattes quand ils marchent : elles se balancent depuis les hanches l'une après l'autre (en opposition des deux côtés du crabe), au rythme de la distance parcourue pour ne jamais glisser sur le sol, et les pinces du crabe se balancent. Elles s'arrêtent quand l'animal s'arrête, et les pléopodes de la crevette frémissent en permanence.
- Points blancs de stress : un coup sur la vitre fait apparaître des points blancs sur les poissons (plus nombreux sur ceux qui sont près du coup) et sur l'ancistrus, la crevette, le crabe et le gobi ; ils s'estompent un à un en trois secondes et demie environ.

### Modifié
- Une nouvelle carte prend le « Volume Douche Confort » de Hydrao Custom comme entité de volume (le « Volume Douche » simple quand l'appareil n'en a pas). L'option devient « Entité de volume de douche confort ».
- « Style des jauges (plein écran) » devient « Style des jauges » : il s'applique aux jauges où qu'elles soient dessinées.
- L'ancistrus reste dans l'eau : seul le bout de sa queue peut en sortir. La hauteur qu'il peut atteindre dépend de son orientation (un long corps dressé demande plus de place), et il est ramené dans l'eau quand elle descend.
- Un coup sur la vitre fait fuir l'ancistrus le long d'une paroi quand le coup vient de l'autre côté (il ne bougeait que de quelques unités quand il était contre la vitre de gauche). La crevette court aussi plus loin.
- La boule du thermomètre du plein écran est plus petite et raccordée au tube.
- La recherche des entités Hydrao Custom regarde maintenant aussi toutes les entités connues de Home Assistant, pas seulement celles que propose le sélecteur de cartes (qui écarte celles déjà sur un tableau de bord) ; à défaut, un capteur est pris plutôt que de laisser la carte sans entité.
- « Âge des algues » devient « Âge actuel des algues ».
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
