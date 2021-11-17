// Copyright 2021, University of Colorado Boulder

/**
 * CardinalityRepresentationTypeEnum identifies the sum representation types in the 'Cardinality' game in Number Play.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

const CardinalityRepresentationTypeValues = [ 'tenFrame', 'objects' ] as const;
type CardinalityRepresentationTypeEnum = ( typeof CardinalityRepresentationTypeValues )[number];

export { CardinalityRepresentationTypeValues, CardinalityRepresentationTypeEnum as default };