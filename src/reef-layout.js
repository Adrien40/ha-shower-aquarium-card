// Where the things of the reef tank stand, in the 1024-wide drawing. The drawing
// of the decor (render/saltwater.js) and the walking area of the crab and the
// shrimp (physics.js) read it from here, so the crab really walks on its rocks.

/**
 * The pile of live rock in the right-hand corner. The crab lives on the flat
 * rock at three quarters of the height of the pile.
 */
export const REEF_PILE = Object.freeze({
  /** left and right ends of the pile */
  x0: 776,
  x1: 1010,
  /** height of the highest rock above the tank bottom */
  height: 254,
  /** height of the flat rock the crab walks on: three quarters of the pile */
  ledge: 190,
  /** the part of the flat rock the crab walks on */
  ledgeFrom: 880,
  ledgeTo: 940,
});
