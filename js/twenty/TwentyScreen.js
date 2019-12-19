// Copyright 2019, University of Colorado Boulder

/**
 * The 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const Image = require( 'SCENERY/nodes/Image' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const NumberPlayModel = require( 'NUMBER_PLAY/common/model/NumberPlayModel' );
  const NumberPlayScreenView = require( 'NUMBER_PLAY/common/view/NumberPlayScreenView' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const screenTwentyString = require( 'string!NUMBER_PLAY/screen.twenty' );

  // images
  const twentyScreenIconImage = require( 'image!NUMBER_PLAY/twenty_screen_icon.png' );

  class TwentyScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const screenOptions = {
        name: screenTwentyString,
        backgroundColorProperty: new Property( NumberPlayConstants.TWENTY_SCREEN_BACKGROUND ),
        homeScreenIcon: new Image( twentyScreenIconImage ),
        tandem: tandem
      };

      const screenViewConfig = {
        wordAccordionBoxConfig: {
          fill: NumberPlayConstants.ORANGE_BACKGROUND,
          font: new PhetFont( 54 ),
          contentXMargin: 24, // empirically determined
          textOffsetY: -10,
          toggleControlOffset: new Vector2( -24, -7 ),
          speakerButtonOffset: new Vector2( 0, 38 ),
          speakerButtonScale: 0.8
        },
        numeralAccordionBoxConfig: {
          fill: NumberPlayConstants.GREEN_BACKGROUND,
          font: new PhetFont( 76 ),
          arrowButtonConfig: {
            arrowWidth: 15,  // empirically determined
            arrowHeight: 15, // empirically determined
            spacing: 5       // empirically determined
          }
        },
        tenFrameAccordionBoxConfig: {
          fill: NumberPlayConstants.ORANGE_BACKGROUND,
          contentAlign: 'right'
        },
        onesAccordionBoxConfig: {
          minWidth: NumberPlayConstants.TWENTY_ONES_ACCORDION_BOX_WIDTH,
          maxWidth: NumberPlayConstants.TWENTY_ONES_ACCORDION_BOX_WIDTH,
          contentWidth: 494 // empirically determined
        },
        objectsAccordionBoxConfig: {
          minWidth: NumberPlayConstants.TWENTY_OBJECTS_ACCORDION_BOX_WIDTH,
          maxWidth: NumberPlayConstants.TWENTY_OBJECTS_ACCORDION_BOX_WIDTH,
          contentWidth: 260,                         // empirically determined
          radioButtonSize: new Dimension2( 19, 19 ), // empirically determined
          radioButtonSpacing: 7                      // empirically determined
        },
        upperAccordionBoxHeight: NumberPlayConstants.TWENTY_UPPER_ACCORDION_BOX_HEIGHT,
        lowerAccordionBoxHeight: NumberPlayConstants.TWENTY_LOWER_ACCORDION_BOX_HEIGHT,
        tandem: tandem.createTandem( 'view' )
      };

      super(
        () => new NumberPlayModel(
          NumberPlayConstants.TWENTY,
          new Vector2( 16, 286 ), // empirically determined
          1.3,                    // empirically determined
          new Vector2( 0, 10 ),   // empirically determined
          tandem.createTandem( 'model' )
        ),
        model => new NumberPlayScreenView( model, screenViewConfig ),
        screenOptions
      );
    }
  }

  return numberPlay.register( 'TwentyScreen', TwentyScreen );
} );