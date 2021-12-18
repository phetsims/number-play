// Copyright 2019-2021, University of Colorado Boulder

/**
 * ScreenView class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Image, voicingManager } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import groupingScene1_png from '../../../images/groupingScene1_png.js';
import groupingScene2_png from '../../../images/groupingScene2_png.js';
import groupingScene3_png from '../../../images/groupingScene3_png.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayColors from '../NumberPlayColors.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import ObjectsAccordionBox from './ObjectsAccordionBox.js';
import OnesAccordionBox from './OnesAccordionBox.js';
import SpeechSynthesisButton from './SpeechSynthesisButton.js';
import TenFrameAccordionBox from './TenFrameAccordionBox.js';
import TenFrameNode from './TenFrameNode.js';
import TotalAccordionBox from './TotalAccordionBox.js';
import WordAccordionBox from './WordAccordionBox.js';

// constants
const groupingLinkingTypeToImage = {};
groupingLinkingTypeToImage[ GroupingLinkingType.NO_GROUPING ] = groupingScene1_png;
groupingLinkingTypeToImage[ GroupingLinkingType.GROUPING ] = groupingScene2_png;
groupingLinkingTypeToImage[ GroupingLinkingType.GROUPING_AND_LINKED ] = groupingScene3_png;

class NumberPlayScreenView extends ScreenView {

  /**
   * @param {NumberPlayModel} model
   * @param {Object} config
   */
  constructor( model, config ) {

    config = merge( {

      // config for WordAccordionBox. see WordAccordionBox for additional fields. the keys defined here are optional,
      // but config is used because the additional keys are required.
      wordAccordionBoxConfig: {
        fill: null // {ColorDef} - accordion box background fill
      },

      // config for TotalAccordionBox. see TotalAccordionBox for additional fields. the keys defined here are
      // optional, but config is used because the additional keys are required.
      totalAccordionBoxConfig: {
        fill: null // {ColorDef} - accordion box background fill
      },

      // options for TenFrameAccordionBox.
      tenFrameAccordionBoxOptions: {
        fill: null // {ColorDef} - accordion box background fill
      },

      // accordion box heights. these are not part of specific accordion box configs because they apply to
      // multiple accordion boxes.
      upperAccordionBoxHeight: required( config.upperAccordionBoxHeight ), // {number}
      lowerAccordionBoxHeight: required( config.lowerAccordionBoxHeight ), // {number}

      // phet-io
      tandem: config.tandem
    }, config );

    super( config );

    // @public {BooleanProperty} - Properties used to control the expanded state of each accordion box
    this.wordAccordionBoxExpandedProperty = new BooleanProperty( false );
    this.totalAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.tenFrameAccordionBoxExpandedProperty = new BooleanProperty( false );
    this.onesAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.objectsAccordionBoxExpandedProperty = new BooleanProperty( true );

    // create and add the WordAccordionBox
    const wordAccordionBox = new WordAccordionBox(
      model.currentNumberProperty,
      config.upperAccordionBoxHeight, merge( {
        expandedProperty: this.wordAccordionBoxExpandedProperty
      }, config.wordAccordionBoxConfig ) );
    wordAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    wordAccordionBox.top = this.layoutBounds.minY + NumberPlayConstants.ACCORDION_BOX_TOP_MARGIN;
    this.addChild( wordAccordionBox );

    // create and add the TotalAccordionBox
    const totalAccordionBox = new TotalAccordionBox(
      model.currentNumberProperty,
      config.upperAccordionBoxHeight, merge( {
        expandedProperty: this.totalAccordionBoxExpandedProperty
      }, config.totalAccordionBoxConfig ) );
    totalAccordionBox.centerX = this.layoutBounds.centerX;
    totalAccordionBox.top = wordAccordionBox.top;
    this.addChild( totalAccordionBox );

    // create and add the TenFrameAccordionBox
    const tenFrameAccordionBox = new TenFrameAccordionBox(
      model.currentNumberProperty,
      config.upperAccordionBoxHeight, merge( {
        expandedProperty: this.tenFrameAccordionBoxExpandedProperty
      }, config.tenFrameAccordionBoxOptions ) );
    tenFrameAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    tenFrameAccordionBox.top = wordAccordionBox.top;
    this.addChild( tenFrameAccordionBox );

    // create and add the OnesAccordionBox
    const onesAccordionBox = new OnesAccordionBox(
      model.onesPlayArea,
      config.lowerAccordionBoxHeight, {
        expandedProperty: this.onesAccordionBoxExpandedProperty
      } );
    onesAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    onesAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.ACCORDION_BOX_BOTTOM_MARGIN;
    this.addChild( onesAccordionBox );

    // @public {ObjectsAccordionBox} - create and add the ObjectsAccordionBox
    this.objectsAccordionBox = new ObjectsAccordionBox(
      model.objectsPlayArea,
      config.lowerAccordionBoxHeight, {
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
      tandem: config.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // create and add the SpeechSynthesisButton if the voiceManager is initialized
    if ( voicingManager.initialized ) {
      const speechSynthesisButton = new SpeechSynthesisButton( model.currentNumberProperty, {
        readNumber: true
      } );
      speechSynthesisButton.left = this.layoutBounds.minX + NumberPlayConstants.SCREEN_VIEW_X_PADDING;
      speechSynthesisButton.top = tenFrameAccordionBox.top;
      this.addChild( speechSynthesisButton );
    }

    // create the icons for the RectangularRadioButtonGroup
    const groupingLinkingButtons = [];
    const margin = 3;
    GroupingLinkingType.VALUES.forEach( groupingLinkingType => {
      const iconNode = new Image( groupingLinkingTypeToImage[ groupingLinkingType ], {
        maxWidth: resetAllButton.width - 2 * margin
      } );

      groupingLinkingButtons.push( {
        value: groupingLinkingType,
        node: iconNode
      } );
    } );

    // create and add the RectangularRadioButtonGroup, which is a control for changing the PlayObjectType of the playObjects
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
      organizeOnesButton.visible = groupingLinkingType === GroupingLinkingType.NO_GROUPING ||
                                   groupingLinkingType === GroupingLinkingType.GROUPING;
      organizeObjectsButton.visible = groupingLinkingType === GroupingLinkingType.NO_GROUPING;
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