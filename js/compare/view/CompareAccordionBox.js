// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for the `Objects` accordion box on the 'Compare' screen, which mixes the functionality of ObjectsAccordionBox
 * and OnesAccordionBox
 *
 * TODO: Generalize the ObjectsAccordionBox and OnesAccordionBox so that they share code, which will remove the need
 * to use both ObjectsPlayAreaNode and OnesPlayAreaNode. See https://github.com/phetsims/number-play/issues/7
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import BaseNumber from '../../../../counting-common/js/common/model/BaseNumber.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PlayObject from '../../common/model/PlayObject.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import BaseNumberNode from '../../common/view/BaseNumberNode.js';
import ObjectsPlayAreaNode from '../../common/view/ObjectsPlayAreaNode.js';
import OnesPlayAreaNode from '../../common/view/OnesPlayAreaNode.js';
import PlayObjectNode from '../../common/view/PlayObjectNode.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import ComparePlayObjectType from '../model/ComparePlayObjectType.js';

// constants
const WIDTH = 394; // the width of this AccordionBox, in screen coordinates. from the screen's design asset.

const objectsString = numberPlayStrings.objects;

class CompareAccordionBox extends AccordionBox {

  /**
   * @param {ComparePlayArea} playArea
   * @param {number} height - the height of this accordion box
   * @param {Object} [options]
   */
  constructor( playArea, height, options ) {

    options = merge( {
      titleNode: new Text( objectsString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
      fill: NumberPlayConstants.BLUE_BACKGROUND,
      minWidth: WIDTH,
      maxWidth: WIDTH,

      contentWidth: 350, // {number}
      radioButtonSize: new Dimension2( 28, 28 ), // {Dimension2}
      radioButtonSpacing: 10 // {number}
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, options );

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: options.contentWidth
    } );

    // create view bounds for the ObjectsPlayAreaNode
    const playAreaMarginY = 15;
    const objectsPlayAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top + playAreaMarginY,
      contentNode.right,
      contentNode.bottom - playAreaMarginY
    );
    const translateMVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( objectsPlayAreaViewBounds.left + NumberPlayConstants.BUCKET_SIZE.width / 2, objectsPlayAreaViewBounds.bottom ),
      1
    );
    const playAreaModelBounds = translateMVT.viewToModelBounds( objectsPlayAreaViewBounds ).dilatedX( -20 ).dilatedY( -19 );

    // create and add the ObjectsPlayAreaNode
    const objectsPlayAreaNode = new ObjectsPlayAreaNode(
      playArea.objectsPlayArea,
      playAreaModelBounds,
      translateMVT
    );
    contentNode.addChild( objectsPlayAreaNode );

    // create view bounds for the OnesPlayAreaNode
    const onesPlayAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top,
      contentNode.right,
      contentNode.bottom - playAreaMarginY
    );

    // create and add the OnesPlayAreaNode
    const onesPlayAreaNode = new OnesPlayAreaNode(
      playArea.onesPlayArea,
      onesPlayAreaViewBounds,
      translateMVT
    );
    contentNode.addChild( onesPlayAreaNode );

    // create the icons for the RectangularRadioButtonGroup
    const buttons = [];
    ComparePlayObjectType.VALUES.forEach( playObjectType => {
      let iconNode = null;
      if ( playObjectType === ComparePlayObjectType.PAPER_ONE ) {
        iconNode = new BaseNumberNode( new BaseNumber( 1, 0 ), 1 );
        iconNode.setScaleMagnitude( options.radioButtonSize.height / iconNode.height / 4 );
      }
      else {
        iconNode = new PlayObjectNode(
          new PlayObject(
            new EnumerationProperty( ComparePlayObjectType, playObjectType ),
            new Vector2( 0, 0 ),
            options.radioButtonSize,
            1
          ),
          playAreaModelBounds,
          _.noop,
          translateMVT
        );
      }

      buttons.push( {
        value: playObjectType,
        node: iconNode
      } );
    } );

    // create and add the RectangularRadioButtonGroup, which is a control for changing the ComparePlayObjectType of this play area
    const radioButtonGroup = new RectangularRadioButtonGroup( playArea.playObjectTypeProperty, buttons, {
      baseColor: Color.WHITE,
      orientation: 'horizontal',
      spacing: options.radioButtonSpacing
    } );
    radioButtonGroup.right = objectsPlayAreaViewBounds.right - 2; // empirically determined tweak
    radioButtonGroup.bottom = objectsPlayAreaViewBounds.bottom;
    contentNode.addChild( radioButtonGroup );

    // since (for now) there are two underlying play areas in place of one, hide and show whichever is appropriate
    // based on the value of playObjectTypeProperty
    playArea.playObjectTypeProperty.link( type => {
      if ( type === ComparePlayObjectType.PAPER_ONE ) {
        objectsPlayAreaNode.visible = false;
        onesPlayAreaNode.visible = true;
      }
      else {
        onesPlayAreaNode.visible = false;
        objectsPlayAreaNode.visible = true;
      }
    } );

    super( contentNode, options );
  }
}

numberPlay.register( 'CompareAccordionBox', CompareAccordionBox );
export default CompareAccordionBox;