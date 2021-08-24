// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for the 'Objects' accordion box, which is the panel in the lower right corner of the sim that displays an
 * environment for counting with various objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import OnesPlayAreaNode from './OnesPlayAreaNode.js';

const objectsString = numberPlayStrings.objects;

class ObjectsAccordionBox extends AccordionBox {

  /**
   * @param {NumberPlayPlayArea} objectsPlayArea
   * @param {number} height - the height of this accordion box
   * @param {Object} [options]
   */
  constructor( objectsPlayArea, height, config ) {

    config = merge( {
      minWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_WIDTH,
      titleNode: new Text( objectsString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
      fill: NumberPlayConstants.BLUE_BACKGROUND,
      linkedPlayArea: null, // {null|OnesPlayArea}
      groupingLinkingTypeProperty: null, // {EnumerationProperty.<GroupingLinkingType>|null}

      radioButtonSize: new Dimension2( 28, 28 ), // empirically determined
      radioButtonSpacing: 10 // empirically determined
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_CONTENT_WIDTH
    } );

    const playAreaMarginY = 15;
    const playAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top,
      contentNode.right,
      contentNode.bottom - playAreaMarginY
    );

    const translateMVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( playAreaViewBounds.left + NumberPlayConstants.BUCKET_SIZE.width / 2, playAreaViewBounds.bottom ),
      1
    );

    const playObjectTypeProperty = new EnumerationProperty( PlayObjectType, PlayObjectType.DOG );

    const objectsPlayAreaNode = new OnesPlayAreaNode(
      objectsPlayArea,
      playAreaViewBounds,
      translateMVT, {
        playObjectTypeProperty: playObjectTypeProperty,
        groupingLinkingTypeProperty: config.groupingLinkingTypeProperty
      }
    );
    contentNode.addChild( objectsPlayAreaNode );

    // create the icons for the RectangularRadioButtonGroup
    const buttons = [];
    PlayObjectType.VALUES.forEach( playObjectType => {
      const iconNode = new Image( CountingCommonConstants.PLAY_OBJECT_TYPE_TO_IMAGE[ playObjectType ], {
        maxWidth: config.radioButtonSize.width,
        maxHeight: config.radioButtonSize.height
      } );

      buttons.push( {
        value: playObjectType,
        node: iconNode
      } );
    } );

    // create and add the RectangularRadioButtonGroup, which is a control for changing the PlayObjectType of the playObjects
    const radioButtonGroup = new RectangularRadioButtonGroup( playObjectTypeProperty, buttons, {
      baseColor: Color.WHITE,
      orientation: 'horizontal',
      spacing: config.radioButtonSpacing
    } );
    radioButtonGroup.right = playAreaViewBounds.right - 2; // empirically determined tweak
    radioButtonGroup.bottom = playAreaViewBounds.bottom;
    contentNode.addChild( radioButtonGroup );

    // add the linked play area
    const objectPlayAreaBottomMargin = 29; // empirically determined to keep paper ones above the bottom when linked
    if ( config.linkedPlayArea && config.groupingLinkingTypeProperty ) {
      const linkedObjectsPlayAreaNode = new OnesPlayAreaNode(
        config.linkedPlayArea,
        playAreaViewBounds.withMaxY( playAreaViewBounds.bottom - objectPlayAreaBottomMargin ),
        translateMVT, {
          playObjectTypeProperty: playObjectTypeProperty,
          viewHasIndependentModel: false
        }
      );

      config.groupingLinkingTypeProperty.lazyLink( groupingLinkingType => {
        if ( groupingLinkingType === GroupingLinkingType.GROUPING_AND_LINKED ) {
          contentNode.removeChild( objectsPlayAreaNode );
          contentNode.addChild( linkedObjectsPlayAreaNode );
        }
        else if ( contentNode.hasChild( linkedObjectsPlayAreaNode ) ) {
          contentNode.removeChild( linkedObjectsPlayAreaNode );
          contentNode.addChild( objectsPlayAreaNode );
        }
        radioButtonGroup.moveToFront();
      } );
    }

    super( contentNode, config );

    // @public {EnumerationProperty.<PlayObjectType>}
    this.playObjectTypeProperty = playObjectTypeProperty;
  }

  /**
   * @public
   */
  reset() {
    this.playObjectTypeProperty.reset();
  }
}

numberPlay.register( 'ObjectsAccordionBox', ObjectsAccordionBox );
export default ObjectsAccordionBox;