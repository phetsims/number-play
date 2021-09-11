// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for the 'Ten Frame' accordion box, which is the panel in the upper right corner of the sim that displays a
 * dot-grid representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import TenFrameNode from './TenFrameNode.js';

const tenFrameString = numberPlayStrings.tenFrame;

class TenFrameAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} currentNumberProperty
   * @param {number} height - the height of this accordion box
   * @param {Object} [options]
   */
  constructor( currentNumberProperty, height, options ) {

    options = merge( {
      titleNode: new Text( tenFrameString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      } ),
      minWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, options );

    const contentNode = new Rectangle( { rectHeight: height } );

    // create, scale, and add the TenFrameNode
    const tenFrameNode = new TenFrameNode( currentNumberProperty );
    tenFrameNode.scale( height / tenFrameNode.height / 2 );
    tenFrameNode.centerY = contentNode.centerY;
    contentNode.addChild( tenFrameNode );

    super( contentNode, options );
  }
}

numberPlay.register( 'TenFrameAccordionBox', TenFrameAccordionBox );
export default TenFrameAccordionBox;