// Copyright 2019-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import NumeralAccordionBox from '../../common/view/NumeralAccordionBox.js';
import numberPlay from '../../numberPlay.js';
import CompareCountingType from '../model/CompareCountingType.js';
import BlockValuesNode from './BlockValuesNode.js';
import CompareAccordionBox from './CompareAccordionBox.js';
import CompareNumberLineNode from './CompareNumberLineNode.js';

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
      expandedProperty: this.leftCompareAccordionBoxExpandedProperty,
      fill: NumberPlayConstants.LIGHT_GREEN_BACKGROUND
    } );
    leftCompareAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    leftCompareAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.ACCORDION_BOX_BOTTOM_MARGIN;
    this.addChild( leftCompareAccordionBox );

    // create and add the right CompareAccordionBox
    const rightCompareAccordionBox = new CompareAccordionBox( model.rightPlayArea, LOWER_ACCORDION_BOX_HEIGHT, {
      expandedProperty: this.rightCompareAccordionBoxExpandedProperty,
      fill: NumberPlayConstants.LIGHT_ORANGE_BACKGROUND
    } );
    rightCompareAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    rightCompareAccordionBox.bottom = leftCompareAccordionBox.bottom;
    this.addChild( rightCompareAccordionBox );

    // set the x-position of the NumeralAccordionBox's after the CompareObjectAccordionBoxes have been added
    leftNumeralAccordionBox.right = leftCompareAccordionBox.right;
    rightNumeralAccordionBox.left = rightCompareAccordionBox.left;

    // create and add the counting type radio button group
    const countingTypeToNode = {};
    countingTypeToNode[ CompareCountingType.BLOCKS ] = BlockValuesNode.getBlockValuesNode( 1, 2, false );
    countingTypeToNode[ CompareCountingType.NUMBER_LINE ] = CompareNumberLineNode.getNumberLineNode( new Range( 0, 5 ), false );
    countingTypeToNode[ CompareCountingType.NONE ] = new Path( eyeSlashSolidShape, { fill: Color.BLACK } );

    const countingTypeRadioButtons = CompareCountingType.VALUES.map( countingType => {
      const iconNode = countingTypeToNode[ countingType ];
      iconNode.maxWidth = 36;
      iconNode.maxHeight = 36;

      return {
        value: countingType,
        node: iconNode
      };
    } );
    const countingTypeRadioButtonGroup = new RectangularRadioButtonGroup(
      model.countingTypeProperty,
      countingTypeRadioButtons, {
        orientation: 'horizontal',
        baseColor: Color.WHITE,
        buttonContentXMargin: 8,
        buttonContentYMargin: 8
      }
    );
    countingTypeRadioButtonGroup.left = leftCompareAccordionBox.left;
    countingTypeRadioButtonGroup.top = leftNumeralAccordionBox.top;
    this.addChild( countingTypeRadioButtonGroup );

    // create and add the comparison signs checkbox
    const boxWidth = 30;
    const comparisonSignsCheckbox = new Checkbox(
      new Text( `${lessThanString} ${equalString} ${greaterThanString}`, { font: new PhetFont( 20 ) } ),
      model.comparisonSignsVisibleProperty, {
        boxWidth: boxWidth
      } );
    comparisonSignsCheckbox.left = countingTypeRadioButtonGroup.left;
    comparisonSignsCheckbox.top = countingTypeRadioButtonGroup.bottom + 14;
    this.addChild( comparisonSignsCheckbox );

    // create and add the comparison signs node
    const comparisonSignsNode = new Text( equalString, { font: new PhetFont( 90 ) } );
    comparisonSignsNode.centerX = this.layoutBounds.centerX;
    comparisonSignsNode.centerY = leftNumeralAccordionBox.centerY;
    this.addChild( comparisonSignsNode );

    // create and add the BlockValuesNode
    const blockValuesNode = new BlockValuesNode( model.leftCurrentNumberProperty, model.rightCurrentNumberProperty );
    this.addChild( blockValuesNode );

    const compareNumberLineNode = new CompareNumberLineNode( model.leftCurrentNumberProperty, model.rightCurrentNumberProperty );
    compareNumberLineNode.centerX = comparisonSignsNode.centerX;
    compareNumberLineNode.bottom = leftCompareAccordionBox.bottom - 6; // empirically determined tweak
    this.addChild( compareNumberLineNode );

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

    // update the visibility of the BlockValuesNode and NumberLineNode
    model.countingTypeProperty.link( countingType => {
      blockValuesNode.visible = countingType === CompareCountingType.BLOCKS;
      compareNumberLineNode.visible = countingType === CompareCountingType.NUMBER_LINE;
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