// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for the 'Ones' accordion box, which is the panel in the lower left corner of the sim that displays an
 * environment for counting with ones.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayColors from '../NumberPlayColors.js';
import NumberPlayConstants, { AccordionBoxOptions } from '../NumberPlayConstants.js';
import OnesPlayAreaNode from './OnesPlayAreaNode.js';
import OnesPlayArea from '../model/OnesPlayArea.js';

const onesString = numberPlayStrings.ones;

class OnesAccordionBox extends AccordionBox {

  constructor( onesPlayArea: OnesPlayArea, height: number, providedOptions: Partial<AccordionBoxOptions> ) {

    const options = merge( {
      titleNode: new Text( onesString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_TITLE_MAX_WIDTH
      } ),
      minWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_WIDTH,
      fill: NumberPlayColors.purpleBackgroundColorProperty
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, providedOptions ) as AccordionBoxOptions;

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

    super( contentNode, options );
  }
}

numberPlay.register( 'OnesAccordionBox', OnesAccordionBox );
export default OnesAccordionBox;