// Copyright 2019, University of Colorado Boulder

/**
 * Play object types for Number Play.
 *
 * @author Chris Klusendorf
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );

  // @public
  const PlayObjectType = new Enumeration( [ 'DOG', 'APPLE', 'TURTLE', 'CIRCLE' ] );

  return numberPlay.register( 'PlayObjectType', PlayObjectType );
} );