// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for the 'Ones' accordion box, which is the panel in the lower left corner of the sim that displays an
 * environment for counting with ones.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
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
      titleNode: new Text( onesString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_TITLE_MAX_WIDTH
      } ),
      minWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_WIDTH,
      fill: NumberPlayConstants.PURPLE_BACKGROUND
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

    const onesPlayAreaNode = new OnesPlayAreaNode(
      onesPlayArea,
      playAreaViewBounds
    );
    contentNode.addChild( onesPlayAreaNode );

    super( contentNode, config );
  }
}

numberPlay.register( 'OnesAccordionBox', OnesAccordionBox );
export default OnesAccordionBox;