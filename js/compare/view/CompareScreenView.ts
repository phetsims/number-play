// Copyright 2019-2021, University of Colorado Boulder

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
import { Text, voicingManager } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import LocaleSwitch from '../../common/view/LocaleSwitch.js';
import SpeechSynthesisButton from '../../common/view/SpeechSynthesisButton.js';
import TotalAccordionBox, { TotalAccordionBoxOptions } from '../../common/view/TotalAccordionBox.js';
import numberPlay from '../../numberPlay.js';
import CompareCountingType from '../model/CompareCountingType.js';
import CompareModel from '../model/CompareModel.js';
import BlockValuesNode from './BlockValuesNode.js';
import CompareAccordionBox from './CompareAccordionBox.js';
import CompareCountingTypeRadioButtonGroup from './CompareCountingTypeRadioButtonGroup.js';
import CompareNumberLineNode from './CompareNumberLineNode.js';
import ComparisonTextNode from './ComparisonTextNode.js';

// constants
const UPPER_ACCORDION_BOX_HEIGHT = 90; // empirically determined, in screen coordinates
const LOWER_ACCORDION_BOX_HEIGHT = 426; // empirically determined, in screen coordinates

// strings
const lessThanString = '<';
const equalString = '=';
const greaterThanString = '>';

class CompareScreenView extends ScreenView {
  public readonly leftTotalAccordionBoxExpandedProperty: BooleanProperty;
  public readonly rightTotalAccordionBoxExpandedProperty: BooleanProperty;
  public readonly rightCompareAccordionBoxExpandedProperty: BooleanProperty;
  public readonly leftCompareAccordionBoxExpandedProperty: BooleanProperty;

  constructor( model: CompareModel, tandem: Tandem ) {

    super( { tandem: tandem } );

    this.leftTotalAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.rightTotalAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.leftCompareAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.rightCompareAccordionBoxExpandedProperty = new BooleanProperty( true );

    // config for the left and right TotalAccordionBox
    const totalAccordionBoxOptions = {
      fill: NumberPlayColors.whiteBackgroundColorProperty,
      font: new PhetFont( 90 ),
      arrowButtonOptions: {
        arrowWidth: 18, // empirically determined
        arrowHeight: 18 // empirically determined
      },
      arrowButtonSpacing: 7 // empirically determined
    };

    // create and add the left TotalAccordionBox
    const leftTotalAccordionBox = new TotalAccordionBox(
      model.leftCurrentNumberProperty,
      UPPER_ACCORDION_BOX_HEIGHT, merge( {
        expandedProperty: this.leftTotalAccordionBoxExpandedProperty
      }, totalAccordionBoxOptions ) as TotalAccordionBoxOptions );
    leftTotalAccordionBox.top = this.layoutBounds.minY + NumberPlayConstants.ACCORDION_BOX_TOP_MARGIN;
    this.addChild( leftTotalAccordionBox );

    // create and add the right TotalAccordionBox
    const rightTotalAccordionBox = new TotalAccordionBox(
      model.rightCurrentNumberProperty,
      UPPER_ACCORDION_BOX_HEIGHT, merge( {
        expandedProperty: this.rightTotalAccordionBoxExpandedProperty
      }, totalAccordionBoxOptions ) as TotalAccordionBoxOptions );
    rightTotalAccordionBox.top = leftTotalAccordionBox.top;
    this.addChild( rightTotalAccordionBox );

    // create and add the left CompareAccordionBox
    const leftCompareAccordionBox = new CompareAccordionBox( model.leftPlayArea, LOWER_ACCORDION_BOX_HEIGHT, {
      expandedProperty: this.leftCompareAccordionBoxExpandedProperty,
      fill: NumberPlayColors.lightGreenBackgroundColorProperty
    } );
    leftCompareAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    leftCompareAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.ACCORDION_BOX_BOTTOM_MARGIN;
    this.addChild( leftCompareAccordionBox );

    // create and add the right CompareAccordionBox
    const rightCompareAccordionBox = new CompareAccordionBox( model.rightPlayArea, LOWER_ACCORDION_BOX_HEIGHT, {
      expandedProperty: this.rightCompareAccordionBoxExpandedProperty,
      fill: NumberPlayColors.lightOrangeBackgroundColorProperty
    } );
    rightCompareAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    rightCompareAccordionBox.bottom = leftCompareAccordionBox.bottom;
    this.addChild( rightCompareAccordionBox );

    // set the x-position of the TotalAccordionBox's after the CompareObjectAccordionBoxes have been added
    leftTotalAccordionBox.right = leftCompareAccordionBox.right;
    rightTotalAccordionBox.left = rightCompareAccordionBox.left;

    // create and add the CompareCountingTypeRadioButtonGroup
    const countingTypeRadioButtonGroup = new CompareCountingTypeRadioButtonGroup( model.countingTypeProperty );
    countingTypeRadioButtonGroup.left = leftCompareAccordionBox.left;
    countingTypeRadioButtonGroup.top = leftTotalAccordionBox.top;
    this.addChild( countingTypeRadioButtonGroup );

    // create and add the show comparison checkbox
    const boxWidth = 30;
    const showComparisonCheckbox = new Checkbox(
      new Text( `${lessThanString} ${equalString} ${greaterThanString}`, { font: new PhetFont( 20 ) } ),
      model.comparisonSignsAndTextVisibleProperty, {
        boxWidth: boxWidth
      } );
    showComparisonCheckbox.left = countingTypeRadioButtonGroup.left;
    showComparisonCheckbox.top = countingTypeRadioButtonGroup.bottom + 13; // empirically determined
    this.addChild( showComparisonCheckbox );

    // create and add the comparison signs node
    const comparisonSignsNode = new Text( equalString, { font: new PhetFont( 90 ) } );
    this.addChild( comparisonSignsNode );
    comparisonSignsNode.centerX = this.layoutBounds.centerX;
    comparisonSignsNode.centerY = leftTotalAccordionBox.centerY;

    // create and add the ComparisonTextNode
    const comparisonTextNode = new ComparisonTextNode(
      model.leftCurrentNumberProperty,
      model.rightCurrentNumberProperty,
      this.layoutBounds
    );
    comparisonTextNode.centerY = new Range( leftTotalAccordionBox.bottom, leftCompareAccordionBox.top ).getCenter();
    this.addChild( comparisonTextNode );

    // create and add the BlockValuesNode
    const blockValuesNode = new BlockValuesNode( model.leftCurrentNumberProperty, model.rightCurrentNumberProperty );
    this.addChild( blockValuesNode );

    // create and add the CompareNumberLineNode
    const compareNumberLineNode = new CompareNumberLineNode( model.leftCurrentNumberProperty, model.rightCurrentNumberProperty );
    compareNumberLineNode.x = comparisonSignsNode.centerX;
    compareNumberLineNode.bottom = leftCompareAccordionBox.bottom - 4; // empirically determined adjustment
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

    // positioning variables for the LocaleSwitch that depend on whether the SpeechSynthesisButton is created below
    let localeSwitchXRange;
    let localeSwitchCenterY;

    // create and add the SpeechSynthesisButton if the voiceManager is initialized
    if ( voicingManager.initialized ) {
      const speechSynthesisButton = new SpeechSynthesisButton( comparisonTextNode.comparisonStringProperty );
      speechSynthesisButton.centerX = resetAllButton.centerX;
      speechSynthesisButton.top = rightTotalAccordionBox.top;
      this.addChild( speechSynthesisButton );

      // position the localeSwitch relative to the speechSynthesisButton
      localeSwitchXRange = new Range( rightTotalAccordionBox.right, speechSynthesisButton.left );
      localeSwitchCenterY = speechSynthesisButton.centerY;
    }
    else {

      // position the localeSwitch relative to the rightTotalAccordionBox if the speechSynthesisButton doesn't exist
      localeSwitchXRange = new Range( rightTotalAccordionBox.right, this.layoutBounds.maxX );
      localeSwitchCenterY = rightTotalAccordionBox.top + 20; // empirically determined
    }

    // create and add the LocaleSwitch
    const localeSwitchXMargin = 10; // empirically determined
    const localeSwitch = new LocaleSwitch( localeSwitchXRange.getLength() - localeSwitchXMargin * 2 );
    localeSwitch.centerX = localeSwitchXRange.getCenter();
    localeSwitch.centerY = localeSwitchCenterY;
    this.addChild( localeSwitch );

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
    model.comparisonSignsAndTextVisibleProperty.link( visible => {
      comparisonSignsNode.visible = visible;
      comparisonTextNode.visible = visible;
    } );

    // update the visibility of the BlockValuesNode and NumberLineNode
    model.countingTypeProperty.link( countingType => {
      blockValuesNode.visible = countingType === CompareCountingType.BLOCKS;
      compareNumberLineNode.visible = countingType === CompareCountingType.NUMBER_LINE;
    } );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    this.leftTotalAccordionBoxExpandedProperty.reset();
    this.rightTotalAccordionBoxExpandedProperty.reset();
    this.leftCompareAccordionBoxExpandedProperty.reset();
    this.rightCompareAccordionBoxExpandedProperty.reset();
  }
}

numberPlay.register( 'CompareScreenView', CompareScreenView );
export default CompareScreenView;