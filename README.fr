[![English](https://img.shields.io/badge/Language-English-red)](README.md) [![Français](https://img.shields.io/badge/Langue-Fran%C3%A7ais-blue)](#)

# Shower Aquarium Card pour Home Assistant 🐠
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/Adrien40/ha-shower-aquarium-card)](https://github.com/Adrien40/ha-shower-aquarium-card/releases)

Si ce projet vous est utile, vous pouvez soutenir son développement 🙏

## ⚡ En résumé

* 🚿 **Carte Lovelace animée et ludique** pour le suivi de la consommation d'eau de douche.
* 🐠 **Niveau d'eau dynamique**, banc de poissons, escargots et Ancistrus en vue ventrale.
* 🌡️ **Prise en compte de la température de l'eau** avec alertes visuelles (ébullition, seuils critiques).
* 🌿 **Accumulation progressive d'algues** en micro-points sur la vitre selon le temps sans douche.
* 🎨 **3 biotopes inclus :** Eau douce (Tropical), Eau de mer (Récif) et Eau froide (Poissons rouges).
* 📱 **Optimisé pour tablettes et Nest Hub** (Mode Plein écran & Ratio personnalisable).
* ⚙️ **Configuration 100 % graphique** via l'éditeur visuel (sans YAML obligatoire).
* 📦 **Installation rapide** via HACS.

---

## 📸 Exemples dans Home Assistant

### 📊 Visualisation

### 🔍 Éditeur visuel

Une carte personnalisée Lovelace pour Home Assistant qui transforme le suivi du volume de votre douche (pommeau Hydrao, capteur d'impulsion, compteur d'eau connecté) en un aquarium vivant et interactif. 🛡️

---

## 💡 Pourquoi cette carte ?

Suivre sa consommation d'eau sous forme de jauges ou de chiffres peut vite devenir monotone, surtout pour sensibiliser toute la famille :

* 🎮 **Ludique et pédagogique :** Le niveau de l'eau baisse en temps réel à mesure que l'eau coule. Dépasser son objectif met les poissons sous stress.
* 🌡️ **Gestion thermique :** Si l'eau devient trop chaude, des bulles d'ébullition apparaissent pour avertir visuellement d'une surconsommation d'énergie.
* 🌿 **Évolution vivante :** Des micro-points d'algues se déposent progressivement sur la vitre si aucune douche n'est prise après plusieurs heures, nettoyés au fur et à mesure.
* 📱 **Polyvalence d'affichage :** Utilisable aussi bien en widget discret sur un tableau de bord qu'en affichage plein écran dédié sur un Nest Hub ou une tablette murale de salle de bain.

---

## ✅ Compatibilité / Prérequis

* 🏷️ **Entités requises :** Tout capteur (`sensor`) mesurant le volume d'eau en litres (ex. pommeau connecté Hydrao, compteur d'eau, helper de consommation).
* 🌡️ **Entités optionnelles :** Capteur de température de l'eau (°C) et entité d'objectif de volume (`input_number`, `number` ou `sensor`).
* 🖥️ **Navigateurs supportés :** Application Home Assistant Companion (Android/iOS), Chrome, Firefox, Safari, WebView Nest Hub.

---

## ✨ Points forts

* 🐠 **Aquarium entièrement animé :** Rendu vectoriel SVG haute fluidité, nage dynamique des poissons avec battement de nageoires et déplacement autonome.
* 🌿 **Algues réalistes en micro-points :** Texture granuleuse fidèle à la réalité s'intensifiant jusqu'à 48h sans douche.
* 🧹 **Ancistrus réaliste :** Modélisé en vue ventrale avec sa ventouse buccale, sa couronne de tentacules et ses nageoires déployées, grimpant le long de la vitre latérale.
* 🐌 **Faune diversifiée :** Escargots brouteurs sur le sable et sur les vitres latérales.
* 🎛️ **Contrôle total des animations :** Curseur de vitesse des poissons et curseur d'âge des algues pour tester et caler votre rendu idéal.
* ⚙️ **Configuration 100 % UI :** Tout se configure via l'éditeur de carte standard de Home Assistant.
* 🌍 **Bilingue :** Interface de configuration disponible en français 🇫🇷 et anglais 🇬🇧.

---

## 🚀 Installation

### Via HACS (recommandé)

1. Ouvrez HACS dans votre Home Assistant.
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
| `survival_volume` | Nombre | `10` | Volume d'eau de réserve avant disparition totale de l'eau. |
| `temp_boiling_threshold` | Nombre | `40` | Seuil d'apparition des bulles d'eau très chaude (°C). |
| `temp_deadly_threshold` | Nombre | `45` | Seuil critique de température (°C). |
| `algae_enabled` | Booléen | `true` | Active l'accumulation d'algues avec le temps. |
| `algae_delay_hours` | Nombre | `12` | Heures d'attente avant l'apparition des premières algues. |
| `debug_algae_hours` | Nombre | `0` | Curseur de forçage de l'âge des algues (0 à 48h). |
| `fish_speed_multiplier` | Nombre | `1.2` | Vitesse de nage des poissons (0.2 à 3.0). |
| `fullscreen` | Booléen | `false` | Mode plein écran immersif (sans bordures ni cartes de métriques). |
| `aspect_ratio_width` | Nombre | `1024` | Ratio d'affichage - Largeur. |
| `aspect_ratio_height` | Nombre | `600` | Ratio d'affichage - Hauteur. |

---

## 📝 Exemple de configuration YAML

```yaml
type: custom:shower-aquarium-card
entity: sensor.hydrao_shower_volume
temperature_entity: sensor.hydrao_shower_temperature
title: Douche Nolan
theme: freshwater
fish_count: 4
target_budget: 45
survival_volume: 10
fish_speed_multiplier: 1.2
algae_enabled: true
algae_delay_hours: 12
fullscreen: false
