// Copyright 2019-2023, University of Colorado Boulder

/**
 * Class for the 'Ten Frame' accordion box, which is the panel in the upper right corner of the sim that displays a
 * dot-grid representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberPlayStrings from '../../NumberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import TenFrameNode from '../../../../number-suite-common/js/common/view/TenFrameNode.js';
import NumberSuiteCommonAccordionBox, { NumberSuiteCommonAccordionBoxOptions } from '../../../../number-suite-common/js/common/view/NumberSuiteCommonAccordionBox.js';
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
  StrictOmit<NumberSuiteCommonAccordionBoxOptions, 'titleStringProperty' | 'titleTextOptions'>;

class TenFrameAccordionBox extends NumberSuiteCommonAccordionBox {

  public constructor( currentNumberProperty: TReadOnlyProperty<number>, sumRange: Range,
                      height: number, providedOptions: TenFrameAccordionBoxOptions ) {

    const tenFrameNode = new TenFrameNode( currentNumberProperty, sumRange );

    // Singular vs plural title, based on how many 'ten frames' we have.
    // See https://github.com/phetsims/number-play/issues/192
    const titleStringProperty = ( tenFrameNode.numberOfTenFrames > 1 ) ?
                                NumberPlayStrings.tenFramesStringProperty :
                                NumberPlayStrings.tenFrameStringProperty;

    const options = optionize<TenFrameAccordionBoxOptions, SelfOptions, NumberSuiteCommonAccordionBoxOptions>()( {
      titleStringProperty: titleStringProperty,
      titleTextOptions: {
        maxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      }
    }, providedOptions );

    super( NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH, new Property<number>( height ), options );

    tenFrameNode.scale( height / tenFrameNode.height / 2 );
    tenFrameNode.centerX = this.contentBoundsProperty.value.centerX + options.tenFrameOffsetX;
    tenFrameNode.centerY = this.contentBoundsProperty.value.centerY;
    this.contentNode.addChild( tenFrameNode );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'TenFrameAccordionBox', TenFrameAccordionBox );
export default TenFrameAccordionBox;