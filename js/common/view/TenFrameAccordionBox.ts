// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Ten Frame' accordion box, which is the panel in the upper right corner of the sim that displays a
 * dot-grid representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import numberPlayStrings from '../../numberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import TenFrameNode from './TenFrameNode.js';
import NumberPlayAccordionBox, { NumberPlayAccordionBoxOptions } from './NumberPlayAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';

// types
type SelfOptions = {
  tenFrameOffsetX: number;
};
export type TenFrameAccordionBoxOptions = SelfOptions & NumberPlayAccordionBoxOptions;

class TenFrameAccordionBox extends NumberPlayAccordionBox {

  public constructor( currentNumberProperty: IReadOnlyProperty<number>, sumRange: Range,
               height: number, options: TenFrameAccordionBoxOptions ) {

    super( NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH, height,
      optionize<TenFrameAccordionBoxOptions, SelfOptions, NumberPlayAccordionBoxOptions>()( {
        titleString: numberPlayStrings.tenFrame,
        titleMaxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      }, options ) );

    // create, scale, and add the TenFrameNode
    const tenFrameNode = new TenFrameNode( currentNumberProperty, sumRange );
    tenFrameNode.scale( height / tenFrameNode.height / 2 );
    tenFrameNode.centerX = this.contentBounds.centerX + options.tenFrameOffsetX;
    tenFrameNode.centerY = this.contentBounds.centerY;
    this.contentNode.addChild( tenFrameNode );
  }
}

numberPlay.register( 'TenFrameAccordionBox', TenFrameAccordionBox );
export default TenFrameAccordionBox;