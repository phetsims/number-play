// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Ten Frame' accordion box, which is the panel in the upper right corner of the sim that displays a
 * dot-grid representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberPlayStrings from '../../NumberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import TenFrameNode from './TenFrameNode.js';
import NumberPlayAccordionBox, { NumberPlayAccordionBoxOptions } from './NumberPlayAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';

// types
type SelfOptions = {
  tenFrameOffsetX: number;
};
export type TenFrameAccordionBoxOptions = SelfOptions &
  StrictOmit<NumberPlayAccordionBoxOptions, 'titleStringProperty' | 'titleMaxWidth'>;

class TenFrameAccordionBox extends NumberPlayAccordionBox {

  public constructor( currentNumberProperty: TReadOnlyProperty<number>, sumRange: Range,
                      height: number, options: TenFrameAccordionBoxOptions ) {

    super( NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH, new Property<number>( height ),
      optionize<TenFrameAccordionBoxOptions, SelfOptions, NumberPlayAccordionBoxOptions>()( {
        titleStringProperty: NumberPlayStrings.tenFrameStringProperty,
        titleMaxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      }, options ) );

    // create, scale, and add the TenFrameNode
    const tenFrameNode = new TenFrameNode( currentNumberProperty, sumRange );
    tenFrameNode.scale( height / tenFrameNode.height / 2 );
    tenFrameNode.centerX = this.contentBoundsProperty.value.centerX + options.tenFrameOffsetX;
    tenFrameNode.centerY = this.contentBoundsProperty.value.centerY;
    this.contentNode.addChild( tenFrameNode );
  }
}

numberPlay.register( 'TenFrameAccordionBox', TenFrameAccordionBox );
export default TenFrameAccordionBox;