// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const NumberAccordionBox = require( 'NUMBER_PLAY/common/view/NumberAccordionBox' );
  const NumeralAccordionBox = require( 'NUMBER_PLAY/common/view/NumeralAccordionBox' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TenFrameAccordionBox = require( 'NUMBER_PLAY/common/view/TenFrameAccordionBox' );

  class NumberPlayScreenView extends ScreenView {

    /**
     * @param {NumberPlayModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      // create and add the NumberAccordionBox
      const numberAccordionBox = new NumberAccordionBox( model.currentNumberProperty, NumberPlayConstants.GREEN_BACKGROUND );
      numberAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.PANEL_X_MARGIN;
      numberAccordionBox.top = this.layoutBounds.minY + NumberPlayConstants.PANEL_TOP_MARGIN;
      this.addChild( numberAccordionBox );

      // create and add the NumeralAccordionBox
      const numeralAccordionBox = new NumeralAccordionBox( model.currentNumberProperty, NumberPlayConstants.ORANGE_BACKGROUND );
      numeralAccordionBox.centerX = this.layoutBounds.centerX;
      numeralAccordionBox.top = numberAccordionBox.top;
      this.addChild( numeralAccordionBox );

      // create and add the TenFrameAccordionBox
      const tenFrameAccordionBox = new TenFrameAccordionBox( model.currentNumberProperty, NumberPlayConstants.GREEN_BACKGROUND );
      tenFrameAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.PANEL_X_MARGIN;
      tenFrameAccordionBox.top = numberAccordionBox.top;
      this.addChild( tenFrameAccordionBox );

      // create and add the ResetAllButton
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel interactions that may be in progress
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_X_PADDING,
        bottom: this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
        tandem: tandem.createTandem( 'resetAllButton' )
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