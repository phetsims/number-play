// Copyright 2019, University of Colorado Boulder

/**
 * The 'Ten' screen.
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
  const screenTenString = require( 'string!NUMBER_PLAY/screen.ten' );

  class TenScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const screenOptions = {
        name: screenTenString,
        backgroundColorProperty: new Property( NumberPlayConstants.TEN_SCREEN_BACKGROUND ),
        tandem: tandem
      };

      const screenViewConfig = {
        numberAccordionBoxConfig: {
          fill: NumberPlayConstants.GREEN_BACKGROUND,
          font: new PhetFont( 62 )
        },
        numeralAccordionBoxConfig: {
          fill: NumberPlayConstants.ORANGE_BACKGROUND,
          font: new PhetFont( 98 ),
          contentXMargin: 0,
          arrowButtonConfig: {
            arrowWidth: 20,
            arrowHeight: 20,
            spacing: 10
          }
        },
        tenFrameAccordionBoxConfig: {
          fill: NumberPlayConstants.GREEN_BACKGROUND
        },
        onesAccordionBoxConfig: {
          minWidth: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_WIDTH,
          maxWidth: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_WIDTH
        },
        objectsAccordionBoxConfig: {
          minWidth: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_WIDTH,
          maxWidth: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_WIDTH
        },
        upperAccordionBoxHeight: NumberPlayConstants.TEN_UPPER_ACCORDION_BOX_HEIGHT,
        lowerAccordionBoxHeight: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_HEIGHT,
        tandem: tandem.createTandem( 'view' )
      };

      super(
        () => new NumberPlayModel( NumberPlayConstants.TEN, tandem.createTandem( 'model' ) ),
        model => new NumberPlayScreenView( model, screenViewConfig ),
        screenOptions
      );
    }
  }

  return numberPlay.register( 'TenScreen', TenScreen );
} );