// Copyright 2019, University of Colorado Boulder

/**
 * The 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const TwentyModel = require( 'NUMBER_PLAY/twenty/model/TwentyModel' );
  const TwentyScreenView = require( 'NUMBER_PLAY/twenty/view/TwentyScreenView' );

  // strings
  const screenTwentyString = require( 'string!NUMBER_PLAY/screen.twenty' );

  class TwentyScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenTwentyString,
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new TwentyModel( tandem.createTandem( 'model' ) ),
        model => new TwentyScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return numberPlay.register( 'TwentyScreen', TwentyScreen );
} );