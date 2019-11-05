// Copyright 2019, University of Colorado Boulder

/**
 * The 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CompareModel = require( 'NUMBER_PLAY/compare/model/CompareModel' );
  const CompareScreenView = require( 'NUMBER_PLAY/compare/view/CompareScreenView' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenCompareString = require( 'string!NUMBER_PLAY/screen.compare' );

  class CompareScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenCompareString,
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new CompareModel( tandem.createTandem( 'model' ) ),
        model => new CompareScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return numberPlay.register( 'CompareScreen', CompareScreen );
} );