// Copyright 2019, University of Colorado Boulder

/**
 * Base class for the models in Number Play.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );

  class NumberPlayModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      //TODO
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      //TODO
    }
  }

  return numberPlay.register( 'NumberPlayModel', NumberPlayModel );
} );