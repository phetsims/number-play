// Copyright 2019, University of Colorado Boulder

/**
 * The 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const LabModel = require( 'NUMBER_PLAY/lab/model/LabModel' );
  const LabScreenView = require( 'NUMBER_PLAY/lab/view/LabScreenView' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenLabString = require( 'string!NUMBER_PLAY/screen.lab' );

  class LabScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenLabString,
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new LabModel( tandem.createTandem( 'model' ) ),
        model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return numberPlay.register( 'LabScreen', LabScreen );
} );