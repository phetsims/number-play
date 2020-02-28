// Copyright 2019-2020, University of Colorado Boulder

/**
 * Class for the 'Objects' accordion box, which is the panel in the lower right corner of the sim that displays an
 * environment for counting with various objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import numberPlayStrings from '../../number-play-strings.js';
import numberPlay from '../../numberPlay.js';
import PlayObject from '../model/PlayObject.js';
import PlayObjectType from '../model/PlayObjectType.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import ObjectsPlayAreaNode from './ObjectsPlayAreaNode.js';
import PlayObjectNode from './PlayObjectNode.js';

const objectsString = numberPlayStrings.objects;

class ObjectsAccordionBox extends AccordionBox {

  /**
   * @param {number} height - the height of this accordion box
   * @param {NumberPlayPlayArea} objectsPlayArea
   * @param {Object} [options]
   */
  constructor( height, objectsPlayArea, config ) {

    config = merge( {
      titleNode: new Text( objectsString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
      fill: NumberPlayConstants.BLUE_BACKGROUND,

      contentWidth: null,      // {number} @required
      radioButtonSize: null,   // {Dimension2} @required
      radioButtonSpacing: null // {number} @required
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

    assert && assert( config.contentWidth, `contentWidth is required: ${config.contentWidth}` );
    assert && assert( config.radioButtonSize, `radioButtonSize is required: ${config.radioButtonSize}` );
    assert && assert( config.radioButtonSpacing, `radioButtonSize is required: ${config.radioButtonSpacing}` );

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: config.contentWidth
    } );

    const playAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top + NumberPlayConstants.SCREEN_VIEW_Y_PADDING,
      contentNode.right,
      contentNode.bottom - NumberPlayConstants.SCREEN_VIEW_Y_PADDING
    );

    const translateMVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( playAreaViewBounds.left + NumberPlayConstants.BUCKET_SIZE.width / 2, playAreaViewBounds.bottom ),
      1
    );

    const playAreaModelBounds = translateMVT.viewToModelBounds( playAreaViewBounds ).dilatedX( -20 ).dilatedY( -19 );

    const objectsPlayAreaNode = new ObjectsPlayAreaNode(
      objectsPlayArea,
      playAreaModelBounds,
      translateMVT
    );
    contentNode.addChild( objectsPlayAreaNode );

    // create the icons for the RadioButtonGroup
    const buttons = [];
    PlayObjectType.VALUES.forEach( playObjectType => {
      const iconNode = new PlayObjectNode(
        new PlayObject(
          new EnumerationProperty( PlayObjectType, playObjectType ),
          new Vector2( 0, 0 ),
          config.radioButtonSize,
          1
        ),
        playAreaModelBounds,
        translateMVT
      );

      buttons.push( {
        value: playObjectType,
        node: iconNode
      } );
    } );

    // create and add the RadioButtonGroup, which is a control for changing the PlayObjectType of the playObjects
    const radioButtonGroup = new RadioButtonGroup( objectsPlayArea.playObjectTypeProperty, buttons, {
      baseColor: Color.WHITE,
      orientation: 'horizontal',
      spacing: config.radioButtonSpacing
    } );
    radioButtonGroup.right = playAreaViewBounds.right - 2; // empirically determined tweak
    radioButtonGroup.bottom = playAreaViewBounds.bottom;
    contentNode.addChild( radioButtonGroup );

    super( contentNode, config );
  }
}

numberPlay.register( 'ObjectsAccordionBox', ObjectsAccordionBox );
export default ObjectsAccordionBox;