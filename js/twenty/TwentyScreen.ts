// Copyright 2019-2022, University of Colorado Boulder

/**
 * The 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import NumberSuiteCommonColors from '../../../number-suite-common/js/common/NumberSuiteCommonColors.js';
import NumberSuiteCommonConstants from '../../../number-suite-common/js/common/NumberSuiteCommonConstants.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import twentyScreenIcon_png from '../../images/twentyScreenIcon_png.js';
import NumberPlayModel from '../common/model/NumberPlayModel.js';
import NumberPlayColors from '../common/NumberPlayColors.js';
import NumberPlayConstants from '../common/NumberPlayConstants.js';
import NumberPlayScreenView, { NumberPlayScreenViewOptions } from '../common/view/NumberPlayScreenView.js';
import numberPlay from '../numberPlay.js';
import NumberPlayStrings from '../NumberPlayStrings.js';

class TwentyScreen extends Screen<NumberPlayModel, NumberPlayScreenView> {

  public constructor( tandem: Tandem ) {

    const screenOptions = {
      name: NumberPlayStrings.screen.twentyStringProperty,
      backgroundColorProperty: NumberSuiteCommonColors.lightOrangeBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( twentyScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    const screenViewConfig: NumberPlayScreenViewOptions = {
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
      tandem: tandem.createTandem( 'view' )
    };

    super(
      () => new NumberPlayModel(
        NumberPlayConstants.TWENTY,
        tandem.createTandem( 'model' )
      ),
      model => new NumberPlayScreenView( model, screenViewConfig ),
      screenOptions
    );
  }
}

numberPlay.register( 'TwentyScreen', TwentyScreen );
export default TwentyScreen;