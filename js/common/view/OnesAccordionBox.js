// Copyright 2019, University of Colorado Boulder

/**
 * Class for the 'Ones' accordion box, which is the panel in the lower left corner of the sim that displays an
 * environment for counting with ones.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberPlayStrings from '../../number-play-strings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import OnesPlayAreaNode from './OnesPlayAreaNode.js';

const onesString = numberPlayStrings.ones;

class OnesAccordionBox extends AccordionBox {

  /**
   * @param {OnesPlayArea} onesPlayArea
   * @param {number} height - the height of this accordion box
   * @param {Object} [options]
   */
  constructor( onesPlayArea, height, config ) {

    config = merge( {
      titleNode: new Text( onesString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
      fill: NumberPlayConstants.PURPLE_BACKGROUND,

      contentWidth: null // {number} @required
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

    assert && assert( config.contentWidth, `contentWidth is required: ${config.contentWidth}` );

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: config.contentWidth
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

    const onesPlayAreaNode = new OnesPlayAreaNode(
      onesPlayArea,
      playAreaViewBounds,
      translateMVT
    );
    contentNode.addChild( onesPlayAreaNode );

    super( contentNode, config );
  }
}

numberPlay.register( 'OnesAccordionBox', OnesAccordionBox );
export default OnesAccordionBox;