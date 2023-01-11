// Copyright 2023, University of Colorado Boulder

/**
 * TenScreenView is the view for the 'Ten' screen.
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
import TenModel from '../model/TenModel.js';

export default class TenScreenView extends NumberPlayScreenView {

  public constructor( model: TenModel, tandem: Tandem ) {

    super( model, {
      wordAccordionBoxOptions: {
        fill: NumberPlayColors.purpleBackgroundColorProperty,
        font: new PhetFont( 62 ),
        textOffsetX: 30
      },
      totalAccordionBoxOptions: {
        fill: NumberSuiteCommonColors.lightOrangeBackgroundColorProperty,
        font: new PhetFont( 98 ),
        arrowButtonOptions: {
          arrowWidth: 20, // empirically determined
          arrowHeight: 20 // empirically determined
        },
        arrowButtonSpacing: 10 // empirically determined
      },
      tenFrameAccordionBoxOptions: {
        fill: NumberPlayColors.purpleBackgroundColorProperty,
        tenFrameOffsetX: 0
      },
      upperAccordionBoxHeight: NumberPlayConstants.TEN_UPPER_ACCORDION_BOX_HEIGHT,
      lowerAccordionBoxHeight: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_HEIGHT,
      tandem: tandem
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'TenScreenView', TenScreenView );