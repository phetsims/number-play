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
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
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

      const screenViewConfig = {
        numberAccordionBoxConfig: {
          fill: NumberPlayConstants.ORANGE_BACKGROUND,
          font: new PhetFont( 54 ),
          contentXMargin: 24
        },
        numeralAccordionBoxConfig: {
          fill: NumberPlayConstants.GREEN_BACKGROUND,
          font: new PhetFont( 76 ),
          arrowButtonConfig: {
            arrowWidth: 15,
            arrowHeight: 15,
            spacing: 5
          }
        },
        tenFrameAccordionBoxConfig: {
          fill: NumberPlayConstants.ORANGE_BACKGROUND,
          contentAlign: 'right'
        },
        onesAccordionBoxConfig: {
          minWidth: NumberPlayConstants.TWENTY_ONES_ACCORDION_BOX_WIDTH,
          maxWidth: NumberPlayConstants.TWENTY_ONES_ACCORDION_BOX_WIDTH
        },
        objectsAccordionBoxConfig: {
          minWidth: NumberPlayConstants.TWENTY_OBJECTS_ACCORDION_BOX_WIDTH,
          maxWidth: NumberPlayConstants.TWENTY_OBJECTS_ACCORDION_BOX_WIDTH
        },
        upperAccordionBoxHeight: NumberPlayConstants.TWENTY_UPPER_ACCORDION_BOX_HEIGHT,
        lowerAccordionBoxHeight: NumberPlayConstants.TWENTY_LOWER_ACCORDION_BOX_HEIGHT,
        tandem: tandem.createTandem( 'view' )
      };

      super(
        () => new NumberPlayModel( NumberPlayConstants.TWENTY, tandem.createTandem( 'model' ) ),
        model => new NumberPlayScreenView( model, screenViewConfig ),
        screenOptions
      );
    }
  }

  return numberPlay.register( 'TwentyScreen', TwentyScreen );
} );