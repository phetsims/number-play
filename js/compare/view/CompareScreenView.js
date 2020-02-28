// Copyright 2019-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import NumeralAccordionBox from '../../common/view/NumeralAccordionBox.js';
import numberPlay from '../../numberPlay.js';
import BlockValuesNode from './BlockValuesNode.js';
import CompareAccordionBox from './CompareAccordionBox.js';

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
    const boxWidth = 30;
    const comparisonSignsCheckbox = new Checkbox(
      new Text( `${lessThanString} ${equalString} ${greaterThanString}`, { font: new PhetFont( 20 ) } ),
      model.comparisonSignsVisibleProperty, {
        boxWidth: boxWidth
      } );
    comparisonSignsCheckbox.left = leftCompareAccordionBox.left;
    comparisonSignsCheckbox.top = leftNumeralAccordionBox.top;
    this.addChild( comparisonSignsCheckbox );

    // create and add the block values checkbox
    const blockValuesCheckbox = new Checkbox(
      BlockValuesNode.getBlockValuesNode( 1, 2, false ),
      model.blockValuesVisibleProperty, {
        boxWidth: boxWidth,
        spacing: 7
      } );
    blockValuesCheckbox.left = comparisonSignsCheckbox.left;
    blockValuesCheckbox.top = comparisonSignsCheckbox.bottom + 14;
    this.addChild( blockValuesCheckbox );

    // create and add the comparison signs node
    const comparisonSignsNode = new Text( equalString, { font: new PhetFont( 90 ) } );
    comparisonSignsNode.centerX = this.layoutBounds.centerX;
    comparisonSignsNode.centerY = leftNumeralAccordionBox.centerY;
    this.addChild( comparisonSignsNode );

    // create and add the BlockValuesNode
    const blockValuesNode = new BlockValuesNode( model.leftCurrentNumberProperty, model.rightCurrentNumberProperty );
    this.addChild( blockValuesNode );

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

    // update the comparison signs node's text and the BlockValuesNode when either current number changes
    Property.multilink( [ model.leftCurrentNumberProperty, model.rightCurrentNumberProperty ],
      ( leftCurrentNumber, rightCurrentNumber ) => {
        comparisonSignsNode.text = leftCurrentNumber < rightCurrentNumber ? lessThanString :
                                   leftCurrentNumber > rightCurrentNumber ? greaterThanString : equalString;

        blockValuesNode.removeAllChildren();
        blockValuesNode.addChild( BlockValuesNode.getBlockValuesNode( leftCurrentNumber, rightCurrentNumber, true ) );
        blockValuesNode.centerX = comparisonSignsNode.centerX;
        blockValuesNode.bottom = leftCompareAccordionBox.bottom - 2; // empirically determined tweak
      } );

    // update the visibility of the comparison signs node
    model.comparisonSignsVisibleProperty.link( visible => {
      comparisonSignsNode.visible = visible;
    } );

    // update the visibility of the BlockValuesNode
    model.blockValuesVisibleProperty.link( visible => {
      blockValuesNode.visible = visible;
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

numberPlay.register( 'CompareScreenView', CompareScreenView );
export default CompareScreenView;