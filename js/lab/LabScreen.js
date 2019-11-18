// Copyright 2019, University of Colorado Boulder

/**
 * The 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const LabModel = require( 'NUMBER_PLAY/lab/model/LabModel' );
  const LabScreenView = require( 'NUMBER_PLAY/lab/view/LabScreenView' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const screenLabString = require( 'string!NUMBER_PLAY/screen.lab' );

  // images
  const labScreenIconImage = require( 'image!NUMBER_PLAY/lab_screen_icon.png' );

  class LabScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenLabString,
        backgroundColorProperty: new Property( 'white' ),
        homeScreenIcon: new Image( labScreenIconImage ),
        tandem: tandem
      };

      super(
        () => new LabModel(
          100,
          new Vector2( 16, 262 ), // empirically determined
          1.6,                    // empirically determined
          tandem.createTandem( 'model' ) ),
        model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return numberPlay.register( 'LabScreen', LabScreen );
} );