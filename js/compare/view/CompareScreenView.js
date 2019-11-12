// Copyright 2019, University of Colorado Boulder

/**
 * ScreenView for the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const CompareAccordionBox = require( 'NUMBER_PLAY/compare/view/CompareAccordionBox' );
  const merge = require( 'PHET_CORE/merge' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const NumeralAccordionBox = require( 'NUMBER_PLAY/common/view/NumeralAccordionBox' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ScreenView = require( 'JOIST/ScreenView' );

  // constants
  const UPPER_ACCORDION_BOX_HEIGHT = 120; // empirically determined, in screen coordinates
  const LOWER_ACCORDION_BOX_HEIGHT = 426; // empirically determined, in screen coordinates

  // strings
  const lessThanString = '<';
  const equalString = '=';
  const greaterThanString = '>';

  class CompareScreenView extends ScreenView {

    /**
     * @param {CompareModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      // @public
      this.leftNumeralAccordionBoxExpandedProperty = new BooleanProperty( true );
      this.rightNumeralAccordionBoxExpandedProperty = new BooleanProperty( true );
      this.leftCompareAccordionBoxExpandedProperty = new BooleanProperty( true );
      this.rightCompareAccordionBoxExpandedProperty = new BooleanProperty( true );

      // config for the left and right NumeralAccordionBox
      const numeralAccordionBoxConfig = {
        fill: NumberPlayConstants.WHITE_BACKGROUND,
        font: new PhetFont( 90 ),
        arrowButtonConfig: {
          arrowWidth: 18,  // empirically determined
          arrowHeight: 18, // empirically determined
          spacing: 7       // empirically determined
        }
      };

      // create and add the left NumeralAccordionBox
      const leftNumeralAccordionBox = new NumeralAccordionBox(
        model.leftCurrentNumberProperty,
        UPPER_ACCORDION_BOX_HEIGHT, merge( {
          expandedProperty: this.leftNumeralAccordionBoxExpandedProperty
        }, numeralAccordionBoxConfig ) );
      leftNumeralAccordionBox.top = this.layoutBounds.minY + NumberPlayConstants.ACCORDION_BOX_TOP_MARGIN;
      this.addChild( leftNumeralAccordionBox );

      // create and add the right NumeralAccordionBox
      const rightNumeralAccordionBox = new NumeralAccordionBox(
        model.rightCurrentNumberProperty,
        UPPER_ACCORDION_BOX_HEIGHT, merge( {
          expandedProperty: this.rightNumeralAccordionBoxExpandedProperty
        }, numeralAccordionBoxConfig ) );
      rightNumeralAccordionBox.top = leftNumeralAccordionBox.top;
      this.addChild( rightNumeralAccordionBox );

      // create and add the left CompareAccordionBox
      const leftCompareAccordionBox = new CompareAccordionBox( model.leftPlayArea, LOWER_ACCORDION_BOX_HEIGHT, {
        expandedProperty: this.leftCompareAccordionBoxExpandedProperty
      } );
      leftCompareAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      leftCompareAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.ACCORDION_BOX_BOTTOM_MARGIN;
      this.addChild( leftCompareAccordionBox );

      // create and add the right CompareAccordionBox
      const rightCompareAccordionBox = new CompareAccordionBox( model.rightPlayArea, LOWER_ACCORDION_BOX_HEIGHT, {
        expandedProperty: this.rightCompareAccordionBoxExpandedProperty
      } );
      rightCompareAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
      rightCompareAccordionBox.bottom = leftCompareAccordionBox.bottom;
      this.addChild( rightCompareAccordionBox );

      // set the x-position of the NumeralAccordionBox's after the CompareObjectAccordionBoxes have been added
      leftNumeralAccordionBox.right = leftCompareAccordionBox.right;
      rightNumeralAccordionBox.left = rightCompareAccordionBox.left;

      // create and add the comparison signs checkbox
      const comparisonSignsCheckbox = new Checkbox(
        new Text( `${lessThanString} ${equalString} ${greaterThanString}`, { font: new PhetFont( 20 ) } ),
        model.comparisonSignsVisibleProperty, {
          boxWidth: 30
        }
      );
      comparisonSignsCheckbox.left = leftCompareAccordionBox.left;
      comparisonSignsCheckbox.top = leftNumeralAccordionBox.top;
      this.addChild( comparisonSignsCheckbox );

      // create and add the comparison signs node
      const comparisonSignsNode = new Text( equalString, { font: new PhetFont( 90 ) } );
      comparisonSignsNode.centerX = this.layoutBounds.centerX;
      comparisonSignsNode.centerY = leftNumeralAccordionBox.centerY;
      this.addChild( comparisonSignsNode );

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

      // update the comparison signs node's text when either current number changes
      Property.multilink( [ model.leftCurrentNumberProperty, model.rightCurrentNumberProperty ],
        ( leftCurrentNumber, rightCurrentNumber ) => {
          comparisonSignsNode.text = leftCurrentNumber < rightCurrentNumber ? lessThanString :
                                     leftCurrentNumber > rightCurrentNumber ? greaterThanString : equalString;
        } );

      // update the visibility of the comparison signs node
      model.comparisonSignsVisibleProperty.link( visible => {
        comparisonSignsNode.visible = visible;
      } );
    }

    /**
     * Resets the view.
     * @public
     */
    reset() {
      this.leftNumeralAccordionBoxExpandedProperty.reset();
      this.rightNumeralAccordionBoxExpandedProperty.reset();
      this.leftCompareAccordionBoxExpandedProperty.reset();
      this.rightCompareAccordionBoxExpandedProperty.reset();
    }
  }

  return numberPlay.register( 'CompareScreenView', CompareScreenView );
} );