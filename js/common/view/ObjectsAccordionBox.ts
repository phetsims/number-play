// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Objects' accordion box, which is the panel in the lower right corner of the sim that displays an
 * environment for counting with various objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import RichEnumerationProperty from '../../../../axon/js/RichEnumerationProperty.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, Image, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayColors from '../NumberPlayColors.js';
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
      titleNode: new Text( objectsString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_TITLE_MAX_WIDTH
      } ),
      minWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_WIDTH,
      fill: NumberPlayColors.blueBackgroundColorProperty,
      linkedPlayArea: null, // {null|OnesPlayArea}
      groupingLinkingTypeProperty: null, // {RichEnumerationProperty.<GroupingLinkingType>|null}

      radioButtonSize: new Dimension2( 28, 28 ), // empirically determined
      radioButtonSpacing: 10 // empirically determined
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_CONTENT_WIDTH
    } );

    const playAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top,
      contentNode.right,
      contentNode.bottom - NumberPlayConstants.PLAY_AREA_Y_MARGIN
    );

    const playObjectTypeProperty = new RichEnumerationProperty( PlayObjectType.DOG );

    const objectsPlayAreaNode = new OnesPlayAreaNode(
      objectsPlayArea,
      playAreaViewBounds, {
        playObjectTypeProperty: playObjectTypeProperty,
        groupingLinkingTypeProperty: config.groupingLinkingTypeProperty
      }
    );
    contentNode.addChild( objectsPlayAreaNode );

    // create the icons for the RectangularRadioButtonGroup
    const buttons = [];
    PlayObjectType.enumeration.values.forEach( playObjectType => {
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
    if ( config.linkedPlayArea && config.groupingLinkingTypeProperty ) {
      const linkedObjectsPlayAreaNode = new OnesPlayAreaNode(
        config.linkedPlayArea,
        playAreaViewBounds, {
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

    // @public {RichEnumerationProperty.<PlayObjectType>}
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