// Copyright 2019-2021, University of Colorado Boulder

/**
 * ScreenView class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import groupingSceneOne from '../../../images/grouping_scene_1_png.js';
import groupingSceneTwo from '../../../images/grouping_scene_2_png.js';
import groupingSceneThree from '../../../images/grouping_scene_3_png.js';
import numberPlay from '../../numberPlay.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import NumeralAccordionBox from './NumeralAccordionBox.js';
import ObjectsAccordionBox from './ObjectsAccordionBox.js';
import OnesAccordionBox from './OnesAccordionBox.js';
import TenFrameAccordionBox from './TenFrameAccordionBox.js';
import TenFrameNode from './TenFrameNode.js';
import WordAccordionBox from './WordAccordionBox.js';

// constants
const groupingLinkingTypeToImage = {};
groupingLinkingTypeToImage[ GroupingLinkingType.NO_GROUPING ] = groupingSceneOne;
groupingLinkingTypeToImage[ GroupingLinkingType.GROUPING ] = groupingSceneTwo;
groupingLinkingTypeToImage[ GroupingLinkingType.GROUPING_AND_LINKED ] = groupingSceneThree;

class NumberPlayScreenView extends ScreenView {

  /**
   * @param {NumberPlayModel} model
   * @param {Object} config
   */
  constructor( model, config ) {

    // TODO: convert to required() where appropriate, revert back to an option where appropriate (e.g. fill)
    config = merge( {

      // config for WordAccordionBox. see WordAccordionBox for additional fields
      wordAccordionBoxConfig: {
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

      // accordion box heights. these are not part of specific accordion box configs because they apply to
      // multiple accordion boxes.
      upperAccordionBoxHeight: null, // {number} @required
      lowerAccordionBoxHeight: null, // {number} @required

      // phet-io
      tandem: config.tandem
    }, config );

    super( config );

    // check for required config
    assert && assert( config.wordAccordionBoxConfig.fill, 'fill is required' );
    assert && assert( config.numeralAccordionBoxConfig.fill, 'fill is required' );
    assert && assert( config.tenFrameAccordionBoxConfig.fill, 'fill is required' );
    assert && assert( config.upperAccordionBoxHeight, 'upperAccordionBoxHeight is required' );
    assert && assert( config.lowerAccordionBoxHeight, 'lowerAccordionBoxHeight is required' );

    // @public {BooleanProperty} - Properties used to control the expanded state of each accordion box
    this.wordAccordionBoxExpandedProperty = new BooleanProperty( false );
    this.numeralAccordionBoxExpandedProperty = new BooleanProperty( true );
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

    // create and add the NumeralAccordionBox
    const numeralAccordionBox = new NumeralAccordionBox(
      model.currentNumberProperty,
      config.upperAccordionBoxHeight, merge( {
        expandedProperty: this.numeralAccordionBoxExpandedProperty
      }, config.numeralAccordionBoxConfig ) );
    numeralAccordionBox.centerX = this.layoutBounds.centerX;
    numeralAccordionBox.top = wordAccordionBox.top;
    this.addChild( numeralAccordionBox );

    // create and add the TenFrameAccordionBox
    const tenFrameAccordionBox = new TenFrameAccordionBox(
      model.currentNumberProperty,
      config.upperAccordionBoxHeight, merge( {
        expandedProperty: this.tenFrameAccordionBoxExpandedProperty
      }, config.tenFrameAccordionBoxConfig ) );
    tenFrameAccordionBox.right = this.layoutBounds.maxX - NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    tenFrameAccordionBox.top = wordAccordionBox.top;
    this.addChild( tenFrameAccordionBox );

    // create and add the OnesAccordionBox
    const onesAccordionBox = new OnesAccordionBox(
      model.onesPlayArea,
      config.lowerAccordionBoxHeight, merge( {
        expandedProperty: this.onesAccordionBoxExpandedProperty
      }, config.onesAccordionBoxConfig ) );
    onesAccordionBox.left = this.layoutBounds.minX + NumberPlayConstants.ACCORDION_BOX_X_MARGIN;
    onesAccordionBox.bottom = this.layoutBounds.maxY - NumberPlayConstants.ACCORDION_BOX_BOTTOM_MARGIN;
    this.addChild( onesAccordionBox );

    // create and add the ObjectsAccordionBox
    const objectsAccordionBox = new ObjectsAccordionBox(
      model.objectsPlayArea,
      config.lowerAccordionBoxHeight, merge( {
        linkedPlayArea: model.onesPlayArea,
        groupingLinkingTypeProperty: model.groupingLinkingTypeProperty,
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
      baseColor: NumberPlayConstants.BLUE_BACKGROUND,
      orientation: 'vertical',
      spacing: 10,
      buttonContentXMargin: margin,
      buttonContentYMargin: margin
    } );
    groupingLinkingRadioButtonGroup.centerX = resetAllButton.centerX;
    groupingLinkingRadioButtonGroup.top = objectsAccordionBox.top;
    this.addChild( groupingLinkingRadioButtonGroup );

    // content for organizePlayObjectsButton
    const xMargin = 4;
    const tenFramePath = TenFrameNode.getTenFramePath( {
      fill: null,
      lineWidth: 2.5
    } );
    tenFramePath.setScaleMagnitude( ( resetAllButton.width - xMargin * 2 ) / tenFramePath.width );

    // create and add a button to organize the ObjectsAccordionBox playObjects in a grid
    const organizePlayObjectsButton = new RectangularPushButton( {
      content: tenFramePath,
      listener: () => {
        // model.objectsPlayArea.organizePlayObjects(); TODO: make this work with the paper ones model, then bring it back
      },
      baseColor: NumberPlayConstants.BLUE_BACKGROUND,
      xMargin: xMargin,
      yMargin: 7
    } );
    organizePlayObjectsButton.centerX = resetAllButton.centerX;
    organizePlayObjectsButton.bottom = resetAllButton.top - 12; // empirically determined
    // this.addChild( organizePlayObjectsButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.wordAccordionBoxExpandedProperty.reset();
    this.numeralAccordionBoxExpandedProperty.reset();
    this.tenFrameAccordionBoxExpandedProperty.reset();
    this.onesAccordionBoxExpandedProperty.reset();
    this.objectsAccordionBoxExpandedProperty.reset();
  }
}

numberPlay.register( 'NumberPlayScreenView', NumberPlayScreenView );
export default NumberPlayScreenView;