// Copyright 2019, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );

  const NumberPlayQueryParameters = QueryStringMachine.getAll( {

    // Initializes the numbers in the OnesAccordionBox as pickable or not. Only needed during development to satisfy CT.
    onesArePickable: {
      type: 'flag'
    }
  } );

  return numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
} );
