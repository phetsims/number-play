// Copyright 2021, University of Colorado Boulder

/**
 *  NumberPlayGameTypeEnum identifies the game type in Number Play.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

const NumberPlayGameTypeValues = [ 'counting', 'subitize' ] as const;
type NumberPlayGameTypeEnum = ( typeof NumberPlayGameTypeValues )[number];

export { NumberPlayGameTypeValues };
export type { NumberPlayGameTypeEnum as default };