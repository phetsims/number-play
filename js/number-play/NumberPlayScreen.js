// Copyright 2019, University of Colorado Boulder

/**
 * @author Chris Klusendorf
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayModel = require( 'NUMBER_PLAY/number-play/model/NumberPlayModel' );
  const NumberPlayScreenView = require( 'NUMBER_PLAY/number-play/view/NumberPlayScreenView' );

  class NumberPlayScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new NumberPlayModel( tandem.createTandem( 'model' ) ),
        model => new NumberPlayScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return numberPlay.register( 'NumberPlayScreen', NumberPlayScreen );
} );