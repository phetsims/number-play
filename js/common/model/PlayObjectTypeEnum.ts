// Copyright 2021, University of Colorado Boulder

/**
 * PlayObjectTypeEnum identifies the play object type in Number Play.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

const PlayObjectTypeValues = [ 'dog', 'apple', 'turtle', 'ball' ] as const;
type PlayObjectTypeEnum = ( typeof PlayObjectTypeValues )[number];

export { PlayObjectTypeValues, PlayObjectTypeEnum as default };