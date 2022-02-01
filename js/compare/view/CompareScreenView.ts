// Copyright 2019-2022, University of Colorado Boulder

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
import CompareCountingTypeRadioButtonGroup from './CompareCountingTypeRadioButtonGroup.js';
import CompareNumberLineNode from './CompareNumberLineNode.js';
import ComparisonTextNode from './ComparisonTextNode.js';
import CountingAccordionBox from '../../common/view/CountingAccordionBox.js';
import ComparePlayObjectType from '../model/ComparePlayObjectType.js';
import OrganizeButton from '../../common/view/OrganizeButton.js';

// constants
const UPPER_ACCORDION_BOX_HEIGHT = 90; // empirically determined, in screen coordinates
const LOWER_ACCORDION_BOX_HEIGHT = 437; // empirically determined, in screen coordinates
const LOWER_ACCORDION_BOX_CONTENT_WIDTH = 350; // in screen coordinates

// strings
const lessThanString = '<';
const equalString = '=';
const greaterThanString = '>';

class CompareScreenView extends ScreenView {
  private readonly leftTotalAccordionBoxExpandedProperty: BooleanProperty;
  private readonly rightTotalAccordionBoxExpandedProperty: BooleanProperty;
  private readonly rightCountingAccordionBoxExpandedProperty: BooleanProperty;
  private readonly leftCountingAccordionBoxExpandedProperty: BooleanProperty;

  constructor( model: CompareModel, tandem: Tandem ) {

    super( { tandem: tandem } );

    this.leftTotalAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.rightTotalAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.leftCountingAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.rightCountingAccordionBoxExpandedProperty = new BooleanProperty( true );

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
    leftTotalAccordionBox.top = this.layoutBounds.minY + NumberPlayConstants.SCREEN_VIEW_PADDING_Y;
    this.addChild( leftTotalAccordionBox );

    // create and add the right TotalAccordionBox
    const rightTotalAccordionBox = new TotalAccordionBox(
      model.rightCurrentNumberProperty,
      UPPER_ACCORDION_BOX_HEIGHT, merge( {
        expandedProperty: this.rightTotalAccordionBoxExpandedProperty
      }, totalAccordionBoxOptions ) as TotalAccordionBoxOptions );
    rightTotalAccordionBox.top = leftTotalAccordionBox.top;
    this.addChild( rightTotalAccordionBox );

    // create and add the left CountingAccordionBox
    const leftCountingAccordionBox = new CountingAccordionBox(
      model.leftPlayArea,
      model.leftCountingObjectTypeProperty,
      LOWER_ACCORDION_BOX_HEIGHT, {
        playObjectTypes: ComparePlayObjectType,
        expandedProperty: this.leftCountingAccordionBoxExpandedProperty,
        contentWidth: LOWER_ACCORDION_BOX_CONTENT_WIDTH,
        fill: NumberPlayColors.lighterGreenBackgroundColorProperty
      } );
    leftCountingAccordionBox.left = NumberPlayConstants.ACCORDION_BOX_MARGIN_X;
    leftCountingAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y;
    this.addChild( leftCountingAccordionBox );

    // create and add the right CountingAccordionBox
    const rightCountingAccordionBox = new CountingAccordionBox(
      model.rightPlayArea,
      model.rightCountingObjectTypeProperty,
      LOWER_ACCORDION_BOX_HEIGHT, {
        playObjectTypes: ComparePlayObjectType,
        expandedProperty: this.rightCountingAccordionBoxExpandedProperty,
        contentWidth: LOWER_ACCORDION_BOX_CONTENT_WIDTH,
        fill: NumberPlayColors.lightOrangeBackgroundColorProperty
      } );
    rightCountingAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_MARGIN_X;
    rightCountingAccordionBox.bottom = leftCountingAccordionBox.bottom;
    this.addChild( rightCountingAccordionBox );

    // set the x-position of the TotalAccordionBox's after the CompareObjectAccordionBoxes have been added
    leftTotalAccordionBox.right = leftCountingAccordionBox.right;
    rightTotalAccordionBox.left = rightCountingAccordionBox.left;

    // create and add the CompareCountingTypeRadioButtonGroup
    const countingTypeRadioButtonGroup = new CompareCountingTypeRadioButtonGroup( model.countingTypeProperty );
    countingTypeRadioButtonGroup.left = NumberPlayConstants.SCREEN_VIEW_PADDING_X;
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
      model.isPrimaryLocaleProperty,
      this.layoutBounds
    );
    comparisonTextNode.centerY = new Range( leftTotalAccordionBox.bottom, leftCountingAccordionBox.top ).getCenter();
    this.addChild( comparisonTextNode );

    // create and add the BlockValuesNode
    const blockValuesNode = new BlockValuesNode( model.leftCurrentNumberProperty, model.rightCurrentNumberProperty );
    this.addChild( blockValuesNode );

    // create and add the CompareNumberLineNode
    const compareNumberLineNode = new CompareNumberLineNode( model.leftCurrentNumberProperty, model.rightCurrentNumberProperty );
    compareNumberLineNode.x = comparisonSignsNode.centerX;
    compareNumberLineNode.bottom = leftCountingAccordionBox.bottom - 4; // empirically determined adjustment
    this.addChild( compareNumberLineNode );

    // create and add the ResetAllButton
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - NumberPlayConstants.SCREEN_VIEW_PADDING_X,
      bottom: this.layoutBounds.maxY - NumberPlayConstants.SCREEN_VIEW_PADDING_Y,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // positioning variables for the LocaleSwitch that depend on whether the SpeechSynthesisButton is created below
    let localeSwitchXRange;
    let localeSwitchCenterY;

    // create and add the SpeechSynthesisButton if the voiceManager is initialized
    if ( voicingManager.initialized ) {
      const speechSynthesisButton = new SpeechSynthesisButton(
        comparisonTextNode.comparisonStringProperty,
        model.isPrimaryLocaleProperty
      );
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
    const localeSwitchMaxWidth = localeSwitchXRange.getLength() - localeSwitchXMargin * 2;
    const localeSwitch = new LocaleSwitch( model.isPrimaryLocaleProperty, localeSwitchMaxWidth );
    localeSwitch.centerX = localeSwitchXRange.getCenter();
    localeSwitch.centerY = localeSwitchCenterY;
    localeSwitch.visible = !!phet.numberPlay.secondLocaleStrings;
    this.addChild( localeSwitch );

    // create and add a button to organize the onesAccordionBox paper ones in a grid
    const leftOrganizeButton = new OrganizeButton( NumberPlayColors.lightGreenBackgroundColorProperty, () => {
      model.leftPlayArea.organizeObjects();
    } );
    leftOrganizeButton.left = NumberPlayConstants.SCREEN_VIEW_PADDING_X;
    leftOrganizeButton.top = leftCountingAccordionBox.top;
    this.addChild( leftOrganizeButton );

    // create and add a button to organize the objectsAccordionBox play objects in a grid
    const rightOrganizeButton = new OrganizeButton( NumberPlayColors.lightOrangeBackgroundColorProperty, () => {
      model.rightPlayArea.organizeObjects();
    } );
    rightOrganizeButton.centerX = resetAllButton.centerX;
    rightOrganizeButton.top = rightCountingAccordionBox.top;
    this.addChild( rightOrganizeButton );

    // update the comparison signs node's text and the BlockValuesNode when either current number changes
    Property.multilink( [ model.leftCurrentNumberProperty, model.rightCurrentNumberProperty ],
      ( leftCurrentNumber, rightCurrentNumber ) => {
        comparisonSignsNode.text = leftCurrentNumber < rightCurrentNumber ? lessThanString :
                                   leftCurrentNumber > rightCurrentNumber ? greaterThanString : equalString;

        blockValuesNode.removeAllChildren();
        blockValuesNode.addChild( BlockValuesNode.getBlockValuesNode( leftCurrentNumber, rightCurrentNumber, true ) );
        blockValuesNode.centerX = comparisonSignsNode.centerX;
        blockValuesNode.bottom = leftCountingAccordionBox.bottom - 2; // empirically determined tweak
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
    this.leftCountingAccordionBoxExpandedProperty.reset();
    this.rightCountingAccordionBoxExpandedProperty.reset();
  }
}

numberPlay.register( 'CompareScreenView', CompareScreenView );
export default CompareScreenView;