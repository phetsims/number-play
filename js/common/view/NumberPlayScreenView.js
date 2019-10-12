// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const NumberAccordionBox = require( 'NUMBER_PLAY/common/view/NumberAccordionBox' );
  const NumeralAccordionBox = require( 'NUMBER_PLAY/common/view/NumeralAccordionBox' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ObjectsAccordionBox = require( 'NUMBER_PLAY/common/view/ObjectsAccordionBox' );
  const OnesAccordionBox = require( 'NUMBER_PLAY/common/view/OnesAccordionBox' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TenFrameAccordionBox = require( 'NUMBER_PLAY/common/view/TenFrameAccordionBox' );

  class NumberPlayScreenView extends ScreenView {

    /**
     * @param {NumberPlayModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = merge( {

        // accordion box sizing. defaults are for the 'Ten' screen.
        upperAccordionBoxHeight: NumberPlayConstants.TEN_UPPER_ACCORDION_BOX_HEIGHT,
        lowerAccordionBoxHeight: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_HEIGHT,
        onesAccordionBoxWidth: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_WIDTH,
        objectsAccordionBoxWidth: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_WIDTH,

        // accordion box background fills. defaults are for the 'Ten' screen.
        numberAccordionBoxFill: NumberPlayConstants.GREEN_BACKGROUND,
        numeralAccordionBoxFill: NumberPlayConstants.ORANGE_BACKGROUND,
        tenFrameAccordionBoxFill: NumberPlayConstants.GREEN_BACKGROUND,

        // phet-io
        tandem: options.tandem
      }, options );

      super( options );

      // create and add the NumberAccordionBox
      const numberAccordionBox = new NumberAccordionBox(
        model.currentNumberProperty,
        options.upperAccordionBoxHeight,
        options.numberAccordionBoxFill
      );
      numberAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      numberAccordionBox.top = this.layoutBounds.minY + NumberPlayConstants.ACCORDION_BOX_TOP_MARGIN;
      this.addChild( numberAccordionBox );

      // create and add the NumeralAccordionBox
      const numeralAccordionBox = new NumeralAccordionBox(
        model.currentNumberProperty,
        options.upperAccordionBoxHeight,
        options.numeralAccordionBoxFill
      );
      numeralAccordionBox.centerX = this.layoutBounds.centerX;
      numeralAccordionBox.top = numberAccordionBox.top;
      this.addChild( numeralAccordionBox );

      // create and add the TenFrameAccordionBox
      const tenFrameAccordionBox = new TenFrameAccordionBox(
        model.currentNumberProperty,
        options.upperAccordionBoxHeight,
        options.tenFrameAccordionBoxFill
      );
      tenFrameAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      tenFrameAccordionBox.top = numberAccordionBox.top;
      this.addChild( tenFrameAccordionBox );

      // create and add the OnesAccordionBox
      const onesAccordionBox = new OnesAccordionBox(
        model.currentNumberProperty,
        options.onesAccordionBoxWidth,
        options.lowerAccordionBoxHeight
      );
      onesAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      onesAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.ACCORDION_BOX_BOTTOM_MARGIN;
      this.addChild( onesAccordionBox );

      // create and add the ObjectsAccordionBox
      const objectsAccordionBox = new ObjectsAccordionBox(
        model.currentNumberProperty,
        options.objectsAccordionBoxWidth,
        options.lowerAccordionBoxHeight
      );
      objectsAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      objectsAccordionBox.bottom = onesAccordionBox.bottom;
      this.addChild( objectsAccordionBox );

      // create and add the ResetAllButton
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel interactions that may be in progress
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_X_PADDING,
        bottom: this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
        tandem: options.tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

    /**
     * Resets the view.
     * @public
     */
    reset() {
      //TODO
    }
  }

  return numberPlay.register( 'NumberPlayScreenView', NumberPlayScreenView );
} );