// Copyright 2019, University of Colorado Boulder

/**
 * The 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const NumberPlayModel = require( 'NUMBER_PLAY/common/model/NumberPlayModel' );
  const NumberPlayScreenView = require( 'NUMBER_PLAY/common/view/NumberPlayScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenTwentyString = require( 'string!NUMBER_PLAY/screen.twenty' );

  class TwentyScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const screenOptions = {
        name: screenTwentyString,
        backgroundColorProperty: new Property( NumberPlayConstants.TWENTY_SCREEN_BACKGROUND ),
        tandem: tandem
      };

      const screenViewOptions = {
        numberAccordionBoxFill: NumberPlayConstants.ORANGE_BACKGROUND,
        numeralAccordionBoxFill: NumberPlayConstants.GREEN_BACKGROUND,
        tenFrameAccordionBoxFill: NumberPlayConstants.ORANGE_BACKGROUND,
        onesAccordionBoxWidth: NumberPlayConstants.TWENTY_ONES_ACCORDION_BOX_WIDTH,
        objectsAccordionBoxWidth: NumberPlayConstants.TWENTY_OBJECTS_ACCORDION_BOX_WIDTH,
        tandem: tandem.createTandem( 'view' )
      };

      super(
        () => new NumberPlayModel( NumberPlayConstants.TWENTY, tandem.createTandem( 'model' ) ),
        model => new NumberPlayScreenView( model, screenViewOptions ),
        screenOptions
      );
    }
  }

  return numberPlay.register( 'TwentyScreen', TwentyScreen );
} );