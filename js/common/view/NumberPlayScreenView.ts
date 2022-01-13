// Copyright 2019-2022, University of Colorado Boulder

/**
 * ScreenView class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Image, voicingManager } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import groupingScene1_png from '../../../images/groupingScene1_png.js';
import groupingScene2_png from '../../../images/groupingScene2_png.js';
import groupingScene3_png from '../../../images/groupingScene3_png.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayColors from '../NumberPlayColors.js';
import NumberPlayConstants, { AccordionBoxOptions } from '../NumberPlayConstants.js';
import ObjectsAccordionBox from './ObjectsAccordionBox.js';
import OnesAccordionBox from './OnesAccordionBox.js';
import SpeechSynthesisButton from './SpeechSynthesisButton.js';
import TenFrameAccordionBox from './TenFrameAccordionBox.js';
import TenFrameNode from './TenFrameNode.js';
import TotalAccordionBox, { TotalAccordionBoxOptions } from './TotalAccordionBox.js';
import WordAccordionBox, { WordAccordionBoxOptions } from './WordAccordionBox.js';
import NumberPlayModel from '../model/NumberPlayModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// types
type NumberPlayScreenViewOptions = {
  wordAccordionBoxOptions: WordAccordionBoxOptions,
  totalAccordionBoxOptions: TotalAccordionBoxOptions,
  tenFrameAccordionBoxOptions: Partial<AccordionBoxOptions>,
  upperAccordionBoxHeight: number,
  lowerAccordionBoxHeight: number,
  tandem: Tandem
};

// constants
const GROUPING_LINKING_TYPE_TO_IMAGE = new Map();
GROUPING_LINKING_TYPE_TO_IMAGE.set( GroupingLinkingType.UNGROUPED, groupingScene1_png );
GROUPING_LINKING_TYPE_TO_IMAGE.set( GroupingLinkingType.GROUPED, groupingScene2_png );
GROUPING_LINKING_TYPE_TO_IMAGE.set( GroupingLinkingType.GROUPED_AND_LINKED, groupingScene3_png );

class NumberPlayScreenView extends ScreenView {

  public readonly wordAccordionBoxExpandedProperty: BooleanProperty;
  public readonly totalAccordionBoxExpandedProperty: BooleanProperty;
  public readonly tenFrameAccordionBoxExpandedProperty: BooleanProperty;
  public readonly onesAccordionBoxExpandedProperty: BooleanProperty;
  public readonly objectsAccordionBoxExpandedProperty: BooleanProperty;
  private readonly objectsAccordionBox: ObjectsAccordionBox;

  constructor( model: NumberPlayModel, options: NumberPlayScreenViewOptions ) {

    super( options );

    // Properties used to control the expanded state of each accordion box
    this.wordAccordionBoxExpandedProperty = new BooleanProperty( false );
    this.totalAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.tenFrameAccordionBoxExpandedProperty = new BooleanProperty( false );
    this.onesAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.objectsAccordionBoxExpandedProperty = new BooleanProperty( true );

    // create and add the WordAccordionBox
    const wordAccordionBox = new WordAccordionBox(
      model.currentNumberProperty,
      options.upperAccordionBoxHeight, merge( {
        expandedProperty: this.wordAccordionBoxExpandedProperty
      }, options.wordAccordionBoxOptions ) as WordAccordionBoxOptions );
    wordAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    wordAccordionBox.top = this.layoutBounds.minY + NumberPlayConstants.ACCORDION_BOX_TOP_MARGIN;
    this.addChild( wordAccordionBox );

    // create and add the TotalAccordionBox
    const totalAccordionBox = new TotalAccordionBox(
      model.currentNumberProperty,
      options.upperAccordionBoxHeight, merge( {
        expandedProperty: this.totalAccordionBoxExpandedProperty
      }, options.totalAccordionBoxOptions ) as TotalAccordionBoxOptions );
    totalAccordionBox.centerX = this.layoutBounds.centerX;
    totalAccordionBox.top = wordAccordionBox.top;
    this.addChild( totalAccordionBox );

    // create and add the TenFrameAccordionBox
    const tenFrameAccordionBox = new TenFrameAccordionBox(
      model.currentNumberProperty,
      options.upperAccordionBoxHeight, merge( {
        expandedProperty: this.tenFrameAccordionBoxExpandedProperty
      }, options.tenFrameAccordionBoxOptions ) );
    tenFrameAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    tenFrameAccordionBox.top = wordAccordionBox.top;
    this.addChild( tenFrameAccordionBox );

    // create and add the OnesAccordionBox
    const onesAccordionBox = new OnesAccordionBox(
      model.onesPlayArea,
      options.lowerAccordionBoxHeight, {
        expandedProperty: this.onesAccordionBoxExpandedProperty
      } );
    onesAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    onesAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.ACCORDION_BOX_BOTTOM_MARGIN;
    this.addChild( onesAccordionBox );

    // create and add the ObjectsAccordionBox
    this.objectsAccordionBox = new ObjectsAccordionBox(
      model.objectsPlayArea,
      options.lowerAccordionBoxHeight, {
        linkedPlayArea: model.onesPlayArea,
        groupingLinkingTypeProperty: model.groupingLinkingTypeProperty,
        expandedProperty: this.objectsAccordionBoxExpandedProperty
      } );
    this.objectsAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    this.objectsAccordionBox.bottom = onesAccordionBox.bottom;
    this.addChild( this.objectsAccordionBox );

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

    // create and add the SpeechSynthesisButton if the voiceManager is initialized
    if ( voicingManager.initialized ) {
      const speechSynthesisButton = new SpeechSynthesisButton( model.currentNumberProperty, true );
      speechSynthesisButton.left = this.layoutBounds.minX + NumberPlayConstants.SCREEN_VIEW_X_PADDING;
      speechSynthesisButton.top = tenFrameAccordionBox.top;
      this.addChild( speechSynthesisButton );
    }

    // create the icons for the RectangularRadioButtonGroup
    // @ts-ignore TODO-TS: need type defined by RectangularRadioButtonGroup
    const groupingLinkingButtons = [];
    const margin = 3;
    GroupingLinkingType.enumeration.values.forEach( groupingLinkingType => {
      const iconNode = new Image( GROUPING_LINKING_TYPE_TO_IMAGE.get( groupingLinkingType ), {
        maxWidth: resetAllButton.width - 2 * margin
      } );

      groupingLinkingButtons.push( {
        value: groupingLinkingType,
        node: iconNode
      } );
    } );

    // create and add the RectangularRadioButtonGroup, which is a control for changing the PlayObjectType of the playObjects
    // @ts-ignore TODO-TS: need type defined by RectangularRadioButtonGroup for groupingLinkingButtons, see above TODO
    const groupingLinkingRadioButtonGroup = new RectangularRadioButtonGroup( model.groupingLinkingTypeProperty, groupingLinkingButtons, {
      baseColor: NumberPlayColors.blueBackgroundColorProperty,
      orientation: 'vertical',
      spacing: 10,
      buttonContentXMargin: margin,
      buttonContentYMargin: margin
    } );
    groupingLinkingRadioButtonGroup.centerX = resetAllButton.centerX;
    groupingLinkingRadioButtonGroup.centerY = this.objectsAccordionBox.centerY;
    this.addChild( groupingLinkingRadioButtonGroup );

    // content for organizePlayObjectsButton
    const xMargin = 4;
    const yMargin = 10;
    const tenFramePath = TenFrameNode.getTenFramePath( {
      fill: null,
      lineWidth: 3
    } );
    tenFramePath.setScaleMagnitude( ( resetAllButton.width - xMargin * 2 ) / tenFramePath.width );

    // create and add a button to organize the ObjectsAccordionBox playObjects in a grid
    const organizeOnesButton = new RectangularPushButton( {
      content: tenFramePath,
      listener: () => {
        model.onesPlayArea.organizeObjects();
      },
      baseColor: NumberPlayColors.purpleBackgroundColorProperty,
      xMargin: xMargin,
      yMargin: yMargin
    } );
    organizeOnesButton.left = this.layoutBounds.minX + NumberPlayConstants.SCREEN_VIEW_X_PADDING;
    organizeOnesButton.top = onesAccordionBox.top;
    this.addChild( organizeOnesButton );

    // create and add a button to organize the ObjectsAccordionBox playObjects in a grid
    const organizeObjectsButton = new RectangularPushButton( {
      content: tenFramePath,
      listener: () => {
        model.objectsPlayArea.organizeObjects();
      },
      baseColor: NumberPlayColors.blueBackgroundColorProperty,
      xMargin: xMargin,
      yMargin: yMargin
    } );
    organizeObjectsButton.centerX = resetAllButton.centerX;
    organizeObjectsButton.top = this.objectsAccordionBox.top;
    this.addChild( organizeObjectsButton );

    // set the visibility of the organize buttons based on the state of grouping/linking
    model.groupingLinkingTypeProperty.link( groupingLinkingType => {
      organizeOnesButton.visible = groupingLinkingType === GroupingLinkingType.UNGROUPED ||
                                   groupingLinkingType === GroupingLinkingType.GROUPED;
      organizeObjectsButton.visible = groupingLinkingType === GroupingLinkingType.UNGROUPED;
    } );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.wordAccordionBoxExpandedProperty.reset();
    this.totalAccordionBoxExpandedProperty.reset();
    this.tenFrameAccordionBoxExpandedProperty.reset();
    this.onesAccordionBoxExpandedProperty.reset();
    this.objectsAccordionBoxExpandedProperty.reset();
    this.objectsAccordionBox.reset();
  }
}

numberPlay.register( 'NumberPlayScreenView', NumberPlayScreenView );
export default NumberPlayScreenView;