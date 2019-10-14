// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
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
     * @param {Object} config
     */
    constructor( model, config ) {

      config = merge( {

        // config for NumberAccordionBox. see NumberAccordionBox for additional fields
        numberAccordionBoxConfig: {
          fill: null // {ColorDef} @required - accordion box background fill
        },

        // config for NumeralAccordionBox. see NumeralAccordionBox for additional fields
        numeralAccordionBoxConfig: {
          fill: null // {ColorDef} @required - accordion box background fill
        },

        // config for TenFrameAccordionBox.
        tenFrameAccordionBoxConfig: {
          fill: null // {ColorDef} @required - accordion box background fill
        },

        // config for OnesAccordionBox.
        onesAccordionBoxConfig: {
          minWidth: null, // {number} @required
          maxWidth: null // {number} @required
        },

        // config for ObjectsAccordionBox.
        objectsAccordionBoxConfig: {
          minWidth: null, // {number} @required
          maxWidth: null // {number} @required
        },

        // accordion box heights. these are not part of specific accordion box configs because they apply to
        // multiple accordion boxes.
        upperAccordionBoxHeight: null, // {number} @required
        lowerAccordionBoxHeight: null, // {number} @required

        // phet-io
        tandem: config.tandem
      }, config );

      super( config );

      // check for required config
      assert && assert( config.numberAccordionBoxConfig.fill, 'fill is required' );
      assert && assert( config.numeralAccordionBoxConfig.fill, 'fill is required' );
      assert && assert( config.tenFrameAccordionBoxConfig.fill, 'fill is required' );
      assert && assert( config.onesAccordionBoxConfig.minWidth, 'minWidth is required' );
      assert && assert( config.onesAccordionBoxConfig.maxWidth, 'maxWidth is required' );
      assert && assert( config.objectsAccordionBoxConfig.minWidth, 'minWidth is required' );
      assert && assert( config.objectsAccordionBoxConfig.maxWidth, 'maxWidth is required' );
      assert && assert( config.upperAccordionBoxHeight, 'upperAccordionBoxHeight is required' );
      assert && assert( config.lowerAccordionBoxHeight, 'lowerAccordionBoxHeight is required' );

      // @public {BooleanProperty} - Properties used to control the expanded state of each accordion box
      this.numberAccordionBoxExpandedProperty = new BooleanProperty( false );
      this.numeralAccordionBoxExpandedProperty = new BooleanProperty( true );
      this.tenFrameAccordionBoxExpandedProperty = new BooleanProperty( false );
      this.onesAccordionBoxExpandedProperty = new BooleanProperty( true );
      this.objectsAccordionBoxExpandedProperty = new BooleanProperty( true );

      // create and add the NumberAccordionBox
      const numberAccordionBox = new NumberAccordionBox(
        model.currentNumberProperty,
        config.upperAccordionBoxHeight, merge( {
          expandedProperty: this.numberAccordionBoxExpandedProperty
        }, config.numberAccordionBoxConfig ) );
      numberAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      numberAccordionBox.top = this.layoutBounds.minY + NumberPlayConstants.ACCORDION_BOX_TOP_MARGIN;
      this.addChild( numberAccordionBox );

      // create and add the NumeralAccordionBox
      const numeralAccordionBox = new NumeralAccordionBox(
        model.currentNumberProperty,
        config.upperAccordionBoxHeight, merge( {
          expandedProperty: this.numeralAccordionBoxExpandedProperty
        }, config.numeralAccordionBoxConfig ) );
      numeralAccordionBox.centerX = this.layoutBounds.centerX;
      numeralAccordionBox.top = numberAccordionBox.top;
      this.addChild( numeralAccordionBox );

      // create and add the TenFrameAccordionBox
      const tenFrameAccordionBox = new TenFrameAccordionBox(
        model.currentNumberProperty,
        config.upperAccordionBoxHeight, merge( {
          expandedProperty: this.tenFrameAccordionBoxExpandedProperty
        }, config.tenFrameAccordionBoxConfig ) );
      tenFrameAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      tenFrameAccordionBox.top = numberAccordionBox.top;
      this.addChild( tenFrameAccordionBox );

      // create and add the OnesAccordionBox
      const onesAccordionBox = new OnesAccordionBox(
        model.currentNumberProperty,
        config.lowerAccordionBoxHeight, merge( {
          expandedProperty: this.onesAccordionBoxExpandedProperty
        }, config.onesAccordionBoxConfig ) );
      onesAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      onesAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.ACCORDION_BOX_BOTTOM_MARGIN;
      this.addChild( onesAccordionBox );

      // create and add the ObjectsAccordionBox
      const objectsAccordionBox = new ObjectsAccordionBox(
        model.currentNumberProperty,
        config.lowerAccordionBoxHeight, merge( {
          expandedProperty: this.objectsAccordionBoxExpandedProperty
        }, config.objectsAccordionBoxConfig ) );
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
        tandem: config.tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

    /**
     * Resets the view.
     * @public
     */
    reset() {
      this.numberAccordionBoxExpandedProperty.reset();
      this.numeralAccordionBoxExpandedProperty.reset();
      this.tenFrameAccordionBoxExpandedProperty.reset();
      this.onesAccordionBoxExpandedProperty.reset();
      this.objectsAccordionBoxExpandedProperty.reset();
    }
  }

  return numberPlay.register( 'NumberPlayScreenView', NumberPlayScreenView );
} );