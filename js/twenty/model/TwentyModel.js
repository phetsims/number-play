// Copyright 2019, University of Colorado Boulder

/**
 * Model for the 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayModel = require( 'NUMBER_PLAY/common/model/NumberPlayModel' );

  /**
   * @constructor
   */
  class TwentyModel extends NumberPlayModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super( tandem );
    }
  }

  return numberPlay.register( 'TwentyModel', TwentyModel );
} );