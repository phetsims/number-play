// Copyright 2019, University of Colorado Boulder

/**
 * The 'Ten' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const TenModel = require( 'NUMBER_PLAY/ten/model/TenModel' );
  const TenScreenView = require( 'NUMBER_PLAY/ten/view/TenScreenView' );

  // strings
  const screenTenString = require( 'string!NUMBER_PLAY/screen.ten' );

  class TenScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenTenString,
        backgroundColorProperty: new Property( NumberPlayConstants.TEN_SCREEN_BACKGROUND ),
        tandem: tandem
      };

      super(
        () => new TenModel( tandem.createTandem( 'model' ) ),
        model => new TenScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return numberPlay.register( 'TenScreen', TenScreen );
} );