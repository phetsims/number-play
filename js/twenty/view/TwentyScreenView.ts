// Copyright 2023, University of Colorado Boulder

/**
 * TwentyScreenView is the view for the 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import numberPlay from '../../numberPlay.js';
import NumberPlayScreenView from '../../common/view/NumberPlayScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberSuiteCommonColors from '../../../../number-suite-common/js/common/NumberSuiteCommonColors.js';
import TwentyModel from '../model/TwentyModel.js';
import NumberSuiteCommonConstants from '../../../../number-suite-common/js/common/NumberSuiteCommonConstants.js';

export default class TwentyScreenView extends NumberPlayScreenView {

  public constructor( model: TwentyModel, tandem: Tandem ) {

    super( model, {
      wordAccordionBoxOptions: {
        fill: NumberPlayColors.orangeBackgroundColorProperty,
        font: new PhetFont( 54 ),
        textOffsetX: 40
      },
      totalAccordionBoxOptions: {
        fill: NumberSuiteCommonColors.lightPurpleBackgroundColorProperty,
        font: new PhetFont( 80 ),
        arrowButtonOptions: {
          arrowWidth: 16, // empirically determined
          arrowHeight: 16 // empirically determined
        },
        arrowButtonSpacing: 5 // empirically determined
      },
      tenFrameAccordionBoxOptions: {
        fill: NumberPlayColors.orangeBackgroundColorProperty,
        tenFrameOffsetX: 13
      },
      upperAccordionBoxHeight: NumberPlayConstants.TWENTY_UPPER_ACCORDION_BOX_HEIGHT,
      lowerAccordionBoxHeight: NumberSuiteCommonConstants.TALL_LOWER_ACCORDION_BOX_HEIGHT,
      tandem: tandem
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'TwentyScreenView', TwentyScreenView );