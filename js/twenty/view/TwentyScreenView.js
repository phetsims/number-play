// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView for the 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayScreenView = require( 'NUMBER_PLAY/common/view/NumberPlayScreenView' );

  class TwentyScreenView extends NumberPlayScreenView {

    /**
     * @param {NumberPlayModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {
      super( model, tandem );
    }
  }

  return numberPlay.register( 'TwentyScreenView', TwentyScreenView );
} );