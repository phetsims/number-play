// Copyright 2019, University of Colorado Boulder

/**
 * @author Chris Klusendorf
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