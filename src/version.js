// shower-aquarium-card.js and card-editor.js both import CARD_VERSION from
// here rather than each declaring their own copy, so there is exactly one
// place to bump on release and no risk of the two drifting apart.
export const CARD_VERSION = "0.8.88";

// Where the card lives. The card picker of Home Assistant links to it (help
// link of the card editor), and a test checks it against package.json.
export const REPOSITORY_URL = "https://github.com/Adrien40/ha-shower-aquarium-card";
