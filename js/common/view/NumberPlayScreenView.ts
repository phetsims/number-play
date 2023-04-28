// Copyright 2019-2023, University of Colorado Boulder

/**
 * ScreenView base class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Image } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import groupingScene1_png from '../../../images/groupingScene1_png.js';
import groupingScene2_png from '../../../images/groupingScene2_png.js';
import groupingScene3_png from '../../../images/groupingScene3_png.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayColors from '../NumberPlayColors.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import CountingAccordionBox from '../../../../number-suite-common/js/common/view/CountingAccordionBox.js';
import SpeechSynthesisControl from '../../../../number-suite-common/js/common/view/SpeechSynthesisControl.js';
import TenFrameAccordionBox, { TenFrameAccordionBoxOptions } from './TenFrameAccordionBox.js';
import TotalAccordionBox, { TotalAccordionBoxOptions } from '../../../../number-suite-common/js/common/view/TotalAccordionBox.js';
import WordAccordionBox, { WordAccordionBoxOptions } from './WordAccordionBox.js';
import NumberPlayModel from '../model/NumberPlayModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import OrganizeButton from '../../../../number-suite-common/js/common/view/OrganizeButton.js';
import GroupAndLinkType from '../../../../number-suite-common/js/common/model/GroupAndLinkType.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import numberPlaySpeechSynthesisAnnouncer from './numberPlaySpeechSynthesisAnnouncer.js';
import numberPlayPreferences from '../model/numberPlayPreferences.js';
import Multilink from '../../../../axon/js/Multilink.js';
import numberPlayUtteranceQueue from './numberPlayUtteranceQueue.js';
import NumberSuiteCommonConstants from '../../../../number-suite-common/js/common/NumberSuiteCommonConstants.js';
import Property from '../../../../axon/js/Property.js';
import LocaleSwitch from './LocaleSwitch.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

// types
type SelfOptions = {
  wordAccordionBoxOptions: WordAccordionBoxOptions;
  totalAccordionBoxOptions: TotalAccordionBoxOptions;
  tenFrameAccordionBoxOptions: TenFrameAccordionBoxOptions;
  upperAccordionBoxHeight: number;
  lowerAccordionBoxHeight: number;
  tandem: Tandem;
};
export type NumberPlayScreenViewOptions = SelfOptions;

// constants
const GROUPING_LINKING_TYPE_TO_IMAGE = new Map();
GROUPING_LINKING_TYPE_TO_IMAGE.set( GroupAndLinkType.UNGROUPED, groupingScene1_png );
GROUPING_LINKING_TYPE_TO_IMAGE.set( GroupAndLinkType.GROUPED, groupingScene2_png );
GROUPING_LINKING_TYPE_TO_IMAGE.set( GroupAndLinkType.GROUPED_AND_LINKED, groupingScene3_png );

class NumberPlayScreenView extends ScreenView {

  private readonly wordAccordionBoxExpandedProperty: Property<boolean>;
  private readonly totalAccordionBoxExpandedProperty: Property<boolean>;
  private readonly tenFrameAccordionBoxExpandedProperty: Property<boolean>;
  private readonly onesAccordionBoxExpandedProperty: Property<boolean>;
  private readonly objectsAccordionBoxExpandedProperty: Property<boolean>;
  private readonly objectsAccordionBox: CountingAccordionBox;

  protected constructor( model: NumberPlayModel, options: NumberPlayScreenViewOptions ) {

    super( options );

    // Properties used to control the expanded state of each accordion box
    this.wordAccordionBoxExpandedProperty = new BooleanProperty( false );
    this.totalAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.tenFrameAccordionBoxExpandedProperty = new BooleanProperty( false );
    this.onesAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.objectsAccordionBoxExpandedProperty = new BooleanProperty( true );

    const wordAccordionBoxHeightProperty = new NumberProperty( options.upperAccordionBoxHeight );

    // create and add the WordAccordionBox
    const wordAccordionBox = new WordAccordionBox(
      model.currentNumberProperty,
      wordAccordionBoxHeightProperty, {
        expandedProperty: this.wordAccordionBoxExpandedProperty,
        ...options.wordAccordionBoxOptions
      } );
    wordAccordionBox.left = this.layoutBounds.minX + NumberSuiteCommonConstants.ACCORDION_BOX_MARGIN_X;
    wordAccordionBox.top = this.layoutBounds.minY + NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_Y;
    this.addChild( wordAccordionBox );

    // create and add the TotalAccordionBox
    const totalAccordionBox = new TotalAccordionBox(
      model.onesCountingArea,
      options.upperAccordionBoxHeight, {
        expandedProperty: this.totalAccordionBoxExpandedProperty,
        ...options.totalAccordionBoxOptions
      } );
    totalAccordionBox.centerX = this.layoutBounds.centerX;
    totalAccordionBox.top = wordAccordionBox.top;
    this.addChild( totalAccordionBox );

    // create and add the TenFrameAccordionBox
    const tenFrameAccordionBox = new TenFrameAccordionBox(
      model.currentNumberProperty,
      model.sumRange,
      options.upperAccordionBoxHeight, {
        expandedProperty: this.tenFrameAccordionBoxExpandedProperty,
        ...options.tenFrameAccordionBoxOptions
      } );
    tenFrameAccordionBox.right = this.layoutBounds.maxX - NumberSuiteCommonConstants.ACCORDION_BOX_MARGIN_X;
    tenFrameAccordionBox.top = wordAccordionBox.top;
    this.addChild( tenFrameAccordionBox );

    // create and add the CountingAccordionBox for paper ones
    const onesAccordionBox = new CountingAccordionBox(
      model.onesCountingArea,
      new EnumerationProperty( CountingObjectType.PAPER_NUMBER ),
      NumberPlayConstants.LOWER_ACCORDION_BOX_CONTENT_WIDTH,
      options.lowerAccordionBoxHeight, {
        titleStringProperty: NumberPlayStrings.onesStringProperty,
        expandedProperty: this.onesAccordionBoxExpandedProperty,
        fill: NumberPlayColors.pinkBackgroundColorProperty
      } );
    onesAccordionBox.left = this.layoutBounds.minX + NumberSuiteCommonConstants.ACCORDION_BOX_MARGIN_X;
    onesAccordionBox.bottom = this.layoutBounds.maxY - NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_Y;
    this.addChild( onesAccordionBox );

    // create and add the LocaleSwitch
    const localeSwitch = new LocaleSwitch( numberPlayPreferences, numberPlayUtteranceQueue, wordAccordionBox.width );
    this.addChild( localeSwitch );

    // Changes in locale will change the text in this control, so realign it
    localeSwitch.boundsProperty.link( () => {
      localeSwitch.left = wordAccordionBox.left + 10;
    } );

    // update the position of the localeSwitch
    Multilink.multilink( [ wordAccordionBox.expandedProperty, numberPlayPreferences.showSecondLocaleProperty ],
      ( isExpanded, showSecondLocale ) => {

        wordAccordionBoxHeightProperty.value = showSecondLocale ? options.upperAccordionBoxHeight - localeSwitch.height - 3 :
                                               options.upperAccordionBoxHeight;

        const currentWordAccordionBoxHeight = isExpanded ? wordAccordionBox.getExpandedBoxHeight() :
                                              wordAccordionBox.getCollapsedBoxHeight();

        // Use .bottom so the margin is identical to what would center the localeSwitch when the wordAccordionBox is expanded.
        const margin = ( onesAccordionBox.top - wordAccordionBox.bottom ) / 2;

        localeSwitch.centerY = wordAccordionBox.top + currentWordAccordionBoxHeight + margin;
      } );

    // create and add the CountingAccordionBox for countingObjects
    this.objectsAccordionBox = new CountingAccordionBox(
      model.objectsCountingArea,
      model.countingObjectTypeProperty,
      NumberPlayConstants.LOWER_ACCORDION_BOX_CONTENT_WIDTH,
      options.lowerAccordionBoxHeight, {
        countingObjectTypes: [ CountingObjectType.DOG, CountingObjectType.APPLE, CountingObjectType.BUTTERFLY,
          CountingObjectType.BALL ],
        linkStatusChangedEmitter: model.linkStatusChangedEmitter,
        linkedCountingArea: model.onesCountingArea,
        expandedProperty: this.objectsAccordionBoxExpandedProperty,
        fill: NumberPlayColors.blueBackgroundColorProperty
      } );
    this.objectsAccordionBox.right = this.layoutBounds.maxX - NumberSuiteCommonConstants.ACCORDION_BOX_MARGIN_X;
    this.objectsAccordionBox.bottom = onesAccordionBox.bottom;
    this.addChild( this.objectsAccordionBox );

    // create and add the ResetAllButton
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_X,
      bottom: this.layoutBounds.maxY - NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_Y,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // Add the SpeechSynthesisControl, if the announcer is initialized.
    if ( numberPlaySpeechSynthesisAnnouncer.initialized ) {
      const speechSynthesisControl = new SpeechSynthesisControl(
        numberPlaySpeechSynthesisAnnouncer,
        numberPlayUtteranceQueue, {
          left: this.layoutBounds.minX + NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_X,
          top: tenFrameAccordionBox.top
        } );
      this.addChild( speechSynthesisControl );
    }

    // create the icons for the RectangularRadioButtonGroup
    const groupingLinkingButtons: RectangularRadioButtonGroupItem<GroupAndLinkType>[] = [];
    const margin = 4.5;
    GroupAndLinkType.enumeration.values.forEach( groupAndLinkType => {

      groupingLinkingButtons.push( {
        value: groupAndLinkType,
        createNode: () => new Image( GROUPING_LINKING_TYPE_TO_IMAGE.get( groupAndLinkType ), {
          maxWidth: resetAllButton.width - 2 * margin
        } )
      } );
    } );

    // Create and add the RectangularRadioButtonGroup, which is a control for changing the CountingObjectType of the countingObjects
    const groupingLinkingRadioButtonGroup = new RectangularRadioButtonGroup( model.objectsGroupAndLinkTypeProperty, groupingLinkingButtons, {
      orientation: 'vertical',
      spacing: 10,
      radioButtonOptions: {
        baseColor: NumberPlayColors.blueBackgroundColorProperty,
        xMargin: margin,
        yMargin: margin
      }
    } );
    groupingLinkingRadioButtonGroup.centerX = resetAllButton.centerX;
    groupingLinkingRadioButtonGroup.centerY = this.objectsAccordionBox.centerY;
    this.addChild( groupingLinkingRadioButtonGroup );

    // create and add a button to organize the onesAccordionBox paper ones in a grid
    const organizeOnesButton = new OrganizeButton( NumberPlayColors.pinkBackgroundColorProperty, () => {
      model.onesCountingArea.organizeObjects();
    } );
    organizeOnesButton.left = NumberSuiteCommonConstants.SCREEN_VIEW_PADDING_X;
    organizeOnesButton.top = onesAccordionBox.top;
    this.addChild( organizeOnesButton );

    // create and add a button to organize the objectsAccordionBox countingObjects in a grid
    const organizeObjectsButton = new OrganizeButton( NumberPlayColors.blueBackgroundColorProperty, () => {
      if ( model.objectsGroupAndLinkTypeProperty.value === GroupAndLinkType.GROUPED_AND_LINKED ) {
        model.onesCountingArea.organizeObjects();
      }
      else {
        model.objectsCountingArea.organizeObjects();
      }
    } );
    organizeObjectsButton.centerX = resetAllButton.centerX;
    organizeObjectsButton.top = this.objectsAccordionBox.top;
    this.addChild( organizeObjectsButton );

    model.objectsGroupAndLinkTypeProperty.lazyLink( ( groupAndLinkType, previousGroupAndLinkType ) => {

      // If the GroupAndLinkType changes, interrupt interaction with objects in these accordion boxes.
      // See https://github.com/phetsims/number-play/issues/173
      onesAccordionBox.interruptSubtreeInput();
      this.objectsAccordionBox.interruptSubtreeInput();

      const objectsLinkedToOnes = groupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED;
      const objectsLinkedToOnesPreviously = previousGroupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED;

      // If switching between linked and unlinked, set the objectsCountingArea to the appropriate state.
      if ( objectsLinkedToOnes !== objectsLinkedToOnesPreviously ) {
        model.objectsCountingArea.matchCountingObjectsToLinkedCountingArea(
          onesAccordionBox.countingAreaNode.getSerializedCountingObjectsIncludedInSum(),
          model.linkStatusChangedEmitter,
          objectsLinkedToOnes,
          groupAndLinkType
        );
      }
    } );
  }

  /**
   * Resets the view.
   */
  private reset(): void {
    this.wordAccordionBoxExpandedProperty.reset();
    this.totalAccordionBoxExpandedProperty.reset();
    this.tenFrameAccordionBoxExpandedProperty.reset();
    this.onesAccordionBoxExpandedProperty.reset();
    this.objectsAccordionBoxExpandedProperty.reset();
    numberPlayPreferences.autoHearEnabledProperty.value && numberPlayUtteranceQueue.speakSpeechData();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'NumberPlayScreenView', NumberPlayScreenView );
export default NumberPlayScreenView;