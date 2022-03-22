// Copyright 2022, University of Colorado Boulder

/**
 * Base class for all Number Play accordion boxes.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  titleString: string,
  titleMaxWidth: number
};
export type NumberPlayAccordionBoxOptions = SelfOptions & AccordionBoxOptions;

// constants
const PADDING = 10;
const EXPAND_COLLAPSE_BUTTON_SIZE = 20;

class NumberPlayAccordionBox extends AccordionBox {
  protected readonly contentNode: Rectangle;
  protected readonly contentBounds: Bounds2;

  constructor( contentWidth: number, contentHeight: number, options: NumberPlayAccordionBoxOptions ) {

    const contentNode = new Rectangle( {
      rectWidth: contentWidth - EXPAND_COLLAPSE_BUTTON_SIZE - ( PADDING * 2 ),
      rectHeight: contentHeight
    } );

    const innerContentBounds = new Bounds2( contentNode.left, contentNode.top, contentNode.right, contentNode.bottom );

    // override the local bounds so they don't change
    contentNode.localBounds = innerContentBounds;

    super( contentNode, optionize<NumberPlayAccordionBoxOptions, SelfOptions, AccordionBoxOptions>( {
      titleNode: new Text( options.titleString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: options.titleMaxWidth
      } ),
      titleAlignX: 'left',
      titleXSpacing: 8,
      showTitleWhenExpanded: false,
      cornerRadius: 6,
      titleYMargin: PADDING,
      buttonXMargin: PADDING,
      buttonYMargin: PADDING,
      contentXMargin: PADDING,
      contentYMargin: 0,
      contentXSpacing: 0,
      contentAlign: 'left',
      expandCollapseButtonOptions: {
        sideLength: EXPAND_COLLAPSE_BUTTON_SIZE
      }
    }, options ) );

    // expose contentNode so subclasses can add their content to it
    this.contentNode = contentNode;

    // expose the full bounds of the visible area inside the accordion box
    this.contentBounds = innerContentBounds.withOffsets( PADDING + EXPAND_COLLAPSE_BUTTON_SIZE, 0, PADDING, 0 );

    assert && assert( this.contentBounds.width === contentWidth,
      'available content bounds width should match provided contentWidth' );
    assert && assert( this.contentBounds.height === contentHeight,
      'available content bounds height should match provided height' );
  }
}

numberPlay.register( 'NumberPlayAccordionBox', NumberPlayAccordionBox );
export default NumberPlayAccordionBox;