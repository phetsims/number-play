// Copyright 2021, University of Colorado Boulder

/**
 * CountingRepresentationTypeEnum identifies the sum representation types in the 'Counting' game in Number Play.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

const CountingRepresentationTypeValues = [ 'tenFrame', 'objects' ] as const;
type CountingRepresentationTypeEnum = ( typeof CountingRepresentationTypeValues )[number];

export { CountingRepresentationTypeValues };
export type { CountingRepresentationTypeEnum as default };
